"use client";

import { useEffect } from "react";
import { QueuedPhoto } from "@/lib/offlineQueue";

interface QueueViewerProps {
  queue: QueuedPhoto[];
  onRefresh: () => void;
  onRemove: (id: number) => void;
  onClose: () => void;
}

export default function QueueViewer({
  queue,
  onRefresh,
  onRemove,
  onClose,
}: QueueViewerProps) {
  // Load full queue on open
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const statusBadge = (status: QueuedPhoto["status"]) => {
    switch (status) {
      case "queued":
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 text-surface-500 font-medium">
            Queued
          </span>
        );
      case "processing":
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-medium">
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">
            Queued Photos ({queue.length})
          </h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Queue list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {queue.length === 0 && (
            <p className="text-sm text-surface-400 text-center py-8">
              No photos in queue
            </p>
          )}

          {queue.map((photo) => (
            <div
              key={photo.id}
              className="flex items-start gap-3 bg-surface-50 rounded-xl p-3"
            >
              <img
                src={photo.preview}
                alt="Queued photo"
                className="w-16 h-16 rounded-lg object-cover border border-surface-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {statusBadge(photo.status)}
                </div>
                <div className="text-xs text-surface-500 space-y-0.5">
                  {photo.buildingName && (
                    <p>
                      {photo.buildingName}
                      {photo.roomName ? ` / ${photo.roomName}` : ""}
                    </p>
                  )}
                  <p>
                    {new Date(photo.timestamp).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {photo.status === "failed" && photo.errorMessage && (
                    <p className="text-red-500 mt-1">{photo.errorMessage}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => photo.id !== undefined && onRemove(photo.id)}
                className="shrink-0 text-surface-400 hover:text-red-500 transition-colors p-1"
                title="Remove from queue"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
