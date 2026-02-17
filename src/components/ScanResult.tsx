"use client";

import { useState } from "react";
import { ScanItem } from "@/types";

interface ScanResultProps {
  item: ScanItem;
  onUpdate: (id: string, data: ScanItem["editedData"]) => void;
  onConfirm: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function ScanResult({
  item,
  onUpdate,
  onConfirm,
  onRemove,
}: ScanResultProps) {
  const [isEditing, setIsEditing] = useState(item.status === "draft");
  const data = item.editedData;

  const updateField = (field: string, value: string) => {
    if (field.startsWith("extra.")) {
      const key = field.replace("extra.", "");
      onUpdate(item.id, {
        ...data,
        extraFields: { ...data.extraFields, [key]: value },
      });
    } else {
      onUpdate(item.id, { ...data, [field]: value });
    }
  };

  const confidenceColor =
    data.confidence === "high"
      ? "bg-green-100 text-green-700"
      : data.confidence === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  if (item.status === "processing") {
    return (
      <div className="bg-white border border-surface-200 rounded-xl p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-200" />
          <div className="flex-1">
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-100 rounded w-1/2" />
          </div>
        </div>
        <p className="text-sm text-surface-500 mt-3 text-center">
          Analyzing label...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-surface-50 border-b border-surface-200">
        <div className="flex items-center gap-3">
          {item.imagePreview && (
            <img
              src={item.imagePreview}
              alt="Label"
              className="w-10 h-10 rounded-lg object-cover border border-surface-200"
            />
          )}
          <div>
            <p className="text-sm font-medium text-surface-800">
              {data.manufacturer || "Unknown"}{" "}
              {data.model || ""}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${confidenceColor}`}
              >
                {data.confidence} confidence
              </span>
              {item.status === "draft" && (
                <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                  Draft
                </span>
              )}
              {item.status === "confirmed" && (
                <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                  Confirmed
                </span>
              )}
              {item.dbId && (
                <span className="text-xs text-surface-400" title="Saved to database">
                  <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {item.status !== "confirmed" && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-default"
            >
              {isEditing ? "Collapse" : "Edit"}
            </button>
          )}
          <button
            onClick={() => onRemove(item.id)}
            className="text-surface-400 hover:text-red-500 transition-default"
            title="Remove"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Editable fields */}
      {isEditing && (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput
              label="Manufacturer"
              value={data.manufacturer}
              onChange={(v) => updateField("manufacturer", v)}
            />
            <FieldInput
              label="Model"
              value={data.model}
              onChange={(v) => updateField("model", v)}
            />
            <FieldInput
              label="Serial Number"
              value={data.serialNumber}
              onChange={(v) => updateField("serialNumber", v)}
            />
            <FieldInput
              label="Asset Tag"
              value={data.assetTag}
              onChange={(v) => updateField("assetTag", v)}
            />
          </div>

          {/* Extra fields */}
          {Object.keys(data.extraFields).length > 0 && (
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-2">
                Additional Fields
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(data.extraFields).map(([key, value]) => (
                  <FieldInput
                    key={key}
                    label={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                    value={value}
                    onChange={(v) => updateField(`extra.${key}`, v)}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              onConfirm(item.id);
              setIsEditing(false);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-default"
          >
            Confirm Data
          </button>
        </div>
      )}

      {/* Confirmed state - compact view */}
      {item.status === "confirmed" && !isEditing && (
        <div className="px-5 py-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {data.serialNumber && (
              <span className="text-surface-600">
                <span className="text-surface-400">S/N:</span>{" "}
                {data.serialNumber}
              </span>
            )}
            {data.assetTag && (
              <span className="text-surface-600">
                <span className="text-surface-400">Asset:</span>{" "}
                {data.assetTag}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-surface-500 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-white text-surface-800 placeholder-surface-300 focus:border-brand-500"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
