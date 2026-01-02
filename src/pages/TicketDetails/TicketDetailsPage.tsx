import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Badge } from "../../components/shared";
import type { BadgeVariant } from "../../components/shared/Badge/Badge.types";
import ApproveRejectModal from "./components/ApproveRejectModal";

interface Attachment {
  id: string;
  name: string;
  size: string;
  date: string;
  url: string;
  thumbnail?: string;
}

const TicketDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Set page title
  usePageTitle("Ticket Details");

  // Mock ticket data (replace with actual data from API/route params)
  const ticket = {
    id: "TICK-001",
    title: "Title Problem",
    projectName: "Project Name",
    status: "waiting" as BadgeVariant,
    priority: "medium" as BadgeVariant,
    category: "bug" as BadgeVariant,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum",
    estimatedTime: "12/23/2025, 6:00:00 PM",
    attachments: [
      {
        id: "1",
        name: "#INV-9801.PDF",
        size: "10.3 KB",
        date: "25/8/2025",
        url: "#",
        thumbnail: "/path/to/thumbnail1.jpg",
      },
      {
        id: "2",
        name: "#INV-9802.PDF",
        size: "12.5 KB",
        date: "25/8/2025",
        url: "#",
        thumbnail: "/path/to/thumbnail2.jpg",
      },
    ] as Attachment[],
  };

  const handleApprove = (reason: string) => {
    console.log("Approved with reason:", reason);
    // TODO: Add API call to approve ticket
    setShowApproveModal(false);
  };

  const handleReject = (reason: string) => {
    console.log("Rejected with reason:", reason);
    // TODO: Add API call to reject ticket
    setShowRejectModal(false);
  };

  const handleDownload = (attachment: Attachment) => {
    console.log("Download attachment:", attachment);
    // TODO: Implement download functionality
  };

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
                {ticket.title}
              </h1>
              <p className="text-sm text-gray">{ticket.projectName}</p>
            </div>
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
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mb-8">
            <Badge variant={ticket.status}>Waiting Approval</Badge>
            <Badge variant={ticket.priority}>Medium</Badge>
            <Badge variant={ticket.category}>BUG</Badge>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-dark mb-3">
              Description
            </h2>
            <p className="text-sm text-gray leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Estimated Time Section */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-dark mb-3">
              Estimated Time
            </h2>
            <p className="text-sm text-gray">{ticket.estimatedTime}</p>
          </div>

          {/* Attachments Section */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-dark mb-4">
                Attachments ({ticket.attachments.length})
              </h2>

              {/* Attachment Thumbnails */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {ticket.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="relative group rounded-xl overflow-hidden border border-[#E1E4EA] bg-gray-100 aspect-video"
                  >
                    {/* Placeholder for thumbnail - replace with actual image */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-blue-300"
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
                    </div>

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDownload(attachment)}
                        className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
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
                      <button className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Attachment File Info */}
              <div className="space-y-3">
                {ticket.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl border border-[#E1E4EA] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {/* PDF Icon */}
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 18h12V6h-4V2H4v16zm8-14v4h4l-4-4zM7 13h6v1H7v-1zm0-2h6v1H7v-1zm0-2h4v1H7V9z" />
                        </svg>
                      </div>

                      {/* File Info */}
                      <div>
                        <p className="text-sm font-medium text-dark">
                          {attachment.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray">
                            {attachment.size}
                          </span>
                          <span className="text-xs text-gray">
                            {attachment.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="w-9 h-9 bg-white hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors border border-[#E1E4EA]"
                    >
                      <svg
                        className="w-4 h-4 text-primary"
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default TicketDetailsPage;
