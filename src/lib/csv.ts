import { ScanItem } from "@/types";

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function generateCSV(items: ScanItem[]): string {
  if (items.length === 0) return "";

  // Collect all unique extra field keys across all items
  const allExtraKeys = new Set<string>();
  items.forEach((item) => {
    Object.keys(item.editedData.extraFields).forEach((key) =>
      allExtraKeys.add(key)
    );
  });
  const extraKeysArray = Array.from(allExtraKeys).sort();

  // Build header row
  const baseHeaders = [
    "Building",
    "Room",
    "Manufacturer",
    "Model",
    "Serial Number",
    "Asset Tag",
  ];
  const extraHeaders = extraKeysArray.map((key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
  );
  const headers = [...baseHeaders, ...extraHeaders, "Scan Date", "Confidence"];

  // Build data rows
  const rows = items.map((item) => {
    const data = item.editedData;
    const baseFields = [
      item.buildingName || "",
      item.roomName || "",
      data.manufacturer,
      data.model,
      data.serialNumber,
      data.assetTag,
    ];
    const extraFields = extraKeysArray.map(
      (key) => data.extraFields[key] || ""
    );
    const meta = [
      new Date(item.timestamp).toISOString().split("T")[0],
      data.confidence,
    ];

    return [...baseFields, ...extraFields, ...meta]
      .map(escapeCSVField)
      .join(",");
  });

  return [headers.map(escapeCSVField).join(","), ...rows].join("\n");
}
