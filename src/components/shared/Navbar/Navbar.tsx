import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NavbarProps } from "./Navbar.types";
import NotificationsDropdown from "./NotificationsDropdown";
import { LogoIcon } from "../../../assets/icons";

const Navbar: React.FC<NavbarProps> = ({
  userName = "Amr Mohamed",
  userEmail = "Company@mail.com",
  userAvatar,
  notificationCount = 0,
  onLogoClick,
  onNotificationClick,
  onSearchClick,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showProfileDropdown || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown, showNotifications]);

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate("/tickets");
    }
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    if (onLogout) {
      onLogout();
    } else {
      navigate("/");
    }
  };

  const navItems = [
    {
      label: t("navbar.tickets"),
      path: "/tickets",
      icon: (
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
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      label: "Tickets Board",
      path: "/tickets-board",
      icon: (
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
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
      ),
    },
    {
      label: t("navbar.userManagement"),
      path: "/user-management",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      label: "Organizations",
      path: "/organizations",
      icon: (
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },

    {
      label: t("navbar.settings"),
      path: "/settings",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-600 ${
        isScrolled ? "bg-white  border-[#E1E4EA] shadow-sm" : ""
      }`}
    >
      <div className="w-[95%] max-w-480 mx-auto pt-3 lg:px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center gap-8 bg-white p-3 rounded-xl">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 focus:outline-none group"
            >
              <LogoIcon />
            </button>

            {/* Navigation Items - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                transition-all duration-150
                                ${
                                  isActive
                                    ? "text-primary bg-primary/5"
                                    : "text-gray hover:text-dark hover:bg-[#F5F7FA]"
                                }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Actions and Profile */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (onNotificationClick) onNotificationClick();
                }}
                className="bg-white p-2.5 rounded-xl relative  text-gray hover:text-dark hover:bg-[#F5F7FA] 
                           transition-all duration-150"
                aria-label="Notifications"
              >
                <svg
                  className="w-6 h-6"
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
                {notificationCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white 
                                   text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <NotificationsDropdown isOpen={showNotifications} />
            </div>

            {/* Search */}
            <button
              onClick={onSearchClick}
              className="bg-white p-2.5 rounded-xl  text-gray hover:text-dark hover:bg-[#F5F7FA] 
                          transition-all duration-150"
              aria-label="Search"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative " ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="bg-white p-2.5 rounded-xl flex items-center gap-3   hover:bg-[#F5F7FA] 
                           transition-all duration-150 group"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-blue-600 
                                flex items-center justify-center text-white font-semibold text-sm
                                overflow-hidden border-2 border-white shadow-sm"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userName.charAt(0)}</span>
                  )}
                </div>

                {/* User Info - Desktop Only */}
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-semibold text-dark">
                    {userName}
                  </span>
                  <span className="text-xs text-gray">{userEmail}</span>
                </div>

                {/* Dropdown Arrow */}
                <svg
                  className={`hidden lg:block w-4 h-4 text-gray transition-transform duration-150
                              ${showProfileDropdown ? "rotate-180" : ""}`}
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
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg 
                                border border-[#E1E4EA] py-2 animate-in fade-in zoom-in-95 
                                duration-100 origin-top-right"
                >
                  {/* Mobile - Show user info */}
                  <div className="lg:hidden px-4 py-3 border-b border-[#E1E4EA]">
                    <p className="text-sm font-semibold text-dark">
                      {userName}
                    </p>
                    <p className="text-xs text-gray">{userEmail}</p>
                  </div>

                  {/* Profile Link */}
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-dark hover:bg-[#F5F7FA] 
                               transition-colors duration-150 flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-gray"
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
                    {t("navbar.profile")}
                  </button>

                  {/* Settings Link */}
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/settings");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-dark hover:bg-[#F5F7FA] 
                               transition-colors duration-150 flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-gray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {t("navbar.settings")}
                  </button>

                  <div className="my-1 border-t border-[#E1E4EA]"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 
                               transition-colors duration-150 flex items-center gap-3"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {t("navbar.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
