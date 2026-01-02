import { useEffect } from "react";

/**
 * Custom hook to lock body scroll when a modal is open
 * @param isLocked - Boolean to control whether scroll should be locked
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Prevent scroll
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Restore scroll
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isLocked]);
};
