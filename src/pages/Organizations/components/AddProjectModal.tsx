import React, { useState, useEffect } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { SearchableSelect, Input } from "../../../components/shared";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchUsersByRole } from "../../../store/slices/userSlice";
import { createProject } from "../../../store/slices/organizationSlice";
import toast from "react-hot-toast";

export interface ProjectFormData {
  name: string;
  code: string;
  organization: number;
  description: string;
  project_admin: number | null;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  organizationId: number;
  organizationName: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
  organizationName,
}) => {
  const dispatch = useAppDispatch();
  const { usersByRole } = useAppSelector((state) => state.users);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    code: "",
    organization: organizationId,
    description: "",
    project_admin: null,
  });

  const [loading, setLoading] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Fetch admins from Redux
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUsersByRole("ADMIN"));
    }
  }, [isOpen, dispatch]);

  // Convert admins to options format
  const admins = usersByRole.map((admin) => ({
    value: admin.id.toString(),
    label: admin.full_name || admin.username,
  }));

  // Update organization ID when it changes
  useEffect(() => {
    if (organizationId) {
      setFormData((prev) => ({
        ...prev,
        organization: organizationId,
      }));
    }
  }, [organizationId]);

  if (!isOpen) return null;

  const handleChange = (
    field: keyof ProjectFormData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await dispatch(createProject(formData)).unwrap();
      toast.success("Project created successfully");
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: "",
        code: "",
        organization: organizationId,
        description: "",
        project_admin: null,
      });
    } catch (error: unknown) {
      console.error("Failed to create project:", error);
      const errorMessage =
        typeof error === "string" ? error : "Failed to create project";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
              <Input
                label="Project Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleChange("name", value)}
                placeholder="Enter Project Name"
                required
              />
            </div>

            {/* Project Code */}
            <div className="mb-4">
              <Input
                label="Project Code"
                type="text"
                value={formData.code}
                onChange={(value) => handleChange("code", value)}
                placeholder="Enter Project Code"
                required
              />
            </div>

            {/* Organization (Disabled) */}
            <div className="mb-4">
              <Input
                label="Organization"
                type="text"
                value={organizationName}
                onChange={() => {}}
                disabled
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
              <SearchableSelect
                label="Admin"
                options={admins}
                value={formData.project_admin?.toString() || ""}
                onChange={(value) =>
                  handleChange("project_admin", value ? parseInt(value) : null)
                }
                placeholder="Select Admin"
                searchPlaceholder="Search admins..."
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
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary 
                         rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {loading ? "Creating..." : "Add Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
