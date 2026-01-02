import React, { useState } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";

export interface ProjectFormData {
  name: string;
  code: string;
  organization: string;
  description: string;
  admin: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  organizationName: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  organizationName,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    code: "",
    organization: organizationName,
    description: "",
    admin: "",
  });

  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  // Mock admins list
  const admins = ["Ahmed Ali", "Sara Mohamed", "Omar Hassan", "Fatima Ahmed"];

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      name: "",
      code: "",
      organization: organizationName,
      description: "",
      admin: "",
    });
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
            <h2 className="text-lg font-semibold text-dark">Add Project</h2>
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
            {/* Project Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter Project Name"
                className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                         text-sm placeholder-gray transition-all"
                required
              />
            </div>

            {/* Project Code */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                Project Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="Enter Project Code"
                className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                         text-sm placeholder-gray transition-all"
                required
              />
            </div>

            {/* Organization (Disabled) */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                Organization
              </label>
              <input
                type="text"
                value={organizationName}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                         bg-[#F5F7FA] text-sm text-gray cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter Project Description"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                         text-sm placeholder-gray transition-all resize-none"
              />
            </div>

            {/* Admin Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">
                Admin
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm text-left transition-all flex items-center justify-between"
                >
                  <span className={formData.admin ? "text-dark" : "text-gray"}>
                    {formData.admin || "Select Admin"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray transition-transform ${
                      adminDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {adminDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-xl shadow-lg z-10">
                    {admins.map((admin) => (
                      <button
                        key={admin}
                        type="button"
                        onClick={() => {
                          handleChange("admin", admin);
                          setAdminDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-[#F5F7FA] first:rounded-t-xl last:rounded-b-xl"
                      >
                        {admin}
                      </button>
                    ))}
                  </div>
                )}
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
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
