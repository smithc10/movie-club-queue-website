import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallback";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./index.css";
import App from "./App.tsx";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

const configError =
  !userPoolId ? "Missing required environment variable: VITE_COGNITO_USER_POOL_ID" :
  !userPoolClientId ? "Missing required environment variable: VITE_COGNITO_CLIENT_ID" :
  null;

if (!configError) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: userPoolId!,
        userPoolClientId: userPoolClientId!,
      },
    },
  });
}

function Root() {
  if (import.meta.env.DEV && import.meta.env.VITE_FORCE_ERROR_BOUNDARY === "true") {
    throw new Error("Oops! Something went wrong on our end");
  }
  if (configError) {
    throw new Error(configError);
  }
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
