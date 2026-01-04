import React, { useState, useEffect, useCallback } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { MultiSelect } from "../../../components/shared/SearchableSelect";
import SearchableSelect from "../../../components/shared/SearchableSelect/SearchableSelect";
import type { Option } from "../../../components/shared/SearchableSelect";
import { useAppSelector } from "../../../store/hooks";
import api from "../../../services/api";
import toast from "react-hot-toast";

type ModalMode = "create" | "edit" | "assign" | "attachment";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
  mode?: ModalMode;
  ticketId?: number;
  initialData?: Partial<TicketFormData>;
}

export interface TicketFormData {
  project: number | null;
  projectName: string;
  title: string;
  priority: string;
  category: string;
  description: string;
  attachments: File[];
  assignedUsers: Option[];
  resolutionDueDate: string;
  estimatedResolutionDate: string;
}

interface TicketAttachment {
  id: number;
  file?: string; // Optional: URL to file
  file_data?: string; // Optional: Base64 encoded file data
  file_name: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: number;
  uploaded_by_name: string;
}

interface Priority {
  value: string;
  display: string;
}

interface Category {
  value: string;
  display: string;
}

interface Project {
  id: number;
  name: string;
  code: string;
  organization_name: string;
}

interface Developer {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization_id: number | null;
  organization_name: string | null;
  phone_number: string;
  whatsapp_number: string;
  department: string;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  ticketId,
  initialData,
}) => {
  // Get user role
  const { user } = useAppSelector((state) => state.auth);
  const isClient = user?.role?.toLowerCase() === "client";

  // Determine initial tab based on mode
  const getInitialTab = useCallback(() => {
    if (mode === "assign") return "assign";
    if (mode === "attachment") return "attachment";
    if (mode === "edit" || mode === "create") return "details";
    return "details";
  }, [mode]);

  const [activeTab, setActiveTab] = useState<
    "assign" | "details" | "attachment"
  >(getInitialTab());

  const [project, setProject] = useState<number | null>(
    initialData?.project || null
  );
  const [projectName, setProjectName] = useState(
    initialData?.projectName || ""
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [priority, setPriority] = useState(initialData?.priority || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [attachments, setAttachments] = useState<File[]>(
    initialData?.attachments || []
  );
  const [existingAttachments, setExistingAttachments] = useState<
    TicketAttachment[]
  >([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<Option[]>(
    initialData?.assignedUsers || []
  );
  const [resolutionDueDate, setResolutionDueDate] = useState(
    initialData?.resolutionDueDate || ""
  );
  const [estimatedResolutionDate, setEstimatedResolutionDate] = useState(
    initialData?.estimatedResolutionDate || ""
  );

  // API Data
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Option[]>([]);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Fetch functions
  const fetchPriorities = async () => {
    try {
      const response = await api.get("tickets/priorities/");
      setPriorities(response.data.priorities);
    } catch (error) {
      console.error("Failed to fetch priorities:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("tickets/categories/");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get("projects/");
      setProjects(response.data.results);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("tickets/developers/");
      const developers = response.data.map((dev: Developer) => ({
        id: dev.id,
        name:
          dev.first_name && dev.last_name
            ? `${dev.first_name} ${dev.last_name}`
            : dev.username,
        email: dev.email,
      }));
      setAvailableUsers(developers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Fetch ticket details if ticketId is provided
  const fetchTicketDetails = async (id: number) => {
    try {
      const response = await api.get(`tickets/${id}/`);
      const ticket = response.data;

      // Populate form fields with ticket data
      setProject(ticket.project);
      setProjectName(ticket.project_name_display || ticket.project_name);
      setTitle(ticket.title);
      setPriority(ticket.priority);
      setCategory(ticket.category);
      setDescription(ticket.description);

      // Populate assigned users if available
      if (ticket.assigned_to && ticket.assigned_to_names) {
        const users = ticket.assigned_to.map((id: number, index: number) => ({
          id,
          name: ticket.assigned_to_names[index],
          email: "", // Email not provided in response
        }));
        setAssignedUsers(users);
      }

      // Populate dates if available
      if (ticket.resolution_due_at) {
        // Convert ISO datetime to YYYY-MM-DD format for date input
        const dueDate = new Date(ticket.resolution_due_at);
        setResolutionDueDate(dueDate.toISOString().split("T")[0]);
      }

      if (ticket.estimated_resolution_time) {
        // Convert ISO datetime to YYYY-MM-DD format for date input
        const estimatedDate = new Date(ticket.estimated_resolution_time);
        setEstimatedResolutionDate(estimatedDate.toISOString().split("T")[0]);
      }
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
    }
  };

  // Fetch attachments for a ticket
  const fetchAttachments = async (id: number) => {
    try {
      const response = await api.get(`tickets/${id}/get_attachments/`);
      setExistingAttachments(response.data.attachments || []);
    } catch (error) {
      console.error("Failed to fetch attachments:", error);
    }
  };

  // Add attachment to ticket
  const addAttachment = async (id: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `tickets/${id}/add_attachment/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh attachments list
      await fetchAttachments(id);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      // Toast removed - will show summary toast after all uploads complete
      return response.data;
    } catch (error) {
      console.error("Failed to add attachment:", error);
      // Toast removed - will show error toast for overall operation if any upload fails
      throw error;
    }
  };

  // Delete attachment from ticket
  const deleteAttachment = async (ticketId: number, attachmentId: number) => {
    try {
      setDeletingFileId(attachmentId);
      await api.delete(
        `tickets/${ticketId}/delete_attachment/${attachmentId}/`
      );

      // Refresh attachments list
      await fetchAttachments(ticketId);
      toast.success("Attachment deleted successfully");
    } catch (error) {
      console.error("Failed to delete attachment:", error);
      toast.error("Failed to delete attachment");
    } finally {
      setDeletingFileId(null);
    }
  };

  // Assign ticket
  const assignTicket = async (id: number) => {
    try {
      // Validate dates
      if (resolutionDueDate && estimatedResolutionDate) {
        const dueDate = new Date(resolutionDueDate);
        const estimatedDate = new Date(estimatedResolutionDate);

        if (estimatedDate > dueDate) {
          toast.error(
            "Estimated resolution time should not be after the resolution due date"
          );
          return;
        }
      }

      setIsCreating(true);

      const payload = {
        assigned_to: assignedUsers.map((user) => user.id),
        resolution_due_at: resolutionDueDate
          ? new Date(resolutionDueDate).toISOString()
          : null,
        estimated_resolution_time: estimatedResolutionDate
          ? new Date(estimatedResolutionDate).toISOString()
          : null,
      };

      await api.post(`tickets/${id}/assign/`, payload);
      toast.success("Ticket assigned successfully");
      onClose();
    } catch (error) {
      console.error("Failed to assign ticket:", error);
      const axiosError = error as {
        response?: { data?: { estimated_resolution_time?: string[] } };
      };
      const errorMsg =
        axiosError?.response?.data?.estimated_resolution_time?.[0] ||
        "Failed to assign ticket";
      toast.error(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  // Reset form when modal closes or mode/ticketId changes
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setProject(null);
      setProjectName("");
      setTitle("");
      setPriority("");
      setCategory("");
      setDescription("");
      setAttachments([]);
      setAssignedUsers([]);
      setResolutionDueDate("");
      setEstimatedResolutionDate("");
      setActiveTab(getInitialTab());
      setUploadSuccess(false);
    } else {
      // When modal opens, set the correct tab based on mode
      setActiveTab(getInitialTab());
    }
  }, [isOpen, mode, getInitialTab]);

  // Fetch data on mount and when ticketId changes
  useEffect(() => {
    if (isOpen) {
      void fetchPriorities();
      void fetchCategories();
      void fetchProjects();
      void fetchUsers();

      // Fetch ticket details if in edit/assign/attachment mode
      if (
        ticketId &&
        (mode === "edit" || mode === "assign" || mode === "attachment")
      ) {
        void fetchTicketDetails(ticketId);
        void fetchAttachments(ticketId);
      }
    }
  }, [isOpen, ticketId, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle different modes
    if (mode === "assign" && ticketId) {
      await assignTicket(ticketId);
      return;
    }

    if (mode === "attachment" && ticketId) {
      try {
        setIsCreating(true);

        // Upload all new attachments
        const uploadPromises = attachments.map((file) =>
          addAttachment(ticketId, file)
        );
        await Promise.all(uploadPromises);

        // Clear local attachments after successful upload
        setAttachments([]);

        toast.success("Attachments saved successfully");

        // Call parent onSubmit to refresh the ticket list
        onSubmit({
          project,
          projectName,
          title,
          priority,
          category,
          description,
          attachments: [],
          assignedUsers,
          resolutionDueDate,
          estimatedResolutionDate,
        });

        // Close modal after successful save
        onClose();
      } catch (error) {
        console.error("Failed to save attachments:", error);
        toast.error("Failed to save attachments");
      } finally {
        setIsCreating(false);
      }
      return;
    }

    // For create mode, call API directly
    if (mode === "create") {
      try {
        setIsCreating(true);
        const payload = {
          project: project,
          project_name: projectName,
          title: title,
          description: description,
          priority: priority,
          category: category,
        };

        const response = await api.post("/tickets/", payload);
        toast.success("Ticket created successfully");

        // If there are attachments, upload them
        if (attachments.length > 0 && response.data.id) {
          for (const file of attachments) {
            await addAttachment(response.data.id, file);
          }
        }

        // Call parent onSubmit with the form data
        onSubmit({
          project,
          projectName,
          title,
          priority,
          category,
          description,
          attachments,
          assignedUsers,
          resolutionDueDate,
          estimatedResolutionDate,
        });

        onClose();
      } catch (error) {
        console.error("Failed to create ticket:", error);
        const axiosError = error as {
          response?: { data?: { detail?: string; [key: string]: unknown } };
        };
        const errorMsg =
          axiosError?.response?.data?.detail ||
          JSON.stringify(axiosError?.response?.data) ||
          "Failed to create ticket";
        toast.error(errorMsg);
      } finally {
        setIsCreating(false);
      }
      return;
    }

    // For edit mode, call API directly
    if (mode === "edit" && ticketId) {
      try {
        setIsCreating(true);
        const payload = {
          title: title,
          description: description,
        };

        await api.patch(`/tickets/${ticketId}/`, payload);
        toast.success("Ticket updated successfully");

        // Call parent onSubmit with the form data
        onSubmit({
          project,
          projectName,
          title,
          priority,
          category,
          description,
          attachments,
          assignedUsers,
          resolutionDueDate,
          estimatedResolutionDate,
        });

        onClose();
      } catch (error) {
        console.error("Failed to update ticket:", error);
        const axiosError = error as {
          response?: { data?: { detail?: string; [key: string]: unknown } };
        };
        const errorMsg =
          axiosError?.response?.data?.detail ||
          JSON.stringify(axiosError?.response?.data) ||
          "Failed to update ticket";
        toast.error(errorMsg);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return ["xlsx", "pdf", "doc", "docx", "jpg", "jpeg", "png"].includes(
        extension || ""
      );
    });

    if (validFiles.length > 0) {
      // Add to local state for batch upload with "Save Attachments" button
      setAttachments((prev) => [...prev, ...validFiles]);
      toast.success(
        `${validFiles.length} file(s) added. Click "Save Attachments" to upload.`
      );
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Add to local state for batch upload with "Save Attachments" button
      setAttachments((prev) => [...prev, ...files]);
      toast.success(
        `${files.length} file(s) added. Click "Save Attachments" to upload.`
      );
    }
    // Reset input
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Check if file is an image
  const isImageFile = (fileName?: string) => {
    if (!fileName) return false;
    const extension = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
      extension || ""
    );
  };

  // Get file data URL (base64 or regular URL)
  const getFileDataUrl = (attachment: TicketAttachment) => {
    if (attachment.file_data) {
      // If base64 data exists, check if it already has data URI prefix
      if (attachment.file_data.startsWith("data:")) {
        return attachment.file_data;
      }
      // Add data URI prefix for images
      if (isImageFile(attachment.file_name)) {
        return `data:image/png;base64,${attachment.file_data}`;
      }
      // For other files, return the base64 data
      return `data:application/octet-stream;base64,${attachment.file_data}`;
    }
    // Fallback to file URL if no base64 data
    return attachment.file || "";
  };

  // Handle file preview/view
  const handleViewFile = (attachment: TicketAttachment) => {
    const dataUrl = getFileDataUrl(attachment);
    if (isImageFile(attachment.file_name)) {
      // For images, open in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${attachment.file_name}</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: #000;
                }
                img {
                  max-width: 100%;
                  max-height: 100vh;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="${attachment.file_name}" />
            </body>
          </html>
        `);
      }
    } else {
      // For other files, trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = attachment.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) {
      return (
        <div className="w-12 h-12 bg-gray-500 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
      );
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return (
        <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 18h12V6h-4V2H4v16zm8-14v4h4l-4-4zM7 13h6v1H7v-1zm0-2h6v1H7v-1zm0-2h4v1H7V9z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  };

  // Render file preview (thumbnail for images, icon for others)
  const renderFilePreview = (attachment: TicketAttachment) => {
    if (isImageFile(attachment.file_name)) {
      const dataUrl = getFileDataUrl(attachment);
      return (
        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
          <img
            src={dataUrl}
            alt={attachment.file_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML = getFileIcon(
                attachment.file_name
              ).props.children;
            }}
          />
        </div>
      );
    }
    return getFileIcon(attachment.file_name);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all overflow-visible">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA]">
            <h2 className="text-lg font-semibold text-dark">
              {mode === "create" && "Create New Ticket"}
              {mode === "edit" && "Edit Ticket"}
              {mode === "assign" && "Assign Ticket"}
              {mode === "attachment" && "Ticket Attachments"}
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

          {/* Tabs - Conditional rendering based on mode and role */}
          {(mode === "create" || mode === "edit") && (
            <div className="flex border-b border-[#E1E4EA] px-6">
              {/* Assign Tab - Only show for admin/superadmin in create/edit mode */}
              {!isClient && (
                <button
                  type="button"
                  onClick={() => setActiveTab("assign")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === "assign"
                      ? "text-primary"
                      : "text-gray hover:text-dark"
                  }`}
                >
                  Assign & SLA
                  {activeTab === "assign" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "details"
                    ? "text-primary"
                    : "text-gray hover:text-dark"
                }`}
              >
                Details
                {activeTab === "details" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
              {/* Attachment Tab - Only show when there's a ticketId */}
              {ticketId && (
                <button
                  type="button"
                  onClick={() => setActiveTab("attachment")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === "attachment"
                      ? "text-primary"
                      : "text-gray hover:text-dark"
                  }`}
                >
                  Attachment
                  {activeTab === "attachment" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Assign & SLA Tab - Only show in create/edit/assign modes */}
              {activeTab === "assign" &&
                (mode === "create" || mode === "edit" || mode === "assign") && (
                  <div className="p-6 space-y-6">
                    {/* Assign Section */}
                    <div>
                      {/* Multi-Select for Users */}
                      <MultiSelect
                        label="Select Developer"
                        options={availableUsers}
                        value={assignedUsers}
                        onChange={setAssignedUsers}
                        placeholder="Select developers to assign..."
                      />
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Resolution Due Date */}
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-2">
                          Resolution Due at
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={resolutionDueDate}
                            onChange={(e) =>
                              setResolutionDueDate(e.target.value)
                            }
                            className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="Start Date"
                          />
                          <svg
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Estimated Resolution Time */}
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-2">
                          Estimated Resolution time
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={estimatedResolutionDate}
                            onChange={(e) =>
                              setEstimatedResolutionDate(e.target.value)
                            }
                            className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="End Date"
                          />
                          <svg
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Details Tab - Only show in create/edit modes */}
              {activeTab === "details" &&
                (mode === "create" || mode === "edit") && (
                  <div className="p-5 mb-2 space-y-4">
                    {/* Project Name - Only in create mode */}
                    {mode === "create" && (
                      <div>
                        <SearchableSelect
                          label="Project Name"
                          options={projects.map((proj) => ({
                            value: String(proj.id),
                            label: `${proj.name} (${proj.code})`,
                          }))}
                          value={project ? String(project) : ""}
                          onChange={(value: string) => {
                            setProject(Number(value));
                            const selectedProject = projects.find(
                              (p) => p.id === Number(value)
                            );
                            if (selectedProject) {
                              setProjectName(selectedProject.name);
                            }
                          }}
                          placeholder="Select Project"
                        />
                      </div>
                    )}

                    {/* Title - Editable in both create and edit */}
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm placeholder:text-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                      />
                    </div>

                    {/* Priority and Category - Only in create mode */}
                    {mode === "create" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <SearchableSelect
                            label="Priority"
                            options={priorities.map((p) => ({
                              value: p.value,
                              label: p.display,
                            }))}
                            value={priority}
                            onChange={setPriority}
                            placeholder="Select Priority"
                          />
                        </div>

                        <div>
                          <SearchableSelect
                            label="Category"
                            options={categories.map((c) => ({
                              value: c.value,
                              label: c.display,
                            }))}
                            value={category}
                            onChange={setCategory}
                            placeholder="Select Category"
                          />
                        </div>
                      </div>
                    )}

                    {/* Description - Editable in both create and edit */}
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Detailed description of the issue or request"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm placeholder:text-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                        required
                      />
                    </div>
                  </div>
                )}

              {/* Attachment Tab - Only show when ticketId exists and in edit/attachment modes */}
              {activeTab === "attachment" &&
                ticketId &&
                (mode === "edit" || mode === "attachment") && (
                  <div className="p-6 space-y-4">
                    {/* Upload Success Message */}
                    {uploadSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-700">
                          Files uploaded successfully!
                        </span>
                      </div>
                    )}

                    {/* Pending Upload Message */}
                    {attachments.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-blue-700">
                          {attachments.length} file(s) ready to upload. Click
                          "Save Attachments" to upload.
                        </span>
                      </div>
                    )}

                    {/* Drag & Drop Area */}
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                        dragActive
                          ? "border-primary bg-blue-50"
                          : "border-[#E1E4EA] bg-[#F5F7FA]"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#E1E4EA] flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-dark">
                            <span className="font-medium">
                              Drag & drop file or{" "}
                            </span>
                            <label className="text-primary hover:underline cursor-pointer font-medium">
                              browse
                              <input
                                type="file"
                                multiple
                                accept=".xlsx,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={handleFileInput}
                                className="hidden"
                              />
                            </label>
                          </p>
                          <p className="text-xs text-gray mt-1">
                            Supported formats: xlsx, .pdf, .doc, .docx, jpg
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Files List */}
                    {(existingAttachments.length > 0 ||
                      attachments.length > 0) && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-dark">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-semibold">
                            Attachments ({existingAttachments.length} uploaded,{" "}
                            {attachments.length} pending)
                          </span>
                        </div>

                        <div className="space-y-3">
                          {/* Existing Attachments from Server */}
                          {existingAttachments.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray uppercase tracking-wide">
                                Uploaded Files
                              </h4>
                              {existingAttachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center gap-4 p-3 bg-white border border-[#E1E4EA] rounded-xl group hover:shadow-md transition-shadow"
                                >
                                  {/* File Preview/Icon */}
                                  {renderFilePreview(attachment)}

                                  {/* File Info */}
                                  <div className="flex-1 min-w-0">
                                    {/* <p className="text-sm font-medium text-dark truncate">
                                      {attachment.file_name}
                                    </p> */}
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-xs text-gray">
                                        {formatFileSize(attachment.file_size)}
                                      </span>
                                      <span className="text-xs text-gray">
                                        {new Date(
                                          attachment.uploaded_at
                                        ).toLocaleDateString()}
                                      </span>
                                      <span className="text-xs text-gray">
                                        by {attachment.uploaded_by_name}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        ticketId &&
                                        deleteAttachment(
                                          ticketId,
                                          attachment.id
                                        )
                                      }
                                      disabled={
                                        deletingFileId === attachment.id
                                      }
                                      className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
                                    >
                                      {deletingFileId === attachment.id ? (
                                        <svg
                                          className="w-4 h-4 text-red-500 animate-spin"
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
                                      ) : (
                                        <svg
                                          className="w-4 h-4 text-red-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleViewFile(attachment)}
                                      className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                                      title={
                                        isImageFile(attachment.file_name)
                                          ? "View image"
                                          : "Download file"
                                      }
                                    >
                                      <svg
                                        className="w-4 h-4 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        {isImageFile(attachment.file_name) ? (
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                          />
                                        ) : (
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                          />
                                        )}
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* New Local Attachments (not yet uploaded) */}
                          {attachments.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray uppercase tracking-wide">
                                Pending Upload
                              </h4>
                              {attachments.map((file, index) => (
                                <div
                                  key={`new-${index}`}
                                  className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-xl group hover:shadow-md transition-shadow"
                                >
                                  {/* File Icon */}
                                  {getFileIcon(file.name)}

                                  {/* File Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-dark truncate">
                                      {file.name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-xs text-gray">
                                        {formatFileSize(file.size)}
                                      </span>
                                      <span className="text-xs text-blue-600 font-medium">
                                        Ready to upload
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => removeAttachment(index)}
                                      className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                                    >
                                      <svg
                                        className="w-4 h-4 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E1E4EA]">
              <button
                type="button"
                onClick={onClose}
                disabled={isCreating}
                className="px-6 py-2.5 text-sm font-medium text-gray hover:text-dark hover:bg-[#F5F7FA] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-xl transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating && (
                  <svg
                    className="w-4 h-4 animate-spin"
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
                {mode === "create" &&
                  (isCreating ? "Creating..." : "Create Ticket")}
                {mode === "edit" && "Update Ticket"}
                {mode === "assign" && "Assign"}
                {mode === "attachment" && "Save Attachments"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
