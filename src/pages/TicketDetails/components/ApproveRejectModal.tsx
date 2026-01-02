import React, { useState } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";

interface ApproveRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  type: "approve" | "reject";
  title: string;
  message: string;
}

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  title,
  message,
}) => {
  const [reason, setReason] = useState("");

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA]">
            <h2 className="text-lg font-semibold text-dark">{title}</h2>
            <button
              onClick={handleClose}
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
            {/* Message */}
            <p className="text-sm text-gray mb-4">{message}</p>

            {/* Reason Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason..."
                rows={5}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm placeholder:text-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                required
              />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 text-sm font-medium text-gray hover:text-dark hover:bg-[#F5F7FA] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-colors shadow-sm hover:shadow ${
                  type === "approve"
                    ? "bg-[#00A350] hover:bg-[#048b46]"
                    : "bg-[#D44333] hover:bg-[#e94937]"
                }`}
              >
                {type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectModal;
