export interface ExtractedLabel {
  manufacturer: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  extraFields: Record<string, string>;
  rawText: string;
  confidence: "high" | "medium" | "low";
}

export interface ScanItem {
  id: string;
  dbId?: string; // Database record ID (set after auto-save)
  imagePreview?: string;
  extractedData: ExtractedLabel;
  editedData: ExtractedLabel;
  timestamp: Date;
  status: "processing" | "draft" | "confirmed";
  buildingId?: string;
  buildingName?: string;
  roomId?: string;
  roomName?: string;
}

export interface BatchExport {
  items: ScanItem[];
  exportedAt: Date;
  format: "csv";
}
