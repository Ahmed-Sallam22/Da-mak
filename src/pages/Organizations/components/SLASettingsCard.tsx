import React from "react";

interface SLASettings {
  type: string;
  urgent: number;
  high: number;
  medium: number;
  low: number;
}

interface SLASettingsCardProps {
  sla: SLASettings;
  onSetDefault: () => void;
  onSetCustom: () => void;
  onUnassign: () => void;
}

const SLASettingsCard: React.FC<SLASettingsCardProps> = ({
  sla,
  onSetDefault,
  onSetCustom,
  onUnassign,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E1E4EA] p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-medium text-dark">SLA Settings</h2>
      </div>

      {/* SLA Status Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-sm text-dark font-medium">SLA Status</span>
          <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
            {sla.type}
          </span>
          <span className="text-sm text-gray">
            Urgent: <span className="text-dark">{sla.urgent} min</span>
            {" | "}
            High: <span className="text-orange-500">{sla.high} min</span>
            {" | "}
            Medium: <span className="text-green-500">{sla.medium} min</span>
            {" | "}
            Low: <span className="text-blue-500">{sla.low} min</span>
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSetDefault}
            className="px-4 py-2 text-sm font-medium text-dark border border-[#E1E4EA] 
                     rounded-full hover:bg-[#F5F7FA] transition-colors"
          >
            Set Default SLA
          </button>
          <button
            onClick={onSetCustom}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary 
                     rounded-full hover:bg-primary/5 transition-colors"
          >
            Custom SLA
          </button>
          <button
            onClick={onUnassign}
            className="px-4 py-2 text-sm font-medium text-orange-500 border border-orange-300 
                     rounded-full hover:bg-orange-50 transition-colors"
          >
            Unassign SLA
          </button>
        </div>
      </div>
    </div>
  );
};

export default SLASettingsCard;
