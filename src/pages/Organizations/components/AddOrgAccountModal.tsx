import React, { useState } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";

export interface OrgAccountFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  whatsapp: string;
  department: string;
}

interface AddOrgAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrgAccountFormData) => void;
}

const AddOrgAccountModal: React.FC<AddOrgAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<OrgAccountFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
    phone: "",
    whatsapp: "",
    department: "",
  });

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles = ["Admin", "Manager", "User", "Viewer"];

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleChange = (field: keyof OrgAccountFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "",
      phone: "",
      whatsapp: "",
      department: "",
    });
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
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
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
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
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
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Enter Last Name"
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm placeholder-gray transition-all"
                  required
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                             text-sm text-left transition-all flex items-center justify-between"
                  >
                    <span className={formData.role ? "text-dark" : "text-gray"}>
                      {formData.role || "Select Role"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray transition-transform ${
                        roleDropdownOpen ? "rotate-180" : ""
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
                  {roleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4EA] rounded-xl shadow-lg z-10">
                      {roles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            handleChange("role", role);
                            setRoleDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-[#F5F7FA] first:rounded-t-xl last:rounded-b-xl"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
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
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
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
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary 
                         rounded-xl hover:bg-primary/90 transition-colors"
              >
                Add Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrgAccountModal;
