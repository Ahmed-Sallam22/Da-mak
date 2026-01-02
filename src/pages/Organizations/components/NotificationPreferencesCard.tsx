import React from "react";
import Toggle from "../../../components/ui/Toggle";

interface NotificationPreference {
  label: string;
  value: boolean;
  onChange: () => void;
}

interface NotificationPreferencesCardProps {
  preferences: NotificationPreference[];
  onSave: () => void;
}

const NotificationPreferencesCard: React.FC<
  NotificationPreferencesCardProps
> = ({ preferences, onSave }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E1E4EA] overflow-hidden h-fit">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E1E4EA]">
        <span className="text-base font-medium text-dark">
          Notification Preferences
        </span>
      </div>

      {/* Notification Toggles */}
      <div className="p-6">
        <div className="space-y-3">
          {preferences.map((pref) => (
            <Toggle
              key={pref.label}
              label={pref.label}
              value={pref.value}
              onChange={pref.onChange}
              variant="primary"
              bordered
            />
          ))}
        </div>
      </div>

      {/* Save Changes - Text Button */}
      <div className="px-6 py-3 border-t border-[#E1E4EA]">
        <button
          onClick={onSave}
          className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferencesCard;
