import React, { useState, useEffect } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { SearchableSelect } from "../../../components/shared";
import api from "../../../services/api";
import toast from "react-hot-toast";

interface Admin {
  id: number;
  username: string;
  full_name: string;
}

interface AdminsResponse {
  role: string;
  count: number;
  users: Admin[];
}

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: number;
  isUpdateMode: boolean;
}

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  isUpdateMode,
}) => {
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [admins, setAdmins] = useState<Array<{ value: string; label: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);

  useScrollLock(isOpen);

  // Fetch admins from API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api.get<AdminsResponse>(
          "/users/by_role/?role=ADMIN"
        );
        const adminOptions = response.data.users.map((admin) => ({
          value: admin.id.toString(),
          label: admin.full_name || admin.username,
        }));
        setAdmins(adminOptions);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
        toast.error("Failed to load admins");
      }
    };

    if (isOpen) {
      fetchAdmins();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAdminId) {
      toast.error("Please select an admin");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isUpdateMode
        ? `/projects/${projectId}/update-admin/`
        : `/projects/${projectId}/assign_admin/`;

      await api.post(endpoint, {
        admin_id: parseInt(selectedAdminId),
      });

      toast.success(
        isUpdateMode
          ? "Admin updated successfully"
          : "Admin assigned successfully"
      );
      onSuccess();
      onClose();
      setSelectedAdminId("");
    } catch (error: unknown) {
      console.error("Failed to assign/update admin:", error);
      let errorMessage = isUpdateMode
        ? "Failed to update admin"
        : "Failed to assign admin";
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
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA]">
            <h2 className="text-lg font-semibold text-dark">
              {isUpdateMode ? "Update Admin" : "Assign Admin"}
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
            <SearchableSelect
              label="Select Admin"
              options={admins}
              value={selectedAdminId}
              onChange={setSelectedAdminId}
              placeholder="Choose an admin"
              searchPlaceholder="Search admins..."
            />

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
                {loading
                  ? isUpdateMode
                    ? "Updating..."
                    : "Assigning..."
                  : isUpdateMode
                  ? "Update"
                  : "Assign"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignAdminModal;
