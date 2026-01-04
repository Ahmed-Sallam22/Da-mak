import React from "react";

interface PageHeaderProps {
  title: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions, onBack }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 text-gray hover:text-dark hover:bg-[#F5F7FA] rounded-lg transition-colors"
            title="Back to Organizations"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        )}
        <h1 className="text-2xl font-bold text-dark">{title}</h1>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="px-4 py-2 text-sm font-medium text-white bg-primary 
                       rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {action.icon && action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
