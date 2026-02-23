"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateCSV } from "@/lib/csv";
import { ScanItem } from "@/types";

interface SavedScan {
  id: string;
  status: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  assetTag: string | null;
  extraFields: Record<string, string>;
  rawText: string | null;
  createdAt: string;
  batchId: string | null;
  buildingId: string | null;
  buildingName: string | null;
  roomId: string | null;
  roomName: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeDrafts, setIncludeDrafts] = useState(false);

  const confirmedCount = scans.filter((s) => s.status === "confirmed").length;
  const draftCount = scans.filter((s) => s.status === "draft").length;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/scans")
        .then((res) => res.json())
        .then((data) => {
          setScans(data.scans || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const handleExport = () => {
    const exportScans = includeDrafts
      ? scans
      : scans.filter((s) => s.status === "confirmed");
    if (exportScans.length === 0) return;

    const items: ScanItem[] = exportScans.map((scan) => ({
      id: scan.id,
      extractedData: {
        manufacturer: scan.manufacturer || "",
        model: scan.model || "",
        serialNumber: scan.serialNumber || "",
        assetTag: scan.assetTag || "",
        extraFields: scan.extraFields || {},
        rawText: scan.rawText || "",
        confidence: "high",
      },
      editedData: {
        manufacturer: scan.manufacturer || "",
        model: scan.model || "",
        serialNumber: scan.serialNumber || "",
        assetTag: scan.assetTag || "",
        extraFields: scan.extraFields || {},
        rawText: scan.rawText || "",
        confidence: "high",
      },
      timestamp: new Date(scan.createdAt),
      status: (scan.status === "confirmed" ? "confirmed" : "draft") as "confirmed" | "draft",
      buildingId: scan.buildingId || undefined,
      buildingName: scan.buildingName || undefined,
      roomId: scan.roomId || undefined,
      roomName: scan.roomName || undefined,
    }));

    const csv = generateCSV(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snapxact-history-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-48" />
          <div className="h-4 bg-surface-100 rounded w-32" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-surface-100 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Scan History</h1>
          <p className="text-sm text-surface-500 mt-1">
            {confirmedCount} confirmed{draftCount > 0 ? `, ${draftCount} draft${draftCount !== 1 ? "s" : ""}` : ""} &mdash; {scans.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {scans.length > 0 && (
            <>
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
                onClick={handleExport}
                disabled={includeDrafts ? scans.length === 0 : confirmedCount === 0}
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
                Export{includeDrafts ? " All" : " Confirmed"}
              </button>
            </>
          )}
          <Link
            href="/scan"
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-900 text-white text-sm font-medium py-2 px-4 rounded-lg transition-default"
          >
            New Scan
          </Link>
        </div>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-surface-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-surface-700 mb-2">
            No scans yet
          </h3>
          <p className="text-sm text-surface-500 mb-6">
            Scan some equipment labels and save them to see them here.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 px-6 rounded-lg transition-default"
          >
            Start scanning
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="bg-white border border-surface-200 rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-surface-800 truncate">
                    {scan.manufacturer || "Unknown"}{" "}
                    {scan.model || ""}
                  </p>
                  <span
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      scan.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {scan.status === "confirmed" ? "Confirmed" : "Draft"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                  {(scan.buildingName || scan.roomName) && (
                    <span className="text-xs text-brand-600 font-medium">
                      {[scan.buildingName, scan.roomName].filter(Boolean).join(" / ")}
                    </span>
                  )}
                  {scan.serialNumber && (
                    <span className="text-xs text-surface-500">
                      S/N: {scan.serialNumber}
                    </span>
                  )}
                  {scan.assetTag && (
                    <span className="text-xs text-surface-500">
                      Asset: {scan.assetTag}
                    </span>
                  )}
                  <span className="text-xs text-surface-400">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
