import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/shared";
import { EyeIcon, EyeSlashIcon, LogoIcon } from "../../assets/icons";
import { usePageTitle } from "../../hooks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  resetPassword,
  clearError,
  clearPasswordResetState,
} from "../../store/slices/passwordResetSlice";
import toast from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resetToken, loading, error, message } = useAppSelector(
    (state) => state.passwordReset
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const hasNavigatedRef = useRef(false);
  const hasCheckedTokenRef = useRef(false);

  usePageTitle(`${t("resetPassword.title")}`);

  // Clear any previous messages on mount
  useEffect(() => {
    dispatch(clearError());
    hasNavigatedRef.current = false;
    hasCheckedTokenRef.current = false;
  }, [dispatch]);

  // Redirect if no reset token
  useEffect(() => {
    if (!hasCheckedTokenRef.current) {
      hasCheckedTokenRef.current = true;
      if (!resetToken) {
        toast.error("Invalid or expired reset session. Please start over.");
        setTimeout(() => {
          navigate("/forgot-password");
        }, 1000);
      }
    }
  }, [resetToken, navigate]);

  // Handle successful password reset
  useEffect(() => {
    if (message && !error && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      toast.success(message);
      dispatch(clearPasswordResetState());
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [message, error, dispatch, navigate]);

  // Show error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error(t("toast.fillAllFields"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("toast.passwordMismatch"));
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!resetToken) {
      toast.error("Reset token is missing");
      return;
    }

    try {
      await dispatch(
        resetPassword({
          reset_token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        })
      ).unwrap();
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
          {t("resetPassword.title")}{" "}
          <span className="text-primary">
            {t("resetPassword.titleHighlight")}
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray text-center text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-2">
          {t("resetPassword.description")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <Input
            label={t("resetPassword.enterNewPassword")}
            type={showNewPassword ? "text" : "password"}
            placeholder={t("resetPassword.enterNewPasswordPlaceholder")}
            value={newPassword}
            onChange={setNewPassword}
            icon={showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
            onIconClick={() => setShowNewPassword(!showNewPassword)}
          />

          <Input
            label={t("resetPassword.confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={setConfirmPassword}
            icon={showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Confirm Button */}
          <Button
            title={t("resetPassword.confirmButton")}
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

export default ResetPasswordPage;
