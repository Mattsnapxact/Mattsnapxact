"use client";

interface ProcessingProgress {
  current: number;
  total: number;
  failedCount: number;
}

interface OfflineQueueBannerProps {
  isOnline: boolean;
  queueCount: number;
  isProcessingQueue: boolean;
  progress: ProcessingProgress | null;
  isNearCapacity: boolean;
  isAtCapacity: boolean;
  hasFailures: boolean;
  onProcessQueue: () => void;
  onStopProcessing: () => void;
  onRetryFailed: () => void;
  onViewQueue: () => void;
  onDismissProgress: () => void;
}

export default function OfflineQueueBanner({
  isOnline,
  queueCount,
  isProcessingQueue,
  progress,
  isNearCapacity,
  isAtCapacity,
  hasFailures,
  onProcessQueue,
  onStopProcessing,
  onRetryFailed,
  onViewQueue,
  onDismissProgress,
}: OfflineQueueBannerProps) {
  // Nothing to show
  if (queueCount === 0 && !progress && isOnline) return null;

  // Offline indicator with no queue
  if (!isOnline && queueCount === 0) {
    return (
      <div className="bg-surface-100 border border-surface-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-surface-400" />
          <span className="text-sm font-medium text-surface-600">
            You&apos;re offline
          </span>
        </div>
        <p className="text-xs text-surface-500 mt-1 ml-4">
          Photos will be queued for processing when you&apos;re back online.
        </p>
      </div>
    );
  }

  // Processing in progress
  if (isProcessingQueue && progress) {
    const pct = Math.round((progress.current / progress.total) * 100);
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-brand-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm font-medium text-brand-700">
              Processing {progress.current} of {progress.total}...
            </span>
          </div>
          <button
            onClick={onStopProcessing}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            Stop
          </button>
        </div>
        <div className="w-full bg-brand-100 rounded-full h-2">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        {progress.failedCount > 0 && (
          <p className="text-xs text-amber-600 mt-2">
            {progress.failedCount} failed so far
          </p>
        )}
      </div>
    );
  }

  // Processing complete with failures
  if (hasFailures && progress) {
    const successCount = progress.total - progress.failedCount;
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-sm font-medium text-amber-700">
                {progress.failedCount} photo{progress.failedCount !== 1 ? "s" : ""} failed to process
              </span>
            </div>
            {successCount > 0 && (
              <p className="text-xs text-amber-600 mt-1 ml-6">
                {successCount} processed successfully
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRetryFailed}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors"
            >
              Retry
            </button>
            <button
              onClick={onDismissProgress}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium py-1.5 px-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing complete success (brief flash)
  if (progress && !isProcessingQueue && progress.failedCount === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-600"
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
          <span className="text-sm font-medium text-green-700">
            All {progress.total} queued photos processed successfully!
          </span>
        </div>
      </div>
    );
  }

  // Queue exists — show status
  return (
    <div
      className={`rounded-xl p-4 ${
        isAtCapacity
          ? "bg-red-50 border border-red-200"
          : isNearCapacity
          ? "bg-amber-50 border border-amber-200"
          : isOnline
          ? "bg-brand-50 border border-brand-200"
          : "bg-surface-100 border border-surface-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="w-2 h-2 rounded-full bg-surface-400" />
            )}
            <svg
              className={`w-4 h-4 ${
                isAtCapacity
                  ? "text-red-600"
                  : isNearCapacity
                  ? "text-amber-600"
                  : isOnline
                  ? "text-brand-600"
                  : "text-surface-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span
              className={`text-sm font-medium ${
                isAtCapacity
                  ? "text-red-700"
                  : isNearCapacity
                  ? "text-amber-700"
                  : isOnline
                  ? "text-brand-700"
                  : "text-surface-600"
              }`}
            >
              {queueCount} photo{queueCount !== 1 ? "s" : ""} queued for
              processing
            </span>
          </div>
          {isAtCapacity && (
            <p className="text-xs text-red-600 mt-1 ml-6">
              Queue full. Process existing photos before scanning more.
            </p>
          )}
          {isNearCapacity && !isAtCapacity && (
            <p className="text-xs text-amber-600 mt-1 ml-6">
              Approaching storage limit. Process queue soon.
            </p>
          )}
          {!isOnline && !isNearCapacity && !isAtCapacity && (
            <p className="text-xs text-surface-500 mt-1 ml-6">
              Will be processed when you&apos;re back online.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewQueue}
            className="text-xs text-surface-500 hover:text-surface-700 font-medium py-1.5 px-2 transition-colors"
          >
            View
          </button>
          {isOnline && (
            <button
              onClick={onProcessQueue}
              className="text-xs bg-brand-600 hover:bg-brand-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors"
            >
              Process now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
