import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-57px)]">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            Now in public beta
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 tracking-tight text-balance">
            Snap a label.
            <br />
            <span className="text-brand-600">Get exact data.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto text-balance">
            Take a photo of any IT equipment label and instantly extract
            structured data into a CSV. Works with any system you already use.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 px-8 rounded-xl text-base transition-default shadow-lg shadow-brand-600/25"
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
              Start Scanning
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center text-surface-600 hover:text-surface-800 font-medium py-3.5 px-8 rounded-xl text-base transition-default"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-white border-y border-surface-200 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 text-center mb-12">
            Three steps. That&apos;s it.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Snap"
              description="Take a photo of any equipment label with your phone or upload an existing image."
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
              }
            />
            <StepCard
              number="2"
              title="Review"
              description="AI reads the label and extracts manufacturer, model, serial number, and more. You verify and edit."
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              }
            />
            <StepCard
              number="3"
              title="Export"
              description="Download a clean CSV ready for spreadsheets, asset management tools, or any system."
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              }
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 text-center mb-12">
            Built for the real world
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              title="Smart field detection"
              description="AI identifies and separates manufacturer, model, serial number, asset tags, and more into structured columns."
            />
            <FeatureCard
              title="Batch scanning"
              description="Scan multiple labels in a session. Build up your inventory list, then export everything at once."
            />
            <FeatureCard
              title="Edit before export"
              description="Review every field before exporting. Fix any AI mistakes with inline editing."
            />
            <FeatureCard
              title="Universal CSV output"
              description="Simple CSV format that works with Excel, Google Sheets, or imports directly into any asset management system."
            />
            <FeatureCard
              title="No app required"
              description="Works in your phone's browser. No app store download needed. Just open and scan."
            />
            <FeatureCard
              title="Optional accounts"
              description="Use it instantly without signing up. Create a free account to save your scan history."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Stop typing labels by hand
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            SnapXact turns hours of manual data entry into seconds.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center justify-center bg-white text-brand-700 font-semibold py-3.5 px-8 rounded-xl text-base hover:bg-brand-50 transition-default"
          >
            Try it free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-8">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
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
              </svg>
            </div>
            <span className="text-sm font-medium text-surface-600">
              SnapXact
            </span>
          </div>
          <p className="text-sm text-surface-400">
            &copy; {new Date().getFullYear()} SnapXact. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-7 h-7 text-brand-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <div className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-1">
        Step {number}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-sm text-surface-500 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-surface-200 rounded-xl p-6">
      <h3 className="text-base font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-surface-500 leading-relaxed">{description}</p>
    </div>
  );
}
