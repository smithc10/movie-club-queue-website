import type { FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card rounded-2xl border border-destructive/50 p-8 shadow-2xl max-w-md w-full text-center">
        <div className="text-4xl mb-4">Something went wrong</div>
        <p className="text-muted-foreground mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={resetErrorBoundary} variant="destructive">
          Try again
        </Button>
      </div>
    </div>
  );
}
