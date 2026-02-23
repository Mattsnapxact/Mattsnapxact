"use client";

import { useState } from "react";
import { ScanItem } from "@/types";
import ScanResult from "./ScanResult";
import { generateCSV } from "@/lib/csv";

interface ScanListProps {
  items: ScanItem[];
  onUpdateItem: (id: string, data: ScanItem["editedData"]) => void;
  onConfirmItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export default function ScanList({
  items,
  onUpdateItem,
  onConfirmItem,
  onRemoveItem,
  onClearAll,
}: ScanListProps) {
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const confirmedCount = items.filter((i) => i.status === "confirmed").length;
  const draftCount = items.filter((i) => i.status === "draft").length;
  const totalCount = items.length;

  const handleExportCSV = () => {
    const exportItems = includeDrafts
      ? items.filter((i) => i.status === "confirmed" || i.status === "draft")
      : items.filter((i) => i.status === "confirmed");
    if (exportItems.length === 0) return;

    const csv = generateCSV(exportItems);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snapxact-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Batch controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-surface-900">
            Scanned Items
          </h2>
          <p className="text-sm text-surface-500">
            {confirmedCount} confirmed{draftCount > 0 ? `, ${draftCount} draft${draftCount !== 1 ? "s" : ""}` : ""} &mdash; {totalCount} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {draftCount > 0 && (
            <label className="flex items-center gap-1.5 text-xs text-surface-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeDrafts}
                onChange={(e) => setIncludeDrafts(e.target.checked)}
                className="rounded border-surface-300 text-brand-600 focus:ring-brand-500"
              />
              Include drafts
            </label>
          )}
          <button
            onClick={onClearAll}
            className="text-sm text-surface-400 hover:text-red-500 transition-default px-3 py-1.5"
          >
            Clear all
          </button>
          <button
            onClick={handleExportCSV}
            disabled={
              includeDrafts
                ? items.filter((i) => i.status === "confirmed" || i.status === "draft").length === 0
                : confirmedCount === 0
            }
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-default disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Scan items list */}
      <div className="space-y-3">
        {items.map((item) => (
          <ScanResult
            key={item.id}
            item={item}
            onUpdate={onUpdateItem}
            onConfirm={onConfirmItem}
            onRemove={onRemoveItem}
          />
        ))}
      </div>

      {/* Bottom export bar for many items */}
      {items.length > 3 && (
        <div className="sticky bottom-4">
          <button
            onClick={handleExportCSV}
            disabled={items.filter((i) => i.status !== "processing").length === 0}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-default disabled:opacity-50"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export {items.filter((i) => i.status !== "processing").length} items
            to CSV
          </button>
        </div>
      )}
    </div>
  );
}
