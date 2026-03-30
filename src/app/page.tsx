"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ── Animated mock extraction ── */
const FIELDS = [
  { label: "Manufacturer", value: "Dell Technologies" },
  { label: "Model", value: "PowerEdge R750" },
  { label: "Serial", value: "JXR9T2K" },
  { label: "Asset Tag", value: "IT-2024-00847" },
  { label: "MAC Address", value: "A4:BB:6D:7C:02:F1" },
];

function DemoExtraction() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started || visibleCount >= FIELDS.length) return;
    const t = setTimeout(
      () => setVisibleCount((c) => c + 1),
      400 + visibleCount * 150
    );
    return () => clearTimeout(t);
  }, [started, visibleCount]);

  return (
    <div className="gateway-demo">
      {/* Fake label image */}
      <div className="gateway-demo-label">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-surface-300/60" />
          <div className="h-2.5 w-20 rounded-full bg-surface-300/60" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-surface-300/40" />
          <div className="h-2 w-4/5 rounded-full bg-surface-300/40" />
          <div className="h-2 w-11/12 rounded-full bg-surface-300/40" />
          <div className="h-2 w-3/5 rounded-full bg-surface-300/40" />
          <div className="h-2 w-4/5 rounded-full bg-surface-300/40" />
          <div className="h-2 w-2/3 rounded-full bg-surface-300/40" />
        </div>
        {/* Scan line */}
        {started && visibleCount < FIELDS.length && (
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="gateway-scanline" />
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center py-2">
        <svg
          className={`w-5 h-5 transition-all duration-500 ${started ? "text-brand-500" : "text-surface-300"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Extracted data rows */}
      <div className="gateway-demo-output">
        {FIELDS.map((field, i) => (
          <div
            key={field.label}
            className={`gateway-demo-row ${i < visibleCount ? "gateway-demo-row-visible" : ""}`}
          >
            <span className="gateway-demo-row-label">{field.label}</span>
            <span className="gateway-demo-row-value">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step card ── */
function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="gateway-step">
      <div className="gateway-step-icon">
        <span className="gateway-step-number">{number}</span>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-surface-900 mt-3">{title}</h3>
      <p className="text-xs text-surface-500 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ── Page ── */
export default function Home() {
  return (
    <div className="gateway-root">
      {/* Background decoration */}
      <div className="gateway-bg" aria-hidden="true">
        <div className="gateway-bg-gradient" />
        <div className="gateway-bg-grid" />
      </div>

      <div className="gateway-content">
        {/* Hero */}
        <section className="gateway-hero">
          <div className="gateway-badge">
            <span className="gateway-badge-dot" />
            Asset data capture
          </div>

          <h1 className="gateway-h1">
            One photo.
            <br />
            <span className="gateway-h1-accent">Structured data.</span>
          </h1>

          <p className="gateway-subtitle">
            Capture equipment labels, extract every field instantly,
            and export clean records — no typing required.
          </p>

          <div className="gateway-actions">
            <Link href="/login" className="gateway-btn-primary">
              <span>Sign in</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Live demo visual */}
        <section className="gateway-demo-section">
          <DemoExtraction />
        </section>

        {/* Steps */}
        <section className="gateway-steps">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-400 text-center mb-6">
            How it works
          </h2>
          <div className="gateway-steps-grid">
            <StepCard
              number={1}
              title="Upload a label"
              description="Take a photo or choose from your library. Works with any equipment label."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StepCard
              number={2}
              title="SnapXact extracts the data"
              description="AI vision reads every field — serial numbers, model, manufacturer, asset tags."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <StepCard
              number={3}
              title="Export or manage"
              description="Download clean CSV records or manage everything inside your workspace."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Features */}
        <section className="gateway-features">
          {[
            { text: "Capture labels quickly", icon: "M5 13l4 4L19 7" },
            { text: "Review and confirm extracted data", icon: "M5 13l4 4L19 7" },
            { text: "Export clean structured records", icon: "M5 13l4 4L19 7" },
          ].map((f) => (
            <div key={f.text} className="gateway-feature">
              <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
              </svg>
              <span>{f.text}</span>
            </div>
          ))}
        </section>

        {/* Disclaimer */}
        <p className="gateway-disclaimer">
          Access is managed by organisation administrators.
          <br />
          Need an account? Contact your administrator or SnapXact.
        </p>
      </div>

      {/* Footer */}
      <footer className="gateway-footer">
        <a href="https://snapxact.com" className="gateway-footer-link">
          &larr; Back to SnapXact.com
        </a>
      </footer>
    </div>
  );
}
