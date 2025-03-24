'use client';

import { useState, useEffect } from 'react';
import { Link, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import Image from 'next/image';
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon as CogIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Team', href: '/dashboard/team', icon: UserGroupIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    // Check if we have a stored preference
    const darkMode = localStorage.getItem('darkMode');
    
    // If we have a stored preference, use it
    if (darkMode !== null) {
      setIsDarkMode(darkMode === 'true');
      if (darkMode === 'true') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    // If no stored preference, check system preference
    else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newDarkMode = !prev;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(newDarkMode));
      return newDarkMode;
    });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-gray-400/20 dark:bg-gray-900/40" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-0 flex">
          <div className="relative flex w-72 flex-1">
            <Sidebar isCollapsed={false} onToggle={() => {}} isDarkMode={isDarkMode} onDarkModeToggle={toggleDarkMode} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} isDarkMode={isDarkMode} onDarkModeToggle={toggleDarkMode} />
      </div>

      {/* Main content */}
      <div className={`${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ 
  isCollapsed, 
  onToggle, 
  isDarkMode, 
  onDarkModeToggle 
}: { 
  isCollapsed: boolean; 
  onToggle: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}) {
  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  const profilePicture = '/images/profiles/Sajana yasas me.png';

  return (
    <div className="flex h-full grow flex-col overflow-y-auto bg-white dark:bg-gray-900 shadow-[4px_0_10px_0_rgba(0,0,0,0.03)] dark:shadow-[4px_0_10px_0_rgba(0,0,0,0.2)] px-6">
      {/* Profile Section at Top */}
      <div className="flex h-24 shrink-0 items-center border-b border-gray-100/80 dark:border-gray-800">
        <Dropdown 
          placement="bottom-start"
          classNames={{
            base: "before:bg-white dark:before:bg-gray-900",
            content: "py-2 px-1 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl rounded-2xl min-w-[200px]",
          }}
        >
          <DropdownTrigger>
            <div className={`flex items-center gap-x-3 cursor-pointer rounded-2xl p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}>
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={profilePicture}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-3 border-white dark:border-gray-800 shadow-lg"
                  sizes="48px"
                  priority
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Sajana Yasas</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Admin</p>
                </div>
              )}
            </div>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Profile actions"
            variant="flat"
            className="p-2"
          >
            <DropdownItem
              key="profile_header"
              className="h-14 gap-2 opacity-100"
              textValue="Profile Header"
            >
              <div className="flex items-center gap-x-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={profilePicture}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                    sizes="40px"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Sajana Yasas</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">sajana@example.com</span>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem key="separator" className="h-px bg-gray-100 dark:bg-gray-800" />
            <DropdownItem
              key="settings"
              startContent={<CogIcon className="h-5 w-5" />}
              className="py-3 px-4 text-gray-600 dark:text-gray-400 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-900 dark:data-[hover=true]:text-gray-100 rounded-xl"
            >
              Settings
            </DropdownItem>
            <DropdownItem 
              key="logout" 
              className="py-3 px-4 text-gray-600 dark:text-gray-400 data-[hover=true]:text-red-600 data-[hover=true]:bg-red-50 dark:data-[hover=true]:text-red-400 dark:data-[hover=true]:bg-red-900/20 rounded-xl" 
              startContent={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
              onClick={handleLogout}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 flex flex-col">
        <ul role="list" className="flex flex-col gap-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`group flex gap-x-3 rounded-xl p-2 text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 active:bg-gray-200 dark:active:bg-gray-700 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <item.icon
                  className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500 transition-colors group-hover:text-gray-900 dark:group-hover:text-gray-100"
                  aria-hidden="true"
                />
                {!isCollapsed && item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-gray-100/80 dark:border-gray-800 pt-4 pb-4 space-y-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={onDarkModeToggle}
          className={`flex items-center gap-x-3 rounded-xl p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 active:bg-gray-200 dark:active:bg-gray-700 w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isDarkMode ? (
            <>
              <SunIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              {!isCollapsed && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Light Mode</span>}
            </>
          ) : (
            <>
              <MoonIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              {!isCollapsed && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dark Mode</span>}
            </>
          )}
        </button>

        {/* Collapse Button */}
        <button
          onClick={onToggle}
          className={`flex items-center gap-x-3 rounded-xl p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 active:bg-gray-200 dark:active:bg-gray-700 w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isCollapsed ? (
            <ArrowRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <>
              <ArrowLeftIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
} 