"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import CameraCapture from "@/components/CameraCapture";
import ScanList from "@/components/ScanList";
import { ScanItem, ExtractedLabel } from "@/types";

export default function ScanPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<ScanItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        setItems((prev) =>
          prev.map((item) =>
            item.id === tempId
              ? {
                  ...item,
                  extractedData: data,
                  editedData: { ...data },
                  status: "review" as const,
                }
              : item
          )
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setItems((prev) => prev.filter((item) => item.id !== tempId));
      } finally {
        setIsProcessing(false);
      }
    },
    []
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

  const handleConfirmItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "confirmed" as const } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setItems([]);
  }, []);

  const handleSaveToAccount = async () => {
    if (!session) return;

    const confirmedItems = items.filter(
      (i) => i.status === "confirmed" || i.status === "review"
    );
    if (confirmedItems.length === 0) return;

    try {
      const response = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: uuidv4(),
          scans: confirmedItems.map((item) => ({
            manufacturer: item.editedData.manufacturer,
            model: item.editedData.model,
            serialNumber: item.editedData.serialNumber,
            assetTag: item.editedData.assetTag,
            extraFields: item.editedData.extraFields,
            rawText: item.editedData.rawText,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to save");
      alert("Scans saved to your account!");
    } catch {
      alert("Failed to save scans. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Scan a Label</h1>
        <p className="text-surface-500 mt-1">
          Take a photo or upload an image of an equipment label.
          We&apos;ll extract the data automatically.
        </p>
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

      {/* Save to account button (logged in users only) */}
      {session && items.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleSaveToAccount}
            className="w-full text-sm font-medium text-brand-600 hover:text-brand-700 py-2 transition-default"
          >
            Save to my account
          </button>
        </div>
      )}
    </div>
  );
}
