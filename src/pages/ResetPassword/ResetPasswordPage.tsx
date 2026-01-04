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
  const hasSubmittedRef = useRef(false);

  usePageTitle(`${t("resetPassword.title")}`);

  // Clear any previous messages on mount
  useEffect(() => {
    dispatch(clearError());
    hasNavigatedRef.current = false;
    hasCheckedTokenRef.current = false;
    hasSubmittedRef.current = false;
  }, [dispatch]);

  // Cleanup: Clear reset token when leaving the page (unless successfully submitted)
  // useEffect(() => {
  //   return () => {
  //     // Only clear if user didn't successfully submit the form
  //     if (!hasSubmittedRef.current) {
  //       dispatch(clearPasswordResetState());
  //     }
  //   };
  // }, [dispatch]);

  // Redirect if no reset token
  useEffect(() => {
    if (!hasCheckedTokenRef.current) {
      hasCheckedTokenRef.current = true;
      const timer = setTimeout(() => {
        if (!resetToken) {
          toast.error("Invalid or expired reset session. Please start over.");
          setTimeout(() => {
            navigate("/forgot-password");
          }, 1000);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [resetToken, navigate]);

  // Handle successful password reset (only after form submission)
  useEffect(() => {
    if (
      message &&
      !error &&
      !hasNavigatedRef.current &&
      hasSubmittedRef.current
    ) {
      hasNavigatedRef.current = true;
      toast.success(message);
      dispatch(clearPasswordResetState());
      setTimeout(() => {
        navigate("/login");
      }, 1500);
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

    // Check for uppercase letter
    if (!/[A-Z]/.test(newPassword)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(newPassword)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }

    // Check for number
    if (!/[0-9]/.test(newPassword)) {
      toast.error("Password must contain at least one number");
      return;
    }

    if (!resetToken) {
      toast.error("Reset token is missing");
      return;
    }

    // Mark that form has been submitted
    hasSubmittedRef.current = true;

    try {
      await dispatch(
        resetPassword({
          reset_token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        })
      ).unwrap();
    } catch (err: unknown) {
      // Handle API validation errors
      if (err && typeof err === "object" && "new_password" in err) {
        const errorObj = err as { new_password?: string[] };
        if (errorObj.new_password && Array.isArray(errorObj.new_password)) {
          toast.error(errorObj.new_password[0]);
        }
      }
      // Error is also handled by useEffect for other error types
      hasSubmittedRef.current = false;
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

export default ResetPasswordPage;
