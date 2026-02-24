"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/scan");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center">
      <p className="text-lg text-surface-600 font-medium">
        SnapXact &mdash; Redirecting to scanner&hellip;
      </p>
    </div>
  );
}
