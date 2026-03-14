import { useState, type FormEvent } from "react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EyeOpenIcon,
  EyeClosedIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
type ForgotStep = null | "request" | "confirm";

export default function LoginPage() {
  const {
    handleLogin,
    confirmNewPassword,
    error,
    clearError,
    needsNewPassword,
  } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const resetPasswordMismatch =
    resetConfirmPassword.length > 0 &&
    resetNewPassword !== resetConfirmPassword;

  const onLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleLogin(email, password);
    } catch {
      // Error is already set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setIsSubmitting(true);
    try {
      await confirmNewPassword(newPassword);
    } catch {
      // Error is already set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setForgotError(null);
    try {
      await resetPassword({ username: forgotEmail });
      setForgotStep("confirm");
    } catch (err) {
      setForgotError(
        err instanceof Error ? err.message : "Failed to send reset code",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resetNewPassword !== resetConfirmPassword) return;
    setIsSubmitting(true);
    setForgotError(null);
    try {
      await confirmResetPassword({
        username: forgotEmail,
        confirmationCode: resetCode,
        newPassword: resetNewPassword,
      });
      toast.success("Password updated. Sign in with your new password.");
      setForgotStep(null);
      setResetCode("");
      setResetNewPassword("");
      setResetConfirmPassword("");
    } catch (err) {
      setForgotError(
        err instanceof Error ? err.message : "Failed to reset password",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHeading = () => {
    if (forgotStep === "request") return "Reset your password";
    if (forgotStep === "confirm") return "Check your email";
    if (needsNewPassword) return "New password required";
    return "Movie Club";
  };

  const getSubtext = () => {
    if (forgotStep === "request")
      return "Enter your email and we'll send you a reset code";
    if (forgotStep === "confirm")
      return `Enter the code we sent to ${forgotEmail}`;
    if (needsNewPassword) return "Please set a new password to continue";
    return "Sign in to manage your schedule";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

          {/* Back button for forgot password steps */}
          {forgotStep && (
            <button
              type="button"
              onClick={() => {
                setForgotStep(forgotStep === "confirm" ? "request" : null);
                setForgotError(null);
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {getHeading()}
            </h1>
            <p className="text-muted-foreground">{getSubtext()}</p>
          </div>

          {/* Auth context errors (login / new password flows) */}
          {error && !forgotStep && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {error}
            </div>
          )}

          {/* Forgot password errors */}
          {forgotError && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {forgotError}
            </div>
          )}

          {/* ── Forgot password: request step ── */}
          {forgotStep === "request" && (
            <form onSubmit={handleForgotRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="forgotEmail" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotError(null);
                  }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base font-medium transition-all hover:scale-[1.02] bg-[#B4841E]"
              >
                {isSubmitting ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          )}

          {/* ── Forgot password: confirm step ── */}
          {forgotStep === "confirm" && (
            <form onSubmit={handleForgotConfirm} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resetCode" className="text-foreground">
                  Confirmation Code
                </Label>
                <Input
                  id="resetCode"
                  type="text"
                  value={resetCode}
                  onChange={(e) => {
                    setResetCode(e.target.value);
                    setForgotError(null);
                  }}
                  placeholder="Enter code from email"
                  required
                  autoComplete="one-time-code"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resetNewPassword" className="text-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="resetNewPassword"
                    type={showPassword ? "text" : "password"}
                    value={resetNewPassword}
                    onChange={(e) => {
                      setResetNewPassword(e.target.value);
                      setForgotError(null);
                    }}
                    placeholder="Enter new password"
                    required
                    autoComplete="new-password"
                    className="pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-5 w-5" />
                    ) : (
                      <EyeOpenIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resetConfirmPassword" className="text-foreground">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="resetConfirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={resetConfirmPassword}
                    onChange={(e) => {
                      setResetConfirmPassword(e.target.value);
                      setForgotError(null);
                    }}
                    placeholder="Confirm new password"
                    required
                    autoComplete="new-password"
                    className="pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-5 w-5" />
                    ) : (
                      <EyeOpenIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {resetPasswordMismatch && (
                  <p className="text-destructive text-xs">
                    Passwords do not match
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || resetPasswordMismatch}
                className="w-full h-11 text-base font-medium transition-all hover:scale-[1.02] bg-[#B4841E]"
              >
                {isSubmitting ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          )}

          {/* ── Forced new password (Cognito first-login) ── */}
          {!forgotStep && needsNewPassword && (
            <form onSubmit={handleNewPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Enter new password"
                    required
                    autoComplete="new-password"
                    autoFocus
                    className="pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-5 w-5" />
                    ) : (
                      <EyeOpenIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Confirm new password"
                    required
                    autoComplete="new-password"
                    className="pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-5 w-5" />
                    ) : (
                      <EyeOpenIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-destructive text-xs">
                    Passwords do not match
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || passwordMismatch}
                className="w-full h-11 text-base font-medium transition-all hover:scale-[1.02] bg-[#B4841E]"
              >
                {isSubmitting ? "Updating..." : "Set New Password"}
              </Button>
            </form>
          )}

          {/* ── Normal login ── */}
          {!forgotStep && !needsNewPassword && (
            <form onSubmit={onLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-5 w-5" />
                    ) : (
                      <EyeOpenIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 text-base font-medium transition-all hover:scale-[1.02] bg-[#B4841E]"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotError(null);
                    setForgotStep("request");
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
