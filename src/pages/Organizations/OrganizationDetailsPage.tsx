import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditOrganizationModal from "./components/EditOrganizationModal";
import AddOrgAccountModal from "./components/AddOrgAccountModal";
import AddProjectModal from "./components/AddProjectModal";
import CustomSLAModal from "./components/CustomSLAModal";
import OrganizationInfoCard from "./components/OrganizationInfoCard";
import NotificationPreferencesCard from "./components/NotificationPreferencesCard";
import SLASettingsCard from "./components/SLASettingsCard";
import DataTableSection from "./components/DataTableSection";
import PageHeader from "./components/PageHeader";
import { getAccountColumns, getProjectColumns } from "./constants/tableColumns";
import type { OrgAccountFormData } from "./components/AddOrgAccountModal";
import type { ProjectFormData } from "./components/AddProjectModal";
import { usePageTitle } from "../../hooks/usePageTitle";
import api from "../../services/api";
import toast from "react-hot-toast";

interface OrganizationDetails {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  use_default_sla: boolean;
  notification_preferences: {
    notify_on_opened: boolean;
    notify_on_resolved: boolean;
    notify_on_assigned: boolean;
    notify_on_in_progress: boolean;
  };
  sla: {
    type: string;
    urgent_response_minutes?: number;
    high_response_minutes?: number;
    medium_response_minutes?: number;
    low_response_minutes?: number;
  };
  users: string[];
  user_count: number;
  projects: string[];
  project_count: number;
  tickets: string[];
  ticket_count: number;
  created_at: string;
  updated_at: string;
}

const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const OrganizationDetailsPage: React.FC = () => {
  usePageTitle("تفاصيل المؤسسة");
  const { id } = useParams();

  // State
  const [organization, setOrganization] = useState<OrganizationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Local state for notification preferences (before saving)
  const [localNotifications, setLocalNotifications] = useState({
    notify_on_opened: false,
    notify_on_resolved: false,
    notify_on_assigned: false,
    notify_on_in_progress: false,
  });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isCustomSLAModalOpen, setIsCustomSLAModalOpen] = useState(false);

  // Fetch organization details
  const fetchOrganizationDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get<OrganizationDetails>(
        `/organizations/${id}/details/`
      );
      setOrganization(response.data);
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
      toast.error("Failed to load organization details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Sync local notifications with fetched organization data
  useEffect(() => {
    if (organization) {
      setLocalNotifications(organization.notification_preferences);
    }
  }, [organization]);

  // Mock data for tables (will be replaced with API data later)
  const accountColumns = useMemo(() => getAccountColumns(), []);
  const projectColumns = useMemo(() => getProjectColumns(), []);

  // Convert user/project names to table format
  const orgAccountsData = useMemo(() => {
    if (!organization) return [];
    return organization.users.map((username, index) => ({
      id: `user-${index}`,
      username: username,
      name: username,
      email: `${username}@example.com`, // Mock email
      role: "User", // Mock role
      status: "Active",
    }));
  }, [organization]);

  const projectsData = useMemo(() => {
    if (!organization) return [];
    return organization.projects.map((projectName, index) => ({
      id: `project-${index}`,
      name: projectName,
      code: `PROJ-${index}`, // Mock code
      admin: "Admin", // Mock admin
      ticketCount: 0, // Mock data
      status: "Active",
    }));
  }, [organization]);

  // Toggle notification preference (local state only, not API call)
  const toggleNotification = (
    key: keyof OrganizationDetails["notification_preferences"]
  ) => {
    setLocalNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Notification preferences configuration
  const notificationPreferences = useMemo(() => {
    if (!organization) return [];
    return [
      {
        label: "Notify when Opened",
        value: localNotifications.notify_on_opened,
        onChange: () => toggleNotification("notify_on_opened"),
      },
      {
        label: "Notify when Assigned",
        value: localNotifications.notify_on_assigned,
        onChange: () => toggleNotification("notify_on_assigned"),
      },
      {
        label: "Notify when In Progress",
        value: localNotifications.notify_on_in_progress,
        onChange: () => toggleNotification("notify_on_in_progress"),
      },
      {
        label: "Notify when Resolved",
        value: localNotifications.notify_on_resolved,
        onChange: () => toggleNotification("notify_on_resolved"),
      },
    ];
  }, [organization, localNotifications]);

  // Page header actions
  const headerActions = useMemo(
    () => [
      {
        label: "Add Org Account",
        onClick: () => setIsAddAccountModalOpen(true),
        icon: <PlusIcon />,
      },
      {
        label: "Add Project",
        onClick: () => setIsAddProjectModalOpen(true),
        icon: <PlusIcon />,
      },
    ],
    []
  );

  // SLA settings
  const slaSettings = useMemo(() => {
    if (!organization)
      return { type: "none", urgent: 0, high: 0, medium: 0, low: 0 };
    return {
      type: organization.sla.type,
      urgent: organization.sla.urgent_response_minutes || 0,
      high: organization.sla.high_response_minutes || 0,
      medium: organization.sla.medium_response_minutes || 0,
      low: organization.sla.low_response_minutes || 0,
    };
  }, [organization]);

  // Handlers
  const handleSaveNotifications = async () => {
    if (!organization || !id) return;

    try {
      await api.patch(
        `/organizations/${id}/notification-preferences/`,
        localNotifications
      );
      // Update the organization state with saved values
      setOrganization({
        ...organization,
        notification_preferences: localNotifications,
      });
      toast.success("Notification preferences saved successfully");
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
      toast.error("Failed to save notification preferences");
    }
  };

  const handleEditOrganization = async (data: {
    name: string;
    code: string;
    status: boolean;
  }) => {
    if (!id) return;

    try {
      await api.patch(`/organizations/${id}/`, {
        name: data.name,
        code: data.code,
      });
      toast.success("Organization updated successfully");
      setIsEditModalOpen(false);
      fetchOrganizationDetails(); // Refresh data
    } catch (error) {
      console.error("Failed to update organization:", error);
      toast.error("Failed to update organization");
    }
  };

  const handleCustomSLA = async (data: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  }) => {
    if (!id) return;

    try {
      await api.post("/organization-sla/", {
        organization: parseInt(id),
        urgent_response_minutes: data.urgent,
        high_response_minutes: data.high,
        medium_response_minutes: data.medium,
        low_response_minutes: data.low,
      });
      toast.success("Custom SLA configured successfully");
      setIsCustomSLAModalOpen(false);
      fetchOrganizationDetails(); // Refresh data
    } catch (error) {
      console.error("Failed to set custom SLA:", error);
      toast.error("Failed to set custom SLA");
    }
  };

  const handleAddAccount = (data: OrgAccountFormData) => {
    console.log("Add account:", data);
    setIsAddAccountModalOpen(false);
  };

  const handleAddProject = (data: ProjectFormData) => {
    console.log("Add project:", data);
    setIsAddProjectModalOpen(false);
  };

  const handleSetDefaultSLA = async () => {
    if (!id) return;

    try {
      await api.post(`/organizations/${id}/assign-default-sla/`);
      toast.success("Default SLA assigned successfully");
      fetchOrganizationDetails(); // Refresh data
    } catch (error) {
      console.error("Failed to assign default SLA:", error);
      toast.error("Failed to assign default SLA");
    }
  };

  const handleUnassignSLA = async () => {
    if (!id) return;

    try {
      await api.post(`/organizations/${id}/unassign-sla/`);
      toast.success("SLA unassigned successfully");
      fetchOrganizationDetails(); // Refresh data
    } catch (error) {
      console.error("Failed to unassign SLA:", error);
      toast.error("Failed to unassign SLA");
    }
  };

  if (loading || !organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader title="Organization Details" actions={headerActions} />

      {/* Top Section - Organization Info and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <OrganizationInfoCard
          name={organization.name}
          code={organization.code}
          status={organization.is_active ? "Active" : "Inactive"}
          onEdit={() => setIsEditModalOpen(true)}
        />

        <NotificationPreferencesCard
          preferences={notificationPreferences}
          onSave={handleSaveNotifications}
        />
      </div>

      {/* SLA Settings Section */}
      <div className="mb-6">
        <SLASettingsCard
          sla={slaSettings}
          onSetDefault={handleSetDefaultSLA}
          onSetCustom={() => setIsCustomSLAModalOpen(true)}
          onUnassign={handleUnassignSLA}
        />
      </div>

      {/* Org Accounts Section */}
      <div className="mb-6">
        <DataTableSection
          title="Org Accounts"
          columns={accountColumns}
          data={orgAccountsData}
        />
      </div>

      {/* Projects Section */}
      <DataTableSection
        title="Projects"
        columns={projectColumns}
        data={projectsData}
      />

      {/* Modals */}
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditOrganization}
        organization={{
          name: organization.name,
          code: organization.code,
          status: organization.is_active,
        }}
      />

      <AddOrgAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSubmit={handleAddAccount}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onSubmit={handleAddProject}
        organizationName={organization.name}
      />

      <CustomSLAModal
        isOpen={isCustomSLAModalOpen}
        onClose={() => setIsCustomSLAModalOpen(false)}
        onSubmit={handleCustomSLA}
        currentSLA={{
          urgent: organization.sla.urgent_response_minutes || 15,
          high: organization.sla.high_response_minutes || 30,
          medium: organization.sla.medium_response_minutes || 60,
          low: organization.sla.low_response_minutes || 120,
        }}
      />
    </div>
  );
};

export default OrganizationDetailsPage;
