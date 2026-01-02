import React from "react";

interface PageHeaderProps {
  title: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-dark">{title}</h1>
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
