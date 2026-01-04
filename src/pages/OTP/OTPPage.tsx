import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, OTPInput } from "../../components/shared";
import { usePageTitle } from "../../hooks";
import { LogoIcon } from "../../assets/icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  verifyResetCode,
  resendResetCode,
  clearError,
  clearMessage,
} from "../../store/slices/passwordResetSlice";
import toast from "react-hot-toast";

const OTPPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    email: storedEmail,
    loading,
    error,
    message,
    resetToken,
  } = useAppSelector((state) => state.passwordReset);

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const hasNavigatedRef = useRef(false);
  const hasShownMessageRef = useRef(false);

  const canResend = countdown === 0;

  // Get email from location state or Redux store
  const email = (location.state as { email?: string })?.email || storedEmail;

  usePageTitle(`${t("otp.title")}`);

  // Clear any previous messages on mount
  useEffect(() => {
    dispatch(clearMessage());
    dispatch(clearError());
    hasNavigatedRef.current = false;
    hasShownMessageRef.current = false;
  }, [dispatch]);

  // Redirect if no email (only show toast once)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!email) {
        toast.error("Please enter your email first");
        navigate("/forgot-password");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [email, navigate]);

  // Handle successful verification
  useEffect(() => {
    if (resetToken && message && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      toast.success(message);
      setTimeout(() => {
        navigate("/reset-password");
      }, 500);
    }
  }, [resetToken, message, navigate]);

  // Show error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Show resend success message (only for resend, not for verify)
  useEffect(() => {
    if (
      message &&
      !resetToken &&
      !hasNavigatedRef.current &&
      !hasShownMessageRef.current
    ) {
      hasShownMessageRef.current = true;
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [message, resetToken, dispatch]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      toast.error("Email is missing");
      return;
    }

    try {
      await dispatch(verifyResetCode({ email, code: otp })).unwrap();
    } catch {
      // Error is handled by useEffect
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    if (!email) {
      toast.error("Email is missing");
      return;
    }

    // Reset the message flag before resending
    hasShownMessageRef.current = false;

    try {
      await dispatch(resendResetCode({ email })).unwrap();
      setCountdown(60);
      setOtp("");
    } catch {
      // Error is handled by useEffect
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <LogoIcon />
        </div>
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-2">
          {t("otp.title")}
        </h2>

        {/* Description */}
        <p className="text-gray text-center text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-2">
          {t("otp.description")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <OTPInput length={6} value={otp} onChange={setOtp} />

          {/* Resend Code */}
          <div className="text-center">
            {canResend ? (
              <div className="text-xs sm:text-sm text-dark">
                {t("otp.didntGetCode")}{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary hover:underline font-medium"
                >
                  {t("otp.resend")}
                </button>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-dark">
                {t("otp.sendCodeAgain")} {formatTime(countdown)}
              </div>
            )}
          </div>

          {/* Verify Button */}
          <Button
            title={t("otp.verifyButton")}
            type="submit"
            fullWidth
            size="md"
            isLoading={loading}
          />

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <span className="text-xs sm:text-sm text-dark">
              {t("login.alreadyHaveAccount")}{" "}
            </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-xs sm:text-sm text-primary hover:underline font-medium"
            >
              {t("login.signIn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
