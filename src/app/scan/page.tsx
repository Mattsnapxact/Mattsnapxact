"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import CameraCapture from "@/components/CameraCapture";
import ScanList from "@/components/ScanList";
import LocationPicker, { SelectedLocation } from "@/components/LocationPicker";
import DuplicateWarning, { DuplicateInfo } from "@/components/DuplicateWarning";
import { ScanItem, ExtractedLabel } from "@/types";

interface PendingDuplicate {
  tempId: string;
  data: ExtractedLabel;
  duplicate: DuplicateInfo;
}

export default function ScanPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<ScanItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftsLoaded, setDraftsLoaded] = useState(false);
  const [pendingDuplicate, setPendingDuplicate] = useState<PendingDuplicate | null>(null);
  const [location, setLocation] = useState<SelectedLocation>({
    buildingId: "",
    buildingName: "",
    roomId: "",
    roomName: "",
  });
  const prevLocationRef = useRef(location);

  // Load existing drafts when location changes (logged-in users)
  useEffect(() => {
    if (!session) return;
    const prev = prevLocationRef.current;
    prevLocationRef.current = location;

    // Skip if location hasn't actually changed (initial render handled by draftsLoaded)
    if (draftsLoaded && prev.buildingId === location.buildingId && prev.roomId === location.roomId) return;

    const params = new URLSearchParams();
    if (location.buildingId) params.set("buildingId", location.buildingId);
    if (location.roomId) params.set("roomId", location.roomId);

    fetch(`/api/scans/drafts?${params}`)
      .then((res) => res.json())
      .then((data) => {
        const drafts: ScanItem[] = (data.scans || []).map(
          (scan: {
            id: string;
            manufacturer: string | null;
            model: string | null;
            serialNumber: string | null;
            assetTag: string | null;
            extraFields: Record<string, string>;
            rawText: string | null;
            createdAt: string;
            buildingId: string | null;
            buildingName: string | null;
            roomId: string | null;
            roomName: string | null;
            confidence?: string;
          }) => ({
            id: uuidv4(),
            dbId: scan.id,
            extractedData: {
              manufacturer: scan.manufacturer || "",
              model: scan.model || "",
              serialNumber: scan.serialNumber || "",
              assetTag: scan.assetTag || "",
              extraFields: scan.extraFields || {},
              rawText: scan.rawText || "",
              confidence: "high" as const,
            },
            editedData: {
              manufacturer: scan.manufacturer || "",
              model: scan.model || "",
              serialNumber: scan.serialNumber || "",
              assetTag: scan.assetTag || "",
              extraFields: scan.extraFields || {},
              rawText: scan.rawText || "",
              confidence: "high" as const,
            },
            timestamp: new Date(scan.createdAt),
            status: "draft" as const,
            buildingId: scan.buildingId || undefined,
            buildingName: scan.buildingName || undefined,
            roomId: scan.roomId || undefined,
            roomName: scan.roomName || undefined,
          })
        );

        // Merge: keep processing items, replace drafts
        setItems((prev) => {
          const processingItems = prev.filter((i) => i.status === "processing");
          const newItems = prev.filter(
            (i) => i.status !== "processing" && i.status !== "draft"
          );
          return [...processingItems, ...newItems, ...drafts];
        });
        setDraftsLoaded(true);
      })
      .catch(() => {
        setDraftsLoaded(true);
      });
  }, [session, location, draftsLoaded]);

  // Check if a serial number already exists in the database
  const checkDuplicate = useCallback(
    async (serialNumber: string): Promise<DuplicateInfo | null> => {
      if (!session || !serialNumber.trim()) return null;

      try {
        const res = await fetch(
          `/api/scans/check-duplicate?serialNumber=${encodeURIComponent(serialNumber.trim())}`
        );
        if (!res.ok) return null;
        const { duplicate } = await res.json();
        return duplicate || null;
      } catch {
        return null;
      }
    },
    [session]
  );

  // Auto-save a scan to the database
  const autoSave = useCallback(
    async (data: ExtractedLabel, loc: SelectedLocation): Promise<string | null> => {
      if (!session) return null;

      try {
        const res = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "draft",
            manufacturer: data.manufacturer,
            model: data.model,
            serialNumber: data.serialNumber,
            assetTag: data.assetTag,
            extraFields: data.extraFields,
            rawText: data.rawText,
            buildingId: loc.buildingId || null,
            roomId: loc.roomId || null,
          }),
        });

        if (!res.ok) return null;
        const { scan } = await res.json();
        return scan.id as string;
      } catch {
        return null;
      }
    },
    [session]
  );

  const handleCapture = useCallback(
    async (base64: string, mimeType: string, preview: string) => {
      setError(null);
      setIsProcessing(true);

      const tempId = uuidv4();
      const placeholderItem: ScanItem = {
        id: tempId,
        imagePreview: preview,
        extractedData: {
          manufacturer: "",
          model: "",
          serialNumber: "",
          assetTag: "",
          extraFields: {},
          rawText: "",
          confidence: "medium",
        },
        editedData: {
          manufacturer: "",
          model: "",
          serialNumber: "",
          assetTag: "",
          extraFields: {},
          rawText: "",
          confidence: "medium",
        },
        timestamp: new Date(),
        status: "processing",
        buildingId: location.buildingId || undefined,
        buildingName: location.buildingName || undefined,
        roomId: location.roomId || undefined,
        roomName: location.roomName || undefined,
      };

      setItems((prev) => [placeholderItem, ...prev]);

      try {
        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mimeType }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Extraction failed");
        }

        const { data } = (await response.json()) as { data: ExtractedLabel };

        // Check for duplicate serial number before auto-saving
        const duplicate = await checkDuplicate(data.serialNumber);

        if (duplicate) {
          // Pause — show warning, keep placeholder visible but stop the spinner
          setItems((prev) =>
            prev.map((item) =>
              item.id === tempId
                ? {
                    ...item,
                    extractedData: data,
                    editedData: { ...data },
                    // Keep as "processing" visually until user decides
                    status: "processing" as const,
                  }
                : item
            )
          );
          setPendingDuplicate({ tempId, data, duplicate });
          return; // Wait for user decision — isProcessing stays true
        }

        // No duplicate — auto-save immediately
        const dbId = await autoSave(data, location);

        setItems((prev) =>
          prev.map((item) =>
            item.id === tempId
              ? {
                  ...item,
                  dbId: dbId || undefined,
                  extractedData: data,
                  editedData: { ...data },
                  status: "draft" as const,
                }
              : item
          )
        );
        setIsProcessing(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setItems((prev) => prev.filter((item) => item.id !== tempId));
        setIsProcessing(false);
      }
    },
    [location, autoSave, checkDuplicate]
  );

  const handleUpdateItem = useCallback(
    (id: string, data: ScanItem["editedData"]) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, editedData: data } : item
        )
      );
    },
    []
  );

  const handleConfirmItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      // Update DB record if we have one
      if (item.dbId && session) {
        try {
          await fetch(`/api/scans/${item.dbId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "confirmed",
              manufacturer: item.editedData.manufacturer,
              model: item.editedData.model,
              serialNumber: item.editedData.serialNumber,
              assetTag: item.editedData.assetTag,
              extraFields: item.editedData.extraFields,
              rawText: item.editedData.rawText,
            }),
          });
        } catch {
          // Silently fail — local state still updates
        }
      }

      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status: "confirmed" as const } : i
        )
      );
    },
    [items, session]
  );

  const handleRemoveItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);

      // Delete from DB if we have a record
      if (item?.dbId && session) {
        try {
          await fetch(`/api/scans/${item.dbId}`, { method: "DELETE" });
        } catch {
          // Silently fail
        }
      }

      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [items, session]
  );

  // User chose "Scan Anyway" on duplicate warning
  const handleDuplicateScanAnyway = useCallback(async () => {
    if (!pendingDuplicate) return;
    const { tempId, data } = pendingDuplicate;
    setPendingDuplicate(null);

    const dbId = await autoSave(data, location);

    setItems((prev) =>
      prev.map((item) =>
        item.id === tempId
          ? {
              ...item,
              dbId: dbId || undefined,
              extractedData: data,
              editedData: { ...data },
              status: "draft" as const,
            }
          : item
      )
    );
    setIsProcessing(false);
  }, [pendingDuplicate, autoSave, location]);

  // User chose "Cancel" on duplicate warning
  const handleDuplicateCancel = useCallback(() => {
    if (!pendingDuplicate) return;
    const { tempId } = pendingDuplicate;
    setPendingDuplicate(null);
    setItems((prev) => prev.filter((i) => i.id !== tempId));
    setIsProcessing(false);
  }, [pendingDuplicate]);

  const handleClearAll = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Scan a Label</h1>
        <p className="text-surface-500 mt-1">
          Take a photo or upload an image of an equipment label.
          We&apos;ll extract the data automatically.
        </p>
      </div>

      {/* Location picker (logged-in users) */}
      <div className="mb-6">
        <LocationPicker value={location} onChange={setLocation} />
      </div>

      {/* Camera / Upload */}
      <CameraCapture onCapture={handleCapture} disabled={isProcessing} />

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <p className="font-medium">Extraction failed</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Duplicate serial number warning */}
      {pendingDuplicate && (
        <DuplicateWarning
          duplicate={pendingDuplicate.duplicate}
          onScanAnyway={handleDuplicateScanAnyway}
          onCancel={handleDuplicateCancel}
        />
      )}

      {/* Auto-save indicator */}
      {session && items.some((i) => i.dbId) && (
        <div className="mt-4 flex items-center gap-2 text-xs text-surface-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Scans are automatically saved to your account
        </div>
      )}

      {/* Scan results list */}
      <div className="mt-8">
        <ScanList
          items={items}
          onUpdateItem={handleUpdateItem}
          onConfirmItem={handleConfirmItem}
          onRemoveItem={handleRemoveItem}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}
