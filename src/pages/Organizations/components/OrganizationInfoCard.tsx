import React from "react";
import Badge from "../../../components/shared/Badge/Badge";

interface OrganizationInfoCardProps {
  name: string;
  code: string;
  status: "Active" | "Inactive";
  onEdit: () => void;
}

const OrganizationInfoCard: React.FC<OrganizationInfoCardProps> = ({
  name,
  code,
  status,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E1E4EA] overflow-hidden h-fit">
      {/* Header with Organization Name */}
      <div className="px-6 py-4 border-b border-[#E1E4EA]">
        <span className="text-base font-medium text-dark">{name}</span>
      </div>

      {/* Info Rows */}
      <div className="p-6">
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
            <span className="text-sm text-gray">Organization Name</span>
            <span className="text-sm text-gray">{name.toLowerCase()}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
            <span className="text-sm text-gray">Organization Code</span>
            <span className="text-sm text-gray">{code}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray">Active</span>
            <Badge variant={status === "Active" ? "new" : "default"}>
              {status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Edit Button - Full Width Blue */}
      <button
        onClick={onEdit}
        className="w-full py-3 text-sm font-medium text-white bg-primary 
                   hover:bg-primary/90 transition-colors"
      >
        Edit Organization
      </button>
    </div>
  );
};

export default OrganizationInfoCard;
