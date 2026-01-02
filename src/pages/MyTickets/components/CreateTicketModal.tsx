import React, { useState } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
}

export interface TicketFormData {
  projectName: string;
  title: string;
  priority: string;
  category: string;
  description: string;
  attachments: File[];
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "attachment">(
    "details"
  );
  const [projectName, setProjectName] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectName,
      title,
      priority,
      category,
      description,
      attachments,
    });
    // Reset form
    setProjectName("");
    setTitle("");
    setPriority("");
    setCategory("");
    setDescription("");
    setAttachments([]);
    setActiveTab("details");
    setUploadSuccess(false);
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
      setAttachments((prev) => [...prev, ...validFiles]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
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

  const getFileIcon = (fileName: string) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E1E4EA]">
            <h2 className="text-lg font-semibold text-dark">
              Create New Ticket
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

          {/* Tabs */}
          <div className="flex border-b border-[#E1E4EA] px-6">
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
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm placeholder:text-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>

                {/* Title */}
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

                {/* Priority and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                        required
                      >
                        <option value="" disabled>
                          Select Priority
                        </option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <svg
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray pointer-events-none"
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
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F7FA] border border-[#E1E4EA] rounded-xl text-dark text-sm appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                        required
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option value="bug">Bug</option>
                        <option value="feature">Feature</option>
                        <option value="support">Support</option>
                      </select>
                      <svg
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray pointer-events-none"
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
                    </div>
                  </div>
                </div>

                {/* Description */}
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

            {/* Attachment Tab */}
            {activeTab === "attachment" && (
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
                      Three files uploaded successfully.
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
                {attachments.length > 0 && (
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
                      <span className="text-sm font-semibold">Attachment</span>
                    </div>

                    <div className="space-y-3">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-white border border-[#E1E4EA] rounded-xl group hover:shadow-md transition-shadow"
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
                              <span className="text-xs text-gray">
                                {new Date().toLocaleDateString()}
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
                            <button
                              type="button"
                              className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
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
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E1E4EA]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-gray hover:text-dark hover:bg-[#F5F7FA] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-xl transition-colors shadow-sm hover:shadow"
              >
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
