"use client";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell, ChevronDown, Menu, X, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '../../shared/stockflow-high-resolution-logo-grayscale-transparent.png';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart4, 
  LogOut as LogOutIcon,
  Users,
  UserPen,
  ChevronRight
} from "lucide-react";

type UserData = {
  name: string;
  familyName: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
};

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const cookieData = getCookie("userData");
      if (cookieData) {
        const parsedData: UserData = JSON.parse(decodeURIComponent(cookieData));
        setUserData(parsedData);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const accessToken = getCookie("accessToken");
      
      const response = await fetch("http://https://stockflowbackend-2j27.onrender.com/woocommerce/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error("Sync failed");
      
      setTimeout(() => setIsSyncing(false), 1000);
    } catch (error) {
      console.error("Sync error:", error);
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("userData");
    router.push("/login");
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold">ADMIN</span>;
      case 'manager':
        return <span className="bg-blue-400 text-white px-2 py-0.5 rounded-full text-xs font-bold">MANAGER</span>;
      default:
        return <span className="bg-gray-400 text-white px-2 py-0.5 rounded-full text-xs font-bold">USER</span>;
    }
  };

  const navItems = [
    { 
      href: "/dashboard", 
      icon: LayoutDashboard, 
      label: "Dashboard",
      roles: ['admin', 'manager', 'user']
    },
    { 
      href: "/dashboard/products", 
      icon: Package, 
      label: "Products",
      roles: ['admin', 'manager', 'user']
    },
    { 
      href: "/dashboard/orders", 
      icon: ShoppingCart, 
      label: "Orders",
      roles: ['admin', 'manager', 'user']
    },
    { 
      href: "/dashboard/statistics", 
      icon: BarChart4, 
      label: "Analytics",
      roles: ['admin', 'manager']
    },
    { 
      href: "/dashboard/users", 
      icon: Users, 
      label: "Users",
      roles: ['admin']
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    userData?.role ? item.roles.includes(userData.role) : false
  );

  return (
    <>
      {/* Header */}
      <header className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300",
        isScrolled ? "bg-black/95 backdrop-blur-md shadow-xl" : "bg-black",
        "border-b border-yellow-400/30"
      )}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Hamburger and Logo */}
            <div className="flex items-center">
              {/* Mobile Hamburger Button */}
              <button
                className="md:hidden mr-4 text-yellow-400 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center transition-transform hover:scale-105">
                <Image
                  src={logo}
                  alt="StockFlow Logo"
                  width={150}
                  height={80}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Search Bar - Center */}
            <div className="md:flex flex-1 justify-center gap-4 px-4 max-w-2xl">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-8 w-8 text-yellow-400" />
                </div>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, orders, SKUs..."
                  className={cn(
                    "pl-10 mx-15 w-full",
                    "bg-black/50 backdrop-blur-sm",
                    "border-2 border-yellow-400 hover:border-yellow-400/30 focus:border-yellow-400",
                    "text-white placeholder-yellow-400/70",
                    "rounded-xl py-5",
                    "transition-all duration-300 ease-out",
                    "focus:ring-2 focus:ring-yellow-400/30 focus:shadow-lg focus:shadow-yellow-400/20"
                  )}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-5 w-5 text-yellow-400/70 hover:text-yellow-300 transition-colors" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {/* Sync Button - Only show for admin/manager */}
              {(userData?.role === 'admin' || userData?.role === 'manager') && (
                <>
                  <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className={cn(
                      "bg-yellow-400 hover:bg-yellow-300 text-black",
                      "hidden sm:flex items-center gap-2",
                      isSyncing ? "opacity-90" : "",
                      "hover:shadow-lg hover:shadow-yellow-400/20"
                    )}
                    size="sm"
                  >
                    <RefreshCw className={cn(
                      "h-4 w-4",
                      isSyncing ? "animate-spin" : ""
                    )} />
                    <span className="font-medium">Sync Now</span>
                  </Button>

                  <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="sm:hidden"
                    size="icon"
                    variant="ghost"
                  >
                    <RefreshCw className={cn(
                      "h-5 w-5 text-yellow-400",
                      isSyncing ? "animate-spin" : ""
                    )} />
                  </Button>
                </>
              )}

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-400 hover:bg-gray-800/50 hover:text-yellow-300"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
              </Button>

              {/* User Profile */}
              {userData && (
                <div className="ml-2 relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={cn(
                      "flex items-center gap-1 rounded-full",
                      "hover:bg-gray-800/50",
                      showProfileMenu ? "bg-gray-800/70" : ""
                    )}
                  >
                    <Avatar className="h-9 w-9 border-2 border-yellow-400/40 hover:border-yellow-400/60">
                      <AvatarFallback className="bg-yellow-400 text-black font-bold">
                        {`${userData.name?.[0] || ''}${userData.familyName?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-yellow-400 mr-1",
                      showProfileMenu ? "rotate-180" : ""
                    )} />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-900 border border-gray-800 rounded-lg shadow-xl divide-y divide-gray-800/50">
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {userData.name} {userData.familyName}
                          </p>
                          {getRoleBadge(userData.role)}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{userData.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => router.push("/settings")}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50"
                        >
                          Settings
                        </button>
                        {userData.role === 'admin' && (
                          <button
                            onClick={() => router.push("/dashboard/users")}
                            className="block w-full px-4 py-2 text-left text-sm text-yellow-400 hover:bg-gray-800/50"
                          >
                            Admin Panel
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800/50"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-full w-64 z-40 bg-black border-r border-yellow-400/20 shadow-xl"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-yellow-400/20">
              <Image
                src={logo}
                alt="StockFlow Logo"
                width={140}
                height={60}
                className="h-8 w-auto"
              />
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-yellow-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-4">
                {filteredNavItems.map((item) => {
                  const isActive = pathname === item.href || 
                                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
                        "group relative overflow-hidden",
                        isActive 
                          ? "bg-yellow-400/10 text-yellow-400 border-l-4 border-yellow-400"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mr-3",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="px-4 py-6 border-t border-yellow-400/20">
              <Link
                href="/dashboard/profil"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg",
                  "text-gray-300 hover:bg-gray-800/50 hover:text-white",
                  pathname === "/dashboard/profil" ? "bg-yellow-400/10 text-yellow-400" : ""
                )}
              >
                <UserPen className="h-5 w-5 mr-3" />
                <span className="font-medium">Profil</span>
              </Link>

              <Button
                onClick={handleLogout}
                className="w-full justify-start mt-2 text-gray-300 hover:cursor-pointer bg-black hover:bg-red-500/80 hover:text-white"
              >
                <LogOutIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (always visible) */}
      <aside className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] z-30",
        "hidden md:block w-64 bg-black border-r border-yellow-400/20",
        "transition-all duration-300"
      )}>
        <div className="flex-1 my-5 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== "/dashboard" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg",
                    "group relative overflow-hidden",
                    isActive 
                      ? "bg-yellow-400/10 text-yellow-400 border-l-4 border-yellow-400"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mr-3",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="fixed bottom-0 left-10 px-4 py-6 border-t border-yellow-400/20">
          <Link
            href="/dashboard/profil"
            className={cn(
              "flex items-center px-4 py-3 rounded-lg",
              "text-gray-300 hover:bg-gray-800/50 hover:text-white",
              pathname === "/dashboard/profil" ? "bg-yellow-400/10 text-yellow-400" : ""
            )}
          >
            <UserPen className="h-5 w-5 mr-3" />
            <span className="font-medium">Profil</span>
          </Link>

          <Button
            
            onClick={handleLogout}
            className="w-full justify-start mt-2 hover:cursor-pointer bg-black hover:bg-red-500/80 text-gray-300 hover:text-white"
          >
            <LogOutIcon className="h-5 w-5 mr-3" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}