import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/shared";
import { usePageTitle } from "../../hooks/usePageTitle";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Set page title
  usePageTitle(t("notFound.pageTitle"));

  const handleGoHome = () => {
    navigate("/tickets");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Large 404 Text */}
            <h1 className="text-[120px] sm:text-[150px] lg:text-[180px] font-bold text-primary/10 leading-none select-none">
              404
            </h1>

            {/* Ticket Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-24 h-24 sm:w-32 sm:h-32 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-3">
            {t("notFound.title")}
          </h2>
          <p className="text-base sm:text-lg text-gray max-w-md mx-auto">
            {t("notFound.description")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            title={t("notFound.goHome")}
            variant="primary"
            size="lg"
            onClick={handleGoHome}
            className="w-full sm:w-auto"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {t("notFound.goHome")}
          </Button>

          <Button
            title={t("notFound.goBack")}
            variant="outline"
            size="lg"
            onClick={handleGoBack}
            className="w-full sm:w-auto"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("notFound.goBack")}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-[#E1E4EA]">
          <p className="text-sm text-gray mb-4">{t("notFound.helpText")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <button
              onClick={() => navigate("/tickets")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t("notFound.viewTickets")}
            </button>
            <span className="text-[#E1E4EA]">•</span>
            <button
              onClick={() => navigate("/settings")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t("notFound.settings")}
            </button>
            <span className="text-[#E1E4EA]">•</span>
            <button
              onClick={() =>
                (window.location.href = "mailto:support@tickety.com")
              }
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t("notFound.contactSupport")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
