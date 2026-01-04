import React, { useState, useEffect } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { SearchableSelect } from "../../../components/shared";
import api from "../../../services/api";
import toast from "react-hot-toast";

export interface OrgAccountFormData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  whatsapp_number: string;
  department: string;
  organization: number;
}

interface Role {
  value: string;
  display: string;
}

interface RolesResponse {
  roles: Role[];
}

interface AddOrgAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrgAccountFormData) => void;
  organizationId: number;
}

const AddOrgAccountModal: React.FC<AddOrgAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
}) => {
  const [formData, setFormData] = useState<OrgAccountFormData>({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    role: "CLIENT",
    phone_number: "",
    whatsapp_number: "",
    department: "",
    organization: organizationId,
  });

  const [roles, setRoles] = useState<Array<{ value: string; label: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get<RolesResponse>("/users/roles/");
        const roleOptions = response.data.roles.map((role) => ({
          value: role.value,
          label: role.display,
        }));
        setRoles(roleOptions);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to load roles");
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  // Update organization ID when it changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      organization: organizationId,
    }));
  }, [organizationId]);

  if (!isOpen) return null;

  const handleChange = (
    field: keyof OrgAccountFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.password_confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/users/create-organization-user/", formData);
      toast.success("Organization account created successfully");
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        password_confirm: "",
        first_name: "",
        last_name: "",
        role: "CLIENT",
        phone_number: "",
        whatsapp_number: "",
        department: "",
        organization: organizationId,
      });
    } catch (error: unknown) {
      console.error("Failed to create organization account:", error);
      let errorMessage = "Failed to create account";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { detail?: string; message?: string } };
        };
        errorMessage =
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          errorMessage;
      }
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
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA] sticky top-0 bg-white z-10">
            <h2 className="text-lg font-semibold text-dark">Add Org Account</h2>
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
            <div className="grid grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Enter Username"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.password_confirm}
                  onChange={(e) =>
                    handleChange("password_confirm", e.target.value)
                  }
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="Enter First Name"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Enter Last Name"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Role - Using SearchableSelect */}
              <div>
                <SearchableSelect
                  label="Role"
                  options={roles}
                  value={formData.role}
                  onChange={(value) => handleChange("role", value)}
                  placeholder="Select Role"
                  searchPlaceholder="Search roles..."
                  disabled={true}
                />
                <p className="text-xs text-gray mt-1">
                  Role is set to CLIENT for organization users
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp_number}
                  onChange={(e) =>
                    handleChange("whatsapp_number", e.target.value)
                  }
                  placeholder="Enter WhatsApp Number"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="Enter Department"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-[#E1E4EA]">
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
                {loading ? "Creating..." : "Add Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrgAccountModal;
