import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../../../store/slices/notificationSlice";
import type { Notification } from "../../../types";
import { formatDistanceToNow } from "date-fns";

interface NotificationsDropdownProps {
  isOpen: boolean;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notifications, loading } = useAppSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch]);

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await dispatch(markAsRead(notificationId)).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    navigate(`/tickets/${notification.ticket}`);
  };

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const older: Notification[] = [];

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.created_at);
      if (notificationDate >= todayStart) {
        today.push(notification);
      } else if (notificationDate >= yesterdayStart) {
        yesterday.push(notification);
      } else {
        older.push(notification);
      }
    });

    return { today, yesterday, older };
  }, [notifications]);

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg 
                    border border-[#E1E4EA] animate-in fade-in zoom-in-95 
                    duration-100 origin-top-right max-h-128 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1E4EA]">
        <h3 className="text-lg font-semibold text-dark">Notifications</h3>
        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary hover:text-primary/80 font-medium
                         transition-colors duration-150"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <svg
              className="w-16 h-16 text-gray/40 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            {/* Today Section */}
            {groupedNotifications.today.length > 0 && (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray uppercase tracking-wide">
                    Today
                  </p>
                </div>
                {groupedNotifications.today.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </>
            )}

            {/* Yesterday Section */}
            {groupedNotifications.yesterday.length > 0 && (
              <>
                <div className="px-4 py-2 mt-2">
                  <p className="text-xs font-medium text-gray uppercase tracking-wide">
                    Yesterday
                  </p>
                </div>
                {groupedNotifications.yesterday.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </>
            )}

            {/* Older Section */}
            {groupedNotifications.older.length > 0 && (
              <>
                <div className="px-4 py-2 mt-2">
                  <p className="text-xs font-medium text-gray uppercase tracking-wide">
                    Older
                  </p>
                </div>
                {groupedNotifications.older.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Notification Item Component
interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead: () => void;
  formatTimeAgo: (date: string) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onMarkAsRead,
  formatTimeAgo,
}) => {
  return (
    <div
      className={`px-4 py-3 hover:bg-[#F5F7FA] transition-colors duration-150 
                  cursor-pointer border-b border-[#E1E4EA] ${
                    !notification.is_read ? "bg-primary/5" : ""
                  }`}
    >
      <div className="flex gap-3">
        <div
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            !notification.is_read ? "bg-primary/10" : "bg-gray/10"
          }`}
        >
          <svg
            className={`w-5 h-5 ${
              !notification.is_read ? "text-primary" : "text-gray"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-semibold ${
                !notification.is_read ? "text-dark" : "text-gray"
              }`}
            >
              {notification.subject}
            </h4>
            <span className="text-xs text-gray whitespace-nowrap">
              {formatTimeAgo(notification.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray mt-1 line-clamp-2">
            {notification.ticket_title}
          </p>
          {!notification.is_read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
              className="text-sm text-primary hover:text-primary/80 font-medium mt-2"
            >
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
