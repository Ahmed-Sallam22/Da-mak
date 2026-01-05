import React, { useState, useEffect } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { SearchableSelect, Input } from "../../../components/shared";
import { EyeIcon, EyeSlashIcon } from "../../../assets/icons";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchRoles, createUser } from "../../../store/slices/userSlice";
import toast from "react-hot-toast";

export interface OrgAccountFormData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: string;
  organization: number;
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
  const dispatch = useAppDispatch();
  const { roles: rolesData } = useAppSelector((state) => state.users);

  const [formData, setFormData] = useState<OrgAccountFormData>({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    role: "CLIENT",
    organization: organizationId,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Fetch roles from Redux
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchRoles());
    }
  }, [isOpen, dispatch]);

  // Convert roles to options format
  const roles = rolesData.map((role) => ({
    value: role.value,
    label: role.display,
  }));

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
      await dispatch(createUser(formData)).unwrap();
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
        organization: organizationId,
      });
    } catch (error: unknown) {
      console.error("Failed to create organization account:", error);
      const errorMessage =
        typeof error === "string" ? error : "Failed to create account";
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
              <Input
                label="Username"
                type="text"
                value={formData.username}
                onChange={(value) => handleChange("username", value)}
                placeholder="Enter Username"
                required
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                placeholder="Enter Email"
                required
              />

              {/* Password */}
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(value) => handleChange("password", value)}
                placeholder="Enter Password"
                icon={showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                onIconClick={() => setShowPassword(!showPassword)}
                required
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.password_confirm}
                onChange={(value) => handleChange("password_confirm", value)}
                placeholder="Confirm Password"
                icon={showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                error={
                  formData.password_confirm &&
                  formData.password !== formData.password_confirm
                    ? "Passwords do not match"
                    : undefined
                }
                required
              />

              {/* First Name */}
              <Input
                label="First Name"
                type="text"
                value={formData.first_name}
                onChange={(value) => handleChange("first_name", value)}
                placeholder="Enter First Name"
                required
              />

              {/* Last Name */}
              <Input
                label="Last Name"
                type="text"
                value={formData.last_name}
                onChange={(value) => handleChange("last_name", value)}
                placeholder="Enter Last Name"
                required
              />

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
