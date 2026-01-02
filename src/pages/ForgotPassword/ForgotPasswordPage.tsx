import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/shared";
import { usePageTitle } from "../../hooks";
import { showToast } from "../../utils";

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  usePageTitle(`${t("forgotPassword.title")}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast.error(t("toast.fillAllFields"));
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showToast.success(t("toast.emailSent"));
      navigate("/otp", { state: { email } });
    }, 1500);
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

export default ForgotPasswordPage;
