import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/shared";
import { EyeIcon, EyeSlashIcon } from "../../assets/icons";
import { usePageTitle } from "../../hooks";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Set page title
  usePageTitle(`${t("login.loginButton")}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { username, password });
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
          {t("login.heading")}
          <span className="text-primary">
            {" "}
            {t("login.headingHighlight")}
          </span>{" "}
          {t("login.headingSuffix")}
        </h2>

        {/* Description */}
        <p className="text-gray text-center text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-2">
          {t("login.description")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <Input
            label={t("login.username")}
            type="text"
            placeholder={t("login.usernamePlaceholder")}
            value={username}
            onChange={setUsername}
          />

          <Input
            label={t("login.password")}
            type={showPassword ? "text" : "password"}
            placeholder={t("login.passwordPlaceholder")}
            value={password}
            onChange={setPassword}
            icon={showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
          />

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs sm:text-sm text-dark hover:text-primary transition-colors"
            >
              {t("login.forgotPassword")}
            </button>
          </div>

          {/* Login Button */}
          <Button
            title={t("login.loginButton")}
            type="submit"
            fullWidth
            size="md"
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
