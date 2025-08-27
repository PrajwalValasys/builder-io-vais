import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Menu,
  X,
  LayoutDashboard,
  Bot,
  Target,
  Users,
  BarChart3,
  Megaphone,
  Bell,
  Settings,
  HelpCircle,
  Ticket,
  LogOut,
  CreditCard,
  UserCog,
  Search,
  Crown,
  PlusCircle,
  Play,
  RotateCcw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SimpleChatSupport } from "@/components/ui/simple-chat-support";
import { useTour } from "@/contexts/TourContext";
import PlatformTour from "@/components/tour/PlatformTour";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Core navigation items for the middle section
const coreNavigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    tourId: "dashboard-nav",
  },
  { name: "VAIS Results", href: "/build-vais", icon: Bot, tourId: "vais-nav" },
  { name: "ABM/LAL", href: "/abm-lal", icon: Target, tourId: "abm-nav" },
  {
    name: "Find Prospect",
    href: "/find-prospect",
    icon: Search,
    tourId: "prospect-nav",
  },
  {
    name: "Build My Campaign",
    href: "/build-my-campaign",
    icon: Megaphone,
    tourId: "my-campaign-nav",
  },
  {
    name: "Reports",
    href: "/analytics",
    icon: BarChart3,
    tourId: "reports-nav",
  },
];

// Utility items for the bottom section
const utilityItems = [
  {
    name: "Downloaded List",
    href: "/my-downloads",
    icon: Download,
    tourId: "downloads-nav",
  },
  {
    name: "Manage Users",
    href: "/manage-users",
    icon: Users,
    tourId: "users-nav",
  },
  {
    name: "Support Ticket",
    href: "/support",
    icon: Ticket,
    tourId: "support-nav",
  },
  { name: "FAQs", href: "/faqs", icon: HelpCircle, tourId: "faqs-nav" },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    tourId: "settings-nav",
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadNotifications] = useState(3); // Mock unread count
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(true);
  const {
    isTourOpen,
    hasCompletedTour,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  } = useTour();

  const getCurrentPageTitle = () => {
    const currentItem =
      coreNavigationItems.find((item) => item.href === location.pathname) ||
      utilityItems.find((item) => item.href === location.pathname);
    return currentItem?.name || "Dashboard";
  };

  const handleChatToggle = () => {
    if (chatMinimized) {
      setChatMinimized(false);
      setChatOpen(true);
    } else {
      setChatMinimized(true);
      setChatOpen(false);
    }
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setChatMinimized(true);
  };

  return (
    <div className="min-h-screen bg-valasys-gray-50 flex">
      {/* Left Sidebar */}
      <div
        data-tour="sidebar"
        className={cn(
          "bg-white shadow-lg border-r border-valasys-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-50",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        {/* Sidebar Header with Toggle */}
        <div className="p-4 border-b border-valasys-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex items-center space-x-2 transition-opacity duration-200",
                sidebarOpen ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VS</span>
              </div>
              {sidebarOpen && (
                <span className="text-lg font-semibold text-valasys-gray-900">
                  VALASYS AI
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Core Navigation Section */}
          <nav className="p-4">
            <div
              className={cn(
                "mb-3 text-xs font-semibold text-valasys-gray-500 uppercase tracking-wide",
                sidebarOpen ? "block" : "hidden",
              )}
            >
              Navigation
            </div>
            <ul className="space-y-1">
              {coreNavigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      data-tour={item.tourId}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-valasys-orange text-white shadow-sm"
                          : "text-valasys-gray-600 hover:text-valasys-gray-900 hover:bg-valasys-gray-100",
                      )}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <IconComponent
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          sidebarOpen ? "mr-3" : "mx-auto",
                          isActive ? "text-white" : "text-valasys-gray-500",
                        )}
                      />
                      {sidebarOpen && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Utility Features Section */}
          <div className="p-4 border-t border-valasys-gray-200">
            <div
              className={cn(
                "mb-3 text-xs font-semibold text-valasys-gray-500 uppercase tracking-wide",
                sidebarOpen ? "block" : "hidden",
              )}
            >
              Utilities
            </div>
            <ul className="space-y-1">
              {utilityItems.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      data-tour={item.tourId}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-valasys-orange text-white shadow-sm"
                          : "text-valasys-gray-600 hover:text-valasys-gray-900 hover:bg-valasys-gray-100",
                      )}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <IconComponent
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          sidebarOpen ? "mr-3" : "mx-auto",
                          isActive ? "text-white" : "text-valasys-gray-500",
                        )}
                      />
                      {sidebarOpen && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Upgrade Card - Bottom of Sidebar */}
          {sidebarOpen && (
            <div className="p-4 border-t border-valasys-gray-200">
              <div
                data-tour="upgrade"
                className="bg-gradient-to-br from-valasys-orange to-valasys-orange-light rounded-lg p-4 text-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      Become Pro Access
                    </h3>
                    <p className="text-blue-100 text-xs leading-relaxed">
                      Try your experience for using more features.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-white text-valasys-blue hover:bg-gray-50 font-medium text-xs h-8"
                >
                  <Crown className="w-3 h-3 mr-2" />
                  Upgrade Pro
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16",
        )}
      >
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-valasys-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-valasys-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Right side - Notification, G2 Reviews, Profile */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {/* Tour Trigger Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={hasCompletedTour ? resetTour : startTour}
                    className="h-8 px-3 text-valasys-orange border-valasys-orange hover:bg-valasys-orange hover:text-white transition-all duration-200"
                    title={
                      hasCompletedTour
                        ? "Reset Platform Tour"
                        : "Take Platform Tour"
                    }
                  >
                    {hasCompletedTour ? (
                      <RotateCcw className="h-4 w-4 mr-1" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    Tour
                  </Button>

                  {/* Notification Bell */}
                  <div data-tour="notifications" className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-valasys-gray-100"
                      title="Notifications"
                    >
                      <Bell className="h-5 w-5 text-valasys-gray-600" />
                    </Button>
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-valasys-orange border-valasys-orange"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                  </div>

                  {/* G2 Review Logo */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-valasys-gray-100"
                    title="G2 Reviews"
                    asChild
                  >
                    <Link to="/reviews" target="_blank">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F9db3df5b68bf4ece8531cd0e6ed60d89%2F3fa5ac398f0e491bb8a3c77b5810eb8a?format=webp&width=800"
                        alt="G2 Reviews"
                        className="h-5 w-5"
                      />
                    </Link>
                  </Button>

                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        data-tour="profile"
                        variant="ghost"
                        className="flex items-center space-x-2 h-8 px-3 hover:bg-valasys-gray-100"
                        title="Profile Menu"
                      >
                        <div className="w-6 h-6 bg-valasys-orange rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-valasys-gray-700">
                          Valasys Media
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Valasys Media</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <UserCog className="mr-2 h-4 w-4" />
                        Account Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Plan Info
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* Floating Chat Support Widget */}
      <div data-tour="chat">
        <SimpleChatSupport
          isOpen={chatOpen}
          onClose={handleChatClose}
          isMinimized={chatMinimized}
          onMinimize={handleChatToggle}
        />
      </div>

      {/* Platform Tour */}
      <PlatformTour
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
    </div>
  );
}
