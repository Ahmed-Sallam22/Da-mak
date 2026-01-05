import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Badge } from "../../components/shared";
import type { BadgeVariant } from "../../components/shared/Badge/Badge.types";
import ApproveRejectModal from "./components/ApproveRejectModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchTicketDetails,
  approveTicket,
  rejectTicket,
  clearCurrentTicket,
} from "../../store/slices/ticketSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";

const TicketDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { currentTicket, loading, error } = useAppSelector(
    (state) => state.tickets
  );
  const { user } = useAppSelector((state) => state.auth);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Check if user is client
  const isClient = user?.role?.toUpperCase() === "CLIENT";

  // Set page title
  usePageTitle("Ticket Details");

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketDetails(Number(id)));
    }

    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [id, dispatch]);

  const handleApprove = async (reason: string) => {
    if (!id) return;

    try {
      await dispatch(approveTicket({ ticketId: Number(id), reason })).unwrap();
      toast.success("Ticket approved successfully");
      setShowApproveModal(false);
    } catch (error) {
      toast.error((error as string) || "Failed to approve ticket");
    }
  };

  const handleReject = async (reason: string) => {
    if (!id) return;

    try {
      await dispatch(rejectTicket({ ticketId: Number(id), reason })).unwrap();
      toast.success("Ticket rejected successfully");
      setShowRejectModal(false);
    } catch (error) {
      toast.error((error as string) || "Failed to reject ticket");
    }
  };

  const handleDownload = (
    fileData: string,
    fileName: string = "attachment"
  ) => {
    // Convert base64 to blob and download
    try {
      // Remove data URL prefix if present
      const base64Data = fileData.includes("base64,")
        ? fileData.split("base64,")[1]
        : fileData;

      // Convert base64 to binary
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob and download
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "attachment";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download attachment");
    }
  };

  // Helper to check if file is an image
  const isImage = (fileName?: string): boolean => {
    if (!fileName) return true; // Default to true if no filename, assume image
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const extension = fileName.split(".").pop()?.toLowerCase();
    return imageExtensions.includes(extension || "");
  };

  // Helper to convert base64 to data URL for images
  const getImageDataUrl = (base64Data: string): string => {
    if (!base64Data) return "";
    if (base64Data.startsWith("data:")) {
      return base64Data;
    }
    // Detect image type from base64 header or default to jpeg
    return `data:image/jpeg;base64,${base64Data}`;
  };

  // Helper function to convert priority/category/status to badge variant
  const getBadgeVariant = (value: string): BadgeVariant => {
    return value.toLowerCase() as BadgeVariant;
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !currentTicket) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{error || "Ticket not found"}</p>
          <button
            onClick={() => navigate("/tickets")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button
            onClick={() => navigate("/tickets")}
            className="text-primary hover:underline"
          >
            My Tickets
          </button>
          <span className="text-gray">/</span>
          <span className="text-dark">Tickets Details</span>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm  p-5">
          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-dark mb-2">
                {currentTicket.title}
              </h1>
              <p className="text-sm text-gray">
                {currentTicket.project_name_display ||
                  currentTicket.project_name ||
                  "No Project"}
              </p>
            </div>
            {isClient && currentTicket.status === "RESOLVED" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-6 py-2.5 bg-[#D44333] hover:bg-[#e94937] text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="px-6 py-2.5 bg-[#00A350] hover:bg-[#048b46] text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Approve
                </button>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mb-8">
            <Badge variant={getBadgeVariant(currentTicket.status)}>
              {currentTicket.status_display}
            </Badge>
            <Badge variant={getBadgeVariant(currentTicket.priority)}>
              {currentTicket.priority_display}
            </Badge>
            <Badge variant={getBadgeVariant(currentTicket.category)}>
              {currentTicket.category_display}
            </Badge>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-dark mb-3">
              Description
            </h2>
            <p className="text-sm text-gray leading-relaxed">
              {currentTicket.description}
            </p>
          </div>

          {/* Assigned To Section */}
          {currentTicket.assigned_to_names &&
            currentTicket.assigned_to_names.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base font-semibold text-dark mb-3">
                  Assigned To
                </h2>
                <div className="flex flex-wrap gap-2">
                  {currentTicket.assigned_to_names.map((name, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Estimated Time Section */}
          {currentTicket.estimated_resolution_time && (
            <div className="mb-8">
              <h2 className="text-base font-semibold text-dark mb-3">
                Estimated Resolution Time
              </h2>
              <p className="text-sm text-gray">
                {currentTicket.estimated_resolution_time} hours
              </p>
            </div>
          )}

          {/* Resolution Due Date Section */}
          {currentTicket.resolution_due_at && (
            <div className="mb-8">
              <h2 className="text-base font-semibold text-dark mb-3">
                Resolution Due Date
              </h2>
              <p className="text-sm text-gray">
                {format(new Date(currentTicket.resolution_due_at), "PPpp")}
              </p>
            </div>
          )}

          {/* Metadata Section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-base font-semibold text-dark mb-3">
                Created By
              </h2>
              <p className="text-sm text-gray">
                {currentTicket.created_by_name}
              </p>
              <p className="text-xs text-gray mt-1">
                {format(new Date(currentTicket.created_at), "PPpp")}
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-dark mb-3">
                Last Updated
              </h2>
              <p className="text-sm text-gray">
                {format(new Date(currentTicket.updated_at), "PPpp")}
              </p>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-dark mb-4">
              Attachments
              {currentTicket.attachments &&
                currentTicket.attachments.length > 0 && (
                  <span className="text-gray text-sm font-normal ml-2">
                    ({currentTicket.attachments.length})
                  </span>
                )}
            </h2>

            {currentTicket.attachments &&
            currentTicket.attachments.length > 0 ? (
              /* Attachment Grid with Previews */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTicket.attachments.map((attachment) => {
                  const fileName =
                    attachment.file_name || `attachment-${attachment.id}.jpg`;
                  const fileIsImage = isImage(fileName);
                  const imageUrl = getImageDataUrl(attachment.file_data);

                  // Debug log
                  console.log("Attachment:", {
                    id: attachment.id,
                    fileName,
                    fileIsImage,
                    hasData: !!attachment.file_data,
                    dataLength: attachment.file_data?.length || 0,
                  });

                  return (
                    <div
                      key={attachment.id}
                      className="group relative rounded-xl overflow-hidden border border-[#E1E4EA] bg-white hover:shadow-lg transition-all"
                    >
                      {/* Preview Area */}
                      <div className="aspect-video relative bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                        {fileIsImage && imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={fileName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Image load error for:", fileName);
                              // Hide broken image, show fallback
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <svg
                              className="w-16 h-16 text-blue-300 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-xs text-blue-400 mt-2">
                              {fileName.split(".").pop()?.toUpperCase() ||
                                "FILE"}
                            </p>
                          </div>
                        )}

                        {/* Overlay with actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              handleDownload(attachment.file_data, fileName)
                            }
                            className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                            title="Download"
                          >
                            <svg
                              className="w-5 h-5 text-dark"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          {fileIsImage && imageUrl && (
                            <button
                              onClick={() => {
                                // Open image in new window for full view
                                const newWindow = window.open();
                                if (newWindow) {
                                  newWindow.document.write(`
                                      <html>
                                        <head><title>${fileName}</title></head>
                                        <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;">
                                          <img src="${imageUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
                                        </body>
                                      </html>
                                    `);
                                }
                              }}
                              className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                              title="View full size"
                            >
                              <svg
                                className="w-5 h-5 text-dark"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="p-4">
                        <p
                          className="text-sm font-medium text-dark truncate"
                          title={fileName}
                        >
                          {fileName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray">
                          {attachment.file_size && (
                            <span>{formatFileSize(attachment.file_size)}</span>
                          )}
                          {attachment.uploaded_at && (
                            <span>
                              {format(
                                new Date(attachment.uploaded_at),
                                "MM/dd/yyyy"
                              )}
                            </span>
                          )}
                        </div>
                        {attachment.uploaded_by_name && (
                          <p className="text-xs text-gray mt-1">
                            by {attachment.uploaded_by_name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Attachments Message */
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <p className="text-gray-500 text-sm font-medium">
                  No attachments
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  This ticket has no attached files
                </p>
              </div>
            )}
          </div>

          {/* History Timeline Section */}
          {currentTicket.history && currentTicket.history.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-dark mb-6">
                History Timeline
              </h2>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                  {currentTicket.history.map((item) => (
                    <div key={item.id} className="relative flex gap-4 group">
                      {/* Timeline Dot */}
                      <div className="relative z-10 shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white border-4 border-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <svg
                            className="w-5 h-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Timeline Content Card */}
                      <div className="flex-1 bg-white rounded-xl border border-[#E1E4EA] p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <Badge
                                variant={getBadgeVariant(item.status_from)}
                              >
                                {item.status_from_display}
                              </Badge>
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                              <Badge variant={getBadgeVariant(item.status_to)}>
                                {item.status_to_display}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-dark mt-2">
                              {item.comment}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray">
                          <span className="flex items-center gap-1">
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {item.changed_by_name}
                          </span>
                          <span className="flex items-center gap-1">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {format(new Date(item.timestamp), "PPpp")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve and Reject Modals - Only for Clients */}
      {isClient && (
        <>
          {/* Approve Modal */}
          <ApproveRejectModal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            onSubmit={handleApprove}
            type="approve"
            title="Approve Ticket"
            message="Please provide a reason for approving this ticket"
          />

          {/* Reject Modal */}
          <ApproveRejectModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            onSubmit={handleReject}
            type="reject"
            title="Reject Ticket"
            message="Please provide a reason for rejecting this ticket"
          />
        </>
      )}
    </div>
  );
};

export default TicketDetailsPage;
