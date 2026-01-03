import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/shared";
import { usePageTitle } from "../../hooks";
import { LogoIcon } from "../../assets/icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  forgotPassword,
  setEmail as setResetEmail,
  clearError,
  clearMessage,
} from "../../store/slices/passwordResetSlice";
import toast from "react-hot-toast";

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, message } = useAppSelector(
    (state) => state.passwordReset
  );

  const [email, setEmail] = useState("");
  const hasNavigatedRef = useRef(false);

  usePageTitle(`${t("forgotPassword.title")}`);

  // Clear any previous messages on mount
  useEffect(() => {
    dispatch(clearMessage());
    dispatch(clearError());
  }, [dispatch]);

  // Show success/error messages
  useEffect(() => {
    if (message && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      toast.success(message);
      // Store email and navigate to OTP page
      dispatch(setResetEmail(email));
      setTimeout(() => {
        navigate("/otp", { state: { email } });
      }, 500);
    }
  }, [message, email, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("toast.fillAllFields"));
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();
    } catch {
      // Error is handled by useEffect
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <LogoIcon />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-dark mb-2">
          <span className="text-primary">{t("forgotPassword.title")}</span>{" "}
          {t("forgotPassword.titleSuffix")}
        </h2>

        {/* Description */}
        <p className="text-gray text-center text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-2">
          {t("forgotPassword.description")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <Input
            label={t("forgotPassword.email")}
            type="email"
            placeholder={t("forgotPassword.emailPlaceholder")}
            value={email}
            onChange={setEmail}
          />

          {/* Continue Button */}
          <Button
            title={t("forgotPassword.continueButton")}
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

export default ForgotPasswordPage;
