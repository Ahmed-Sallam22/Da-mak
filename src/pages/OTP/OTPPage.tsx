import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, OTPInput } from "../../components/shared";
import { usePageTitle } from "../../hooks";
import { showToast } from "../../utils";

const OTPPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const canResend = countdown === 0;

  usePageTitle(`${t("otp.title")} - Tickety`);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showToast.error(t("toast.fillAllFields"));
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (otp === "W8FB66") {
        showToast.success(t("toast.otpVerified"));
        navigate("/reset-password");
      } else {
        showToast.error(t("toast.invalidOtp"));
      }
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;

    showToast.success(t("toast.emailSent"));
    setCountdown(60);
    setOtp("");
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 italic">
          <span className="text-primary">
            {t("login.title").replace(".", "")}
          </span>
          <span className="text-primary">.</span>
        </h1>

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
            isLoading={isLoading}
          />

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <span className="text-xs sm:text-sm text-dark">
              {t("login.alreadyHaveAccount")}{" "}
            </span>
            <button
              type="button"
              onClick={() => navigate("/")}
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
