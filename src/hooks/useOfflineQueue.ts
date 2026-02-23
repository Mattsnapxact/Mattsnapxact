"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  QueuedPhoto,
  addToQueue,
  getQueuedPhotos,
  getQueueCount,
  removeFromQueue,
  updatePhotoStatus,
  resetFailedToQueued,
  MAX_QUEUE_SIZE,
  WARN_QUEUE_SIZE,
} from "@/lib/offlineQueue";
import { ExtractedLabel } from "@/types";

interface ProcessingProgress {
  current: number;
  total: number;
  failedCount: number;
}

interface UseOfflineQueueOptions {
  isOnline: boolean;
  onPhotoProcessed: (
    data: ExtractedLabel,
    preview: string,
    location: {
      buildingId: string;
      buildingName: string;
      roomId: string;
      roomName: string;
    }
  ) => void;
}

export default function useOfflineQueue({
  isOnline,
  onPhotoProcessed,
}: UseOfflineQueueOptions) {
  const [queueCount, setQueueCount] = useState(0);
  const [queue, setQueue] = useState<QueuedPhoto[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [showQueueViewer, setShowQueueViewer] = useState(false);
  const abortRef = useRef(false);

  // Load queue count on mount and when it changes
  const refreshQueue = useCallback(async () => {
    try {
      const count = await getQueueCount();
      setQueueCount(count);
    } catch {
      // IndexedDB may not be available
    }
  }, []);

  const refreshFullQueue = useCallback(async () => {
    try {
      const photos = await getQueuedPhotos();
      setQueue(photos);
      setQueueCount(photos.length);
    } catch {
      // IndexedDB may not be available
    }
  }, []);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  // Enqueue a photo when offline
  const enqueuePhoto = useCallback(
    async (
      base64: string,
      mimeType: string,
      preview: string,
      location: {
        buildingId: string;
        buildingName: string;
        roomId: string;
        roomName: string;
      }
    ): Promise<{ success: boolean; error?: string }> => {
      const currentCount = await getQueueCount();

      if (currentCount >= MAX_QUEUE_SIZE) {
        return {
          success: false,
          error:
            "Queue full. Process existing photos before scanning more.",
        };
      }

      try {
        await addToQueue({
          base64,
          mimeType,
          preview,
          buildingId: location.buildingId,
          buildingName: location.buildingName,
          roomId: location.roomId,
          roomName: location.roomName,
        });
        await refreshQueue();
        return { success: true };
      } catch {
        return {
          success: false,
          error: "Storage full. Process queue first.",
        };
      }
    },
    [refreshQueue]
  );

  // Process all queued photos sequentially
  const processQueue = useCallback(async () => {
    if (isProcessingQueue || !isOnline) return;

    setIsProcessingQueue(true);
    abortRef.current = false;

    const photos = await getQueuedPhotos();
    const pending = photos.filter((p) => p.status === "queued" || p.status === "failed");

    if (pending.length === 0) {
      setIsProcessingQueue(false);
      return;
    }

    let failedCount = 0;
    setProgress({ current: 0, total: pending.length, failedCount: 0 });

    for (let i = 0; i < pending.length; i++) {
      if (abortRef.current) break;

      const photo = pending[i];
      const photoId = photo.id!;

      setProgress({ current: i + 1, total: pending.length, failedCount });

      // Mark as processing
      await updatePhotoStatus(photoId, "processing");

      try {
        // Send to extract API
        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: photo.base64, mimeType: photo.mimeType }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: "Network error" }));
          throw new Error(err.error || "Extraction failed");
        }

        const { data } = (await response.json()) as { data: ExtractedLabel };

        // Success — pass to parent for auto-save, then remove from queue
        onPhotoProcessed(data, photo.preview, {
          buildingId: photo.buildingId,
          buildingName: photo.buildingName,
          roomId: photo.roomId,
          roomName: photo.roomName,
        });

        await removeFromQueue(photoId);
      } catch (err) {
        // Network failure or API error — mark as failed, continue to next
        failedCount++;
        const message = err instanceof Error ? err.message : "Unknown error";
        await updatePhotoStatus(photoId, "failed", message);
        setProgress((prev) =>
          prev ? { ...prev, failedCount } : null
        );

        // If we're offline now, stop processing
        if (!navigator.onLine) {
          abortRef.current = true;
          break;
        }
      }
    }

    await refreshQueue();
    setIsProcessingQueue(false);

    // Keep progress visible briefly so user can see the result
    if (failedCount === 0) {
      setTimeout(() => setProgress(null), 2000);
    }
    // If there are failures, keep progress visible until user acts
  }, [isProcessingQueue, isOnline, onPhotoProcessed, refreshQueue]);

  // Stop processing mid-batch
  const stopProcessing = useCallback(() => {
    abortRef.current = true;
  }, []);

  // Remove a single photo from queue
  const removePhoto = useCallback(
    async (id: number) => {
      await removeFromQueue(id);
      await refreshFullQueue();
    },
    [refreshFullQueue]
  );

  // Retry all failed photos
  const retryFailed = useCallback(async () => {
    await resetFailedToQueued();
    await refreshQueue();
    processQueue();
  }, [refreshQueue, processQueue]);

  // Dismiss progress (after failures are acknowledged)
  const dismissProgress = useCallback(() => {
    setProgress(null);
  }, []);

  const isNearCapacity = queueCount >= WARN_QUEUE_SIZE;
  const isAtCapacity = queueCount >= MAX_QUEUE_SIZE;
  const hasFailures = progress !== null && progress.failedCount > 0 && !isProcessingQueue;

  return {
    queueCount,
    queue,
    isProcessingQueue,
    progress,
    showQueueViewer,
    setShowQueueViewer,
    isNearCapacity,
    isAtCapacity,
    hasFailures,
    enqueuePhoto,
    processQueue,
    stopProcessing,
    removePhoto,
    retryFailed,
    refreshFullQueue,
    dismissProgress,
  };
}
