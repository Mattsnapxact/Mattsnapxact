"use client";

import { useRef, useState, useCallback } from "react";

interface CameraCaptureProps {
  onCapture: (base64: string, mimeType: string, preview: string) => void;
  disabled?: boolean;
}

// MIME types accepted by GPT-4o-mini vision
const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

// Map file extensions to MIME types for fallback detection
const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
};

/**
 * Resolve a usable MIME type from a File object.
 * iOS photo library picks can have an empty or incorrect file.type,
 * so we fall back to the file extension.
 */
function resolveMimeType(file: File): string {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type.toLowerCase();
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  return EXT_TO_MIME[ext] || "";
}

/**
 * Returns true when the MIME type is HEIC/HEIF (Apple's photo format).
 */
function isHeicType(mime: string): boolean {
  return mime === "image/heic" || mime === "image/heif";
}

/**
 * Convert a HEIC/HEIF (or any non-JPEG) blob to JPEG via an off-screen canvas.
 * Safari on iOS >=17 can decode HEIC natively so createImageBitmap works.
 * Returns { base64, mimeType, dataUrl } or throws.
 */
async function convertToJpeg(
  file: File
): Promise<{ base64: string; mimeType: string; dataUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  const arrayBuf = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const dataUrl = `data:image/jpeg;base64,${base64}`;
  return { base64, mimeType: "image/jpeg", dataUrl };
}

/**
 * Read a File as a data URL and extract the base64 payload.
 * Validates the data URL format defensively.
 */
function readFileAsBase64(
  file: File,
  mimeType: string
): Promise<{ base64: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string" || !dataUrl.includes(",")) {
        reject(new Error("Could not read the selected image. Please try a different photo."));
        return;
      }
      const base64 = dataUrl.split(",")[1];
      if (!base64) {
        reject(new Error("Image data was empty. Please try a different photo."));
        return;
      }
      // If the browser wrote a generic or missing MIME in the data URL,
      // rebuild it with the resolved MIME type so downstream is correct.
      const correctedDataUrl = `data:${mimeType};base64,${base64}`;
      resolve({ base64, dataUrl: correctedDataUrl });
    };
    reader.onerror = () => {
      reject(new Error("Failed to read the image file. Please try again."));
    };
    reader.readAsDataURL(file);
  });
}

export default function CameraCapture({
  onCapture,
  disabled,
}: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      // 1. Resolve MIME type (handles empty file.type on iOS)
      const mime = resolveMimeType(file);

      if (!mime || !mime.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, GIF, or WebP).");
        return;
      }

      // 2. Size check
      if (file.size > 20 * 1024 * 1024) {
        alert("Image is too large. Please use an image under 20MB.");
        return;
      }

      try {
        // 3. HEIC/HEIF — convert to JPEG before sending
        if (isHeicType(mime)) {
          setConverting(true);
          try {
            const result = await convertToJpeg(file);
            onCapture(result.base64, result.mimeType, result.dataUrl);
          } catch {
            alert(
              "This image format (HEIC) could not be converted. Please open the photo in your Photos app, take a screenshot, and upload that instead."
            );
          } finally {
            setConverting(false);
          }
          return;
        }

        // 4. Unsupported image type (e.g. BMP, TIFF) — try canvas conversion
        if (!SUPPORTED_MIME_TYPES.has(mime)) {
          setConverting(true);
          try {
            const result = await convertToJpeg(file);
            onCapture(result.base64, result.mimeType, result.dataUrl);
          } catch {
            alert(
              `This image format (${mime}) is not supported. Please use JPEG, PNG, GIF, or WebP.`
            );
          } finally {
            setConverting(false);
          }
          return;
        }

        // 5. Standard supported format — read as base64
        const { base64, dataUrl } = await readFileAsBase64(file, mime);
        onCapture(base64, mime, dataUrl);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Could not process the image. Please try a different photo.";
        alert(msg);
      }
    },
    [onCapture]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4">
      {/* Main capture area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-default cursor-pointer ${
          dragOver
            ? "border-brand-500 bg-brand-50"
            : "border-surface-300 hover:border-brand-400 hover:bg-surface-50"
        } ${disabled || converting ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-base font-medium text-surface-700">
              {converting ? "Converting image…" : "Upload a label photo"}
            </p>
            <p className="text-sm text-surface-400 mt-1">
              {converting
                ? "This may take a moment"
                : "Drag and drop or click to browse"}
            </p>
          </div>
        </div>
      </div>

      {/* Camera button (shown on all devices, gracefully fails on desktop) */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        disabled={disabled || converting}
        className="w-full flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3.5 px-6 rounded-xl transition-default disabled:opacity-50 disabled:cursor-not-allowed"
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
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Take Photo
      </button>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
