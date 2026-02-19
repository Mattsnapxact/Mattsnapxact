"use client";

export interface DuplicateInfo {
  serialNumber: string;
  buildingName: string | null;
  roomName: string | null;
  status: string;
  createdAt: string;
}

interface DuplicateWarningProps {
  duplicate: DuplicateInfo;
  onScanAnyway: () => void;
  onCancel: () => void;
}

export default function DuplicateWarning({
  duplicate,
  onScanAnyway,
  onCancel,
}: DuplicateWarningProps) {
  const locationParts = [duplicate.buildingName, duplicate.roomName].filter(Boolean);
  const locationStr = locationParts.length > 0
    ? locationParts.join(" \u2192 ")
    : "an unknown location";

  const dateStr = new Date(duplicate.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm">
      <div className="flex items-start gap-3">
        <span className="text-amber-500 text-lg leading-none shrink-0">&#9888;&#65039;</span>
        <div className="flex-1">
          <p className="font-medium text-amber-800">
            Possible duplicate serial number
          </p>
          <p className="mt-1 text-amber-700">
            Serial number <span className="font-mono font-semibold">{duplicate.serialNumber}</span> was
            already scanned in{" "}
            <span className="font-semibold">{locationStr}</span> on{" "}
            <span className="font-semibold">{dateStr}</span>
            {duplicate.status === "draft" ? " (draft)" : ""}.
            This might be a duplicate.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 transition-default"
            >
              Cancel
            </button>
            <button
              onClick={onScanAnyway}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-default"
            >
              Scan Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
