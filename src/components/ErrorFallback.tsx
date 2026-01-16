import type { FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-red-500/50 p-8 shadow-2xl max-w-md w-full text-center">
        <div className="text-4xl mb-4">Something went wrong</div>
        <p className="text-gray-400 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={resetErrorBoundary} variant="destructive">
          Try again
        </Button>
      </div>
    </div>
  );
}
