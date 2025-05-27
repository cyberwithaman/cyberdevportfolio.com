"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faProjectDiagram,
  faServer,
  faAddressBook,
  faBars,
  faTimes,
  faSignOutAlt,
  faEnvelope,
  faBlog
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu on larger screens
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
      // Prevent sidebar collapse on mobile
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    // Redirect to login page
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: faHome, path: '/admin' },
    { name: 'Projects', icon: faProjectDiagram, path: '/admin/projects' },
    { name: 'Projects Requests', icon: faServer, path: '/admin/projects-requests' },
    { name: 'Services Requests', icon: faServer, path: '/admin/services-requests' },
    { name: 'Contact Requests', icon: faAddressBook, path: '/admin/contacts-requests' },
    { name: 'News Letter', icon: faEnvelope, path: '/admin/news-letters' },
    { name: 'Blog', icon: faBlog, path: '/admin/blog' },
  ];

  return (
    <>
      {/* Mobile sidebar toggle - improved tap target */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 touch-manipulation"
        aria-label="Toggle mobile menu"
        aria-expanded={mobileOpen}
      >
        <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          ${collapsed ? 'lg:w-20' : 'lg:w-64'} 
          bg-gray-900 text-white flex flex-col
          h-[100dvh] lg:h-screen
          overflow-hidden
        `}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          {!collapsed && (
            <div className="text-xl font-bold truncate">Admin Panel</div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FontAwesomeIcon icon={collapsed ? faBars : faTimes} className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation with improved touch targets */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto overscroll-contain">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                href={item.path}
                key={item.name}
                className={`
                  flex items-center px-4 py-3 rounded-md transition-colors
                  touch-manipulation min-h-[48px]
                  ${isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white active:bg-gray-600'
                  }
                `}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout with improved touch target */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center p-3 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white transition-colors touch-manipulation min-h-[48px] w-full"
              title="Logout"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile with improved touch handling */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 touch-none"
          onClick={() => setMobileOpen(false)}
          aria-label="Close mobile menu"
          role="button"
          tabIndex={-1}
        />
      )}
    </>
  );
};

export default AdminSidebar;