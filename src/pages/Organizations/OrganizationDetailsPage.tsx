import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditOrganizationModal from "./components/EditOrganizationModal";
import AddOrgAccountModal from "./components/AddOrgAccountModal";
import AddProjectModal from "./components/AddProjectModal";
import CustomSLAModal from "./components/CustomSLAModal";
import AssignAdminModal from "./components/AssignAdminModal";
import OrganizationInfoCard from "./components/OrganizationInfoCard";
import NotificationPreferencesCard from "./components/NotificationPreferencesCard";
import SLASettingsCard from "./components/SLASettingsCard";
import DataTableSection from "./components/DataTableSection";
import PageHeader from "./components/PageHeader";
import { getAccountColumns, getProjectColumns } from "./constants/tableColumns";
import type { OrgAccountFormData } from "./components/AddOrgAccountModal";
import type { ProjectFormData } from "./components/AddProjectModal";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchOrganizationDetails,
  updateOrganization,
  updateNotificationPreferences,
  setCustomSLA,
  setDefaultSLA,
  unassignSLA,
} from "../../store/slices/organizationSlice";
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const { currentOrganization: organization, loading } = useAppSelector(
    (state) => state.organizations
  );

  // Local state for notification preferences (before saving)
  // Track which org id we've initialized notifications for
  const [notificationsState, setNotificationsState] = useState<{
    orgId: number | null;
    preferences: {
      notify_on_opened: boolean;
      notify_on_resolved: boolean;
      notify_on_assigned: boolean;
      notify_on_in_progress: boolean;
    };
  }>({
    orgId: null,
    preferences: {
      notify_on_opened: false,
      notify_on_resolved: false,
      notify_on_assigned: false,
      notify_on_in_progress: false,
    },
  });

  // Derive local notifications - sync when org changes
  const localNotifications = useMemo(() => {
    if (organization && organization.id !== notificationsState.orgId) {
      // New organization loaded, use its preferences
      return organization.notification_preferences;
    }
    return notificationsState.preferences;
  }, [organization, notificationsState]);

  // Function to update local notifications
  const setLocalNotifications = (
    preferences: typeof notificationsState.preferences
  ) => {
    setNotificationsState({
      orgId: organization?.id || null,
      preferences,
    });
  };

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isCustomSLAModalOpen, setIsCustomSLAModalOpen] = useState(false);
  const [isAssignAdminModalOpen, setIsAssignAdminModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [isUpdateAdminMode, setIsUpdateAdminMode] = useState(false);

  // Fetch organization details
  useEffect(() => {
    if (id) {
      dispatch(fetchOrganizationDetails(parseInt(id)));
    }
  }, [dispatch, id]);

  // Mock data for tables (will be replaced with API data later)
  const accountColumns = useMemo(() => getAccountColumns(), []);

  const handleAssignAdmin = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsUpdateAdminMode(false);
    setIsAssignAdminModalOpen(true);
  };

  const handleUpdateAdmin = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsUpdateAdminMode(true);
    setIsAssignAdminModalOpen(true);
  };

  const projectColumns = useMemo(
    () => getProjectColumns(handleAssignAdmin, handleUpdateAdmin),
    []
  );

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
    setLocalNotifications({
      ...localNotifications,
      [key]: !localNotifications[key],
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await dispatch(
        updateNotificationPreferences({
          orgId: parseInt(id),
          preferences: localNotifications,
        })
      ).unwrap();
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
      await dispatch(
        updateOrganization({
          orgId: parseInt(id),
          orgData: data,
        })
      ).unwrap();
      toast.success("Organization updated successfully");
      setIsEditModalOpen(false);
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
      await dispatch(
        setCustomSLA({
          orgId: parseInt(id),
          slaData: data,
        })
      ).unwrap();
      toast.success("Custom SLA configured successfully");
      setIsCustomSLAModalOpen(false);
    } catch (error) {
      console.error("Failed to set custom SLA:", error);
      toast.error("Failed to set custom SLA");
    }
  };

  const handleAddAccount = (data: OrgAccountFormData) => {
    console.log("Add account:", data);
    setIsAddAccountModalOpen(false);
    if (id) {
      dispatch(fetchOrganizationDetails(parseInt(id)));
    }
  };

  const handleAddProject = (data: ProjectFormData) => {
    console.log("Add project:", data);
    setIsAddProjectModalOpen(false);
    if (id) {
      dispatch(fetchOrganizationDetails(parseInt(id)));
    }
  };

  const handleSetDefaultSLA = async () => {
    if (!id) return;

    try {
      await dispatch(setDefaultSLA(parseInt(id))).unwrap();
      toast.success("Default SLA assigned successfully");
    } catch (error) {
      console.error("Failed to assign default SLA:", error);
      toast.error("Failed to assign default SLA");
    }
  };

  const handleUnassignSLA = async () => {
    if (!id) return;

    try {
      await dispatch(unassignSLA(parseInt(id))).unwrap();
      toast.success("SLA unassigned successfully");
    } catch (error) {
      console.error("Failed to unassign SLA:", error);
      toast.error("Failed to unassign SLA");
    }
  };

  const handleBackToOrganizations = () => {
    navigate("/organizations");
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
      <PageHeader
        title="Organization Details"
        actions={headerActions}
        onBack={handleBackToOrganizations}
      />

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
        organizationId={organization.id}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onSubmit={handleAddProject}
        organizationId={organization.id}
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

      <AssignAdminModal
        isOpen={isAssignAdminModalOpen}
        onClose={() => setIsAssignAdminModalOpen(false)}
        onSuccess={() => {
          setIsAssignAdminModalOpen(false);
          if (id) {
            dispatch(fetchOrganizationDetails(parseInt(id)));
          }
        }}
        projectId={selectedProjectId || 0}
        isUpdateMode={isUpdateAdminMode}
      />
    </div>
  );
};

export default OrganizationDetailsPage;
