import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignIn,
} from "aws-amplify/auth";
import { toast } from "sonner";

interface User {
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  needsNewPassword: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  confirmNewPassword: (newPassword: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const pendingEmailRef = useRef<string | null>(null);

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const session = await fetchAuthSession();
        if (session.tokens) {
          const cognitoUser = await getCurrentUser();
          setUser({ email: cognitoUser.signInDetails?.loginId ?? "" });
        }
      } catch {
        // No existing session — user needs to log in
      } finally {
        setLoading(false);
      }
    }
    checkExistingSession();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signIn({ username: email, password });
      if (result.isSignedIn) {
        setUser({ email });
      } else {
        const step = result.nextStep.signInStep;
        if (step === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
          pendingEmailRef.current = email;
          setNeedsNewPassword(true);
        } else if (step === "CONFIRM_SIGN_UP") {
          setError("Please verify your email address before signing in.");
        } else if (step === "DONE") {
          setUser({ email });
        } else {
          setError(`Additional sign-in step required: ${step}`);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    }
  }, []);

  const confirmNewPassword = useCallback(async (newPassword: string) => {
    setError(null);
    try {
      const result = await confirmSignIn({ challengeResponse: newPassword });
      if (result.isSignedIn) {
        setNeedsNewPassword(false);
        setUser({ email: pendingEmailRef.current ?? "" });
        pendingEmailRef.current = null;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to set new password";
      setError(message);
      throw err;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign out";
      toast.error(message);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      isLoggedIn: !!user,
      user,
      isLoading,
      error,
      needsNewPassword,
      handleLogin,
      confirmNewPassword,
      handleLogout,
      clearError,
    }),
    [user, isLoading, error, needsNewPassword, handleLogin, confirmNewPassword, handleLogout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
