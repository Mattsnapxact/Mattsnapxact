import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-surface-900">
            SnapXact Workspace
          </h1>
          <p className="mt-2 text-sm text-surface-500 leading-relaxed">
            Secure capture, review and export of asset label data for approved
            organisations.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/scan"
              className="inline-flex items-center justify-center rounded-lg border border-surface-200 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
            >
              Try demo scanner
            </Link>
            <p className="text-xs text-surface-500 leading-relaxed">
              Upload an equipment label and see how SnapXact extracts structured
              data in seconds.
            </p>
          </div>

          <p className="mt-4 text-xs text-surface-400 leading-relaxed">
            Demo mode for preview. Workspace features, saved records and exports
            require sign in.
          </p>

          <div className="mt-10 rounded-lg border border-surface-200 bg-surface-50 px-5 py-5">
            <h2 className="text-sm font-medium text-surface-700 mb-4">
              How it works
            </h2>
            <ol className="space-y-3 text-left text-sm text-surface-600">
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">
                  1
                </span>
                Upload a label
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">
                  2
                </span>
                SnapXact extracts the data
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">
                  3
                </span>
                Export or manage inside your workspace
              </li>
            </ol>
          </div>

          <ul className="mt-8 space-y-2 text-left text-sm text-surface-600">
            <li className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Capture labels quickly
            </li>
            <li className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Review and confirm extracted data
            </li>
            <li className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Export clean structured records
            </li>
          </ul>

          <p className="mt-8 text-xs text-surface-400 leading-relaxed">
            Access is managed by organisation administrators. If you need an
            account, please contact your administrator or SnapXact.
          </p>
        </div>
      </div>

      <footer className="pb-6 text-center">
        <a
          href="https://snapxact.com"
          className="text-xs text-surface-400 hover:text-brand-600 transition-colors"
        >
          &larr; Back to SnapXact.com
        </a>
      </footer>
    </div>
  );
}
