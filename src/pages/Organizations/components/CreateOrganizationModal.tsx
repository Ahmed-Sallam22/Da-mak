import React, { useState } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import Toggle from "../../../components/ui/Toggle";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    code: string;
    is_active: boolean;
    notify_on_opened: boolean;
    notify_on_assigned: boolean;
    notify_on_in_progress: boolean;
    notify_on_resolved: boolean;
  }) => void;
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [notifyOpened, setNotifyOpened] = useState(true);
  const [notifyAssigned, setNotifyAssigned] = useState(true);
  const [notifyInProgress, setNotifyInProgress] = useState(true);
  const [notifyResolved, setNotifyResolved] = useState(true);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      code,
      is_active: isActive,
      notify_on_opened: notifyOpened,
      notify_on_assigned: notifyAssigned,
      notify_on_in_progress: notifyInProgress,
      notify_on_resolved: notifyResolved,
    });
    // Reset form
    setName("");
    setCode("");
    setIsActive(true);
    setNotifyOpened(true);
    setNotifyAssigned(true);
    setNotifyInProgress(true);
    setNotifyResolved(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA]">
            <h2 className="text-lg font-semibold text-dark">
              Create New Organization
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray hover:text-dark hover:bg-[#F5F7FA] rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Organization Info Section */}
            <div className="mb-6">
              {/* Organization Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-dark mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Organization Name"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Organization Code */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-dark mb-2">
                  Organization Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter Organization Code"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Status Toggle */}
              <div className="p-4 bg-[#F5F7FA] rounded-xl">
                <Toggle
                  label="Status"
                  value={isActive}
                  onChange={() => setIsActive(!isActive)}
                  variant="green"
                />
              </div>
            </div>

            {/* Notification Preferences Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-dark mb-4">
                Notification Preferences
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-[#F5F7FA] rounded-xl">
                  <Toggle
                    label="Notify when Opened"
                    value={notifyOpened}
                    onChange={() => setNotifyOpened(!notifyOpened)}
                    variant="green"
                  />
                </div>

                <div className="p-4 bg-[#F5F7FA] rounded-xl">
                  <Toggle
                    label="Notify when Assigned"
                    value={notifyAssigned}
                    onChange={() => setNotifyAssigned(!notifyAssigned)}
                    variant="green"
                  />
                </div>

                <div className="p-4 bg-[#F5F7FA] rounded-xl">
                  <Toggle
                    label="Notify when In Progress"
                    value={notifyInProgress}
                    onChange={() => setNotifyInProgress(!notifyInProgress)}
                    variant="green"
                  />
                </div>

                <div className="p-4 bg-[#F5F7FA] rounded-xl">
                  <Toggle
                    label="Notify when Resolved"
                    value={notifyResolved}
                    onChange={() => setNotifyResolved(!notifyResolved)}
                    variant="green"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E1E4EA]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-dark bg-white border border-[#E1E4EA] 
                         rounded-xl hover:bg-[#F5F7FA] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary 
                         rounded-xl hover:bg-primary/90 transition-colors"
              >
                Create Organization
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
