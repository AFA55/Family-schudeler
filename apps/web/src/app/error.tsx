"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-coral-500 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-neutral-500 mb-8 max-w-md">
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
