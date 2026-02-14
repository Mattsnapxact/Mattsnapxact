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
  imagePreview?: string;
  extractedData: ExtractedLabel;
  editedData: ExtractedLabel;
  timestamp: Date;
  status: "processing" | "review" | "confirmed";
}

export interface BatchExport {
  items: ScanItem[];
  exportedAt: Date;
  format: "csv";
}
