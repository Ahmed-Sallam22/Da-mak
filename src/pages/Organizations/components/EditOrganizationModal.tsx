import React, { useState } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import Toggle from "../../../components/ui/Toggle";

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; code: string; status: boolean }) => void;
  organization: {
    name: string;
    code: string;
    status: boolean;
  };
}

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  organization,
}) => {
  const [name, setName] = useState(organization.name);
  const [code, setCode] = useState(organization.code);
  const [status, setStatus] = useState(organization.status);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, code, status });
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
              Edit Organization
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
            <div className="p-4 bg-[#F5F7FA] rounded-xl mb-6">
              <Toggle
                label="Status"
                value={status}
                onChange={() => setStatus(!status)}
                variant="green"
              />
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrganizationModal;
