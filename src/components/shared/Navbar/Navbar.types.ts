export interface NavbarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogoClick?: () => void;
  onNotificationClick?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive?: boolean;
}
