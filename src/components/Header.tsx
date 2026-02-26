"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-surface-200 bg-white">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <span className="text-lg font-semibold text-surface-900">
              SnapXact
            </span>
          </Link>
          {session?.user?.organizationName && (
            <span className="text-xs text-surface-400 border-l border-surface-200 pl-3 hidden sm:inline">
              {session.user.organizationName}
            </span>
          )}
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/scan"
            className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-default"
          >
            Scan
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-default"
              >
                History
              </Link>
              <Link
                href="/locations"
                className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-default"
              >
                Locations
              </Link>
              {session.user?.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-default"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-surface-400 hover:text-surface-600 transition-default"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-default"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
