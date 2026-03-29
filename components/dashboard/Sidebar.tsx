"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/dashboard/NotificationPanel";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import {
  getUserAvatarColor,
  getUserInitials,
  getUserDisplayName,
} from "@/lib/helpers/avatar-utils";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { useRealEstateContext } from "@/app/dashboard/realestate/real-estate-context";
import { useAgricultureContext } from "@/app/dashboard/agriculture/agriculture-context";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon size={20} />,
  },
];

export function Sidebar({
  type = "default", // "agriculture" | "real-estate" | "default"
  data = [], // lands or properties
}: {
  type?: "agriculture" | "real-estate" | "default";
  data?: Array<{
    id: string;
    name: string;
    tenants?: Array<{ id: string; name: string }>;
  }>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Get user avatar color based on user ID
  const avatarColor = session?.user?.id
    ? getUserAvatarColor(session.user.id)
    : { from: "from-blue-500", to: "to-purple-600" };

  // Get user initials
  const userInitials = getUserInitials(
    session?.user?.name,
    session?.user?.email,
  );

  // Get display name
  const displayName = getUserDisplayName(
    session?.user?.name,
    session?.user?.email,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleToggleMobileSidebar() {
      setIsMobileOpen((prev) => !prev);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("toggleMobileSidebar", handleToggleMobileSidebar);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener(
        "toggleMobileSidebar",
        handleToggleMobileSidebar,
      );
    };
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  // Call hooks unconditionally at the top level
  // Hooks must always be called in the same order on every render
  const realEstateContext = useRealEstateContext();
  const agricultureContext = useAgricultureContext();

  const properties = realEstateContext?.properties || [];
  const lands = agricultureContext?.lands || [];

  // Calculate sections to show
  const showRealEstate =
    type === "real-estate" ||
    (type === "default" && properties && properties.length > 0);
  const showAgriculture =
    type === "agriculture" || (type === "default" && lands && lands.length > 0);

  // States for collapsible sections
  const [isRealEstateOpen, setIsRealEstateOpen] = useState(true);
  const [isAgricultureOpen, setIsAgricultureOpen] = useState(true);

  // Section toggle for detail views
  const [sectionOpen, setSectionOpen] = useState(true);
  const [itemTenantsOpen, setItemTenantsOpen] = useState<
    Record<string, boolean>
  >({});

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`flex flex-col min-h-screen bg-white dark:bg-black text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out z-50 ${
          isMobileOpen
            ? "fixed left-0 top-0"
            : "fixed -left-full top-0 lg:relative lg:left-0"
        }`}
        style={{ width: isCollapsed ? "4rem" : "14rem" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div
              className={`flex items-center gap-2 overflow-hidden transition-all duration-200 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white dark:text-black font-bold text-sm">
                    P
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  PropFusion
                </span>
              </Link>
            </div>
            {/* Collapsed state logo */}
            <div
              className={`absolute left-4 top-4 transition-all duration-200 ${isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white dark:text-black font-bold text-sm">
                  P
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Notification Bell — hidden when collapsed */}
              {!isCollapsed && <NotificationBell />}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`p-1.5 hover:bg-gray-100 dark:hover:bg-[#0a0a0a] rounded-lg transition-colors shrink-0 ${isCollapsed ? "mx-auto mt-12" : ""}`}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              {/* Mobile close button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#0a0a0a] rounded-lg transition-colors"
                title="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
            {/* Main Menu */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-xl transition-colors
                      ${
                        isActive
                          ? "bg-gray-100 dark:bg-[#1f1f1f] text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111]"
                      }
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <span
                      className={
                        isActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400"
                      }
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Real Estate Section */}
            {showRealEstate && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {!isCollapsed ? (
                  <div className="px-3 mb-2 flex items-center justify-between group">
                    <Link
                      href="/dashboard/realestate"
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Real Estate
                    </Link>
                    <button
                      onClick={() => setIsRealEstateOpen(!isRealEstateOpen)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isRealEstateOpen ? "" : "-rotate-90"
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <div
                    className="px-3 mb-2 flex justify-center"
                    title="Real Estate"
                  >
                    <span className="text-xs font-bold text-gray-500">RE</span>
                  </div>
                )}

                {isRealEstateOpen && (
                  <div className="space-y-1">
                    {properties?.map((property) => (
                      <Link
                        key={property.id}
                        href={`/dashboard/realestate/${property.id}`}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-xl transition-colors
                          text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111]
                        `}
                        title={isCollapsed ? property.name : undefined}
                      >
                        <span className="text-lg">🏢</span>
                        {!isCollapsed && (
                          <span className="truncate">{property.name}</span>
                        )}
                      </Link>
                    ))}
                    {(!properties || properties.length === 0) &&
                      !isCollapsed && (
                        <div className="px-3 py-2 text-sm text-gray-400 italic">
                          No properties
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {/* Agriculture Section */}
            {showAgriculture && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {!isCollapsed ? (
                  <div className="px-3 mb-2 flex items-center justify-between group">
                    <Link
                      href="/dashboard/agriculture"
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Agriculture
                    </Link>
                    <button
                      onClick={() => setIsAgricultureOpen(!isAgricultureOpen)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isAgricultureOpen ? "" : "-rotate-90"
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <div
                    className="px-3 mb-2 flex justify-center"
                    title="Agriculture"
                  >
                    <span className="text-xs font-bold text-gray-500">AG</span>
                  </div>
                )}

                {isAgricultureOpen && (
                  <div className="space-y-1">
                    {lands?.map((land) => (
                      <Link
                        key={land.id}
                        href={`/dashboard/agriculture/${land.id}`}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-xl transition-colors
                          text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111]
                        `}
                        title={isCollapsed ? land.name : undefined}
                      >
                        <span className="text-lg">🌱</span>
                        {!isCollapsed && (
                          <span className="truncate">{land.name}</span>
                        )}
                      </Link>
                    ))}
                    {(!lands || lands.length === 0) && !isCollapsed && (
                      <div className="px-3 py-2 text-sm text-gray-400 italic">
                        No lands
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reports Section */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {!isCollapsed ? (
                <div className="px-3 mb-2 flex items-center justify-between group">
                  <Link
                    href="/dashboard/reports"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Reports
                  </Link>
                </div>
              ) : (
                <div className="px-3 mb-2 flex justify-center" title="Reports">
                  <span className="text-xs font-bold text-gray-500">RP</span>
                </div>
              )}
              {/* Optionally, you could preview recent reports or add quick links here in the future */}
            </div>

            {/* Dynamic Section for specific context view - maintained for backward compatibility with page details */}
            {type !== "default" && data.length > 0 && (
              <div className="pt-4">
                <button
                  onClick={() => setSectionOpen((v) => !v)}
                  className={`flex items-center gap-2 px-3 py-2 w-full text-sm font-semibold ${
                    type === "agriculture"
                      ? "text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900"
                      : "text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                  } rounded-lg`}
                >
                  <span>{type === "agriculture" ? "🌱" : "🏢"}</span>
                  <span className="flex-1 text-left">
                    {type === "agriculture"
                      ? "Agriculture Lands"
                      : "Real Estate Properties"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${sectionOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sectionOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {data.map((item) => (
                      <div key={item.id}>
                        <button
                          onClick={() =>
                            setItemTenantsOpen((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          className="flex items-center gap-2 px-2 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0a0a0a] rounded"
                        >
                          <span className="truncate flex-1">{item.name}</span>
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${itemTenantsOpen[item.id] ? "rotate-180" : ""}`}
                          />
                        </button>
                        {itemTenantsOpen[item.id] && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.tenants?.map((tenant, idx: number) => (
                              <span
                                key={idx}
                                className="block px-2 py-1 text-xs text-gray-500 dark:text-gray-400 truncate"
                              >
                                👤 {tenant.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <Link
                      href={
                        type === "agriculture"
                          ? "/dashboard/agriculture/reports"
                          : "/dashboard/realestate/reports"
                      }
                      className={`flex items-center gap-2 px-2 py-1 text-sm ${type === "agriculture" ? "text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900" : "text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"} rounded mt-2`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Reports</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div
            className="p-3 border-t border-gray-200 dark:border-gray-800 mt-auto relative overflow-visible"
            ref={profileMenuRef}
          >
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`flex items-center ${isCollapsed ? "justify-center px-2" : "gap-2 sm:gap-3 px-2 sm:px-3"} py-2 w-full text-sm hover:bg-gray-100 dark:hover:bg-[#0a0a0a] rounded-lg transition-colors`}
                title={isCollapsed ? displayName : undefined}
              >
                <div
                  className={`w-8 h-8 shrink-0 rounded-full ${!session?.user?.image ? `bg-linear-to-b ${avatarColor.from} ${avatarColor.to}` : ""} flex items-center justify-center text-white font-semibold text-xs sm:text-sm overflow-hidden`}
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      width={32}
                      height={32}
                    />
                  ) : (
                    userInitials
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm truncate">
                        {displayName}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 truncate">
                        {session?.user?.email || "user@example.com"}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                        profileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div
                  className={`absolute bottom-full mb-2 bg-white dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-50 ${
                    isCollapsed ? "left-full ml-2 w-48" : "left-0 right-0"
                  }`}
                >
                  <Link
                    href="/dashboard/account/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2942] transition-colors"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsMobileOpen(false);
                    }}
                  >
                    <User className="w-5 h-5" />
                    <span>View Profile</span>
                  </Link>
                  <ThemeToggle />
                  <Link
                    href="/dashboard/account/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2942] transition-colors"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsMobileOpen(false);
                    }}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#1a2942] transition-colors border-t border-gray-200 dark:border-gray-800"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
