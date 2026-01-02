import React, { useState } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";

interface CustomSLAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  }) => void;
  currentSLA?: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

const CustomSLAModal: React.FC<CustomSLAModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentSLA,
}) => {
  const [urgent, setUrgent] = useState(currentSLA?.urgent || 15);
  const [high, setHigh] = useState(currentSLA?.high || 30);
  const [medium, setMedium] = useState(currentSLA?.medium || 60);
  const [low, setLow] = useState(currentSLA?.low || 120);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ urgent, high, medium, low });
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
            <h2 className="text-lg font-semibold text-dark">Set Custom SLA</h2>
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
            <p className="text-sm text-gray mb-6">
              Set custom response times for each priority level. Times are in
              minutes.
            </p>

            {/* Urgent */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  Urgent Response Time
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={urgent}
                  onChange={(e) => setUrgent(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm transition-all pr-20"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray">
                  minutes
                </span>
              </div>
            </div>

            {/* High */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  High Response Time
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={high}
                  onChange={(e) => setHigh(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm transition-all pr-20"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray">
                  minutes
                </span>
              </div>
            </div>

            {/* Medium */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  Medium Response Time
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={medium}
                  onChange={(e) => setMedium(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm transition-all pr-20"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray">
                  minutes
                </span>
              </div>
            </div>

            {/* Low */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Low Response Time
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={low}
                  onChange={(e) => setLow(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-[#E1E4EA] 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           text-sm transition-all pr-20"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray">
                  minutes
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E1E4EA]">
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
                Save SLA
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomSLAModal;
