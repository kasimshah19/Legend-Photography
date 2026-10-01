"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Images, 
  MessageSquare, 
  Film, 
  Briefcase, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  Users,
  Menu,
  X,
  LogOut,
  Activity,
  BarChart3
} from 'lucide-react';
import { NotificationsMenu } from './NotificationsMenu';
import { RealtimeStatus } from './RealtimeStatus';

type AdminShellProps = {
  children: React.ReactNode;
  user: {
    email: string;
    role: string;
  };
  logoutAction: () => void;
};

const allNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Images, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Films', href: '/admin/films', icon: Film, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { name: 'Services', href: '/admin/services', icon: Briefcase, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Media', href: '/admin/media', icon: ImageIcon, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Content', href: '/admin/content', icon: FileText, roles: ['SUPER_ADMIN', 'EDITOR'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Admin Users', href: '/admin/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Audit Logs', href: '/admin/logs', icon: Activity, roles: ['SUPER_ADMIN'] },
];

export function AdminShell({ children, user, logoutAction }: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = allNavigation.filter(
    item => !item.roles || item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-64 flex flex-col
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h1 className={`font-serif font-semibold text-lg text-gray-900 ${isCollapsed ? 'md:hidden' : ''}`}>
            Legend Photography Admin
          </h1>
          {isCollapsed && <span className="hidden md:block font-serif font-semibold text-xl mx-auto">L</span>}
          <button 
            className="md:hidden p-1 text-gray-500 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors group
                  ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}
                `}
                title={isCollapsed ? item.name : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className={`shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} size={20} />
                <span className={isCollapsed ? 'md:hidden' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className={`flex-1 min-w-0 ${isCollapsed ? 'md:hidden' : ''}`}>
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
          <form action={logoutAction} className="mt-4">
            <button
              type="submit"
              className={`
                flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors
                ${isCollapsed ? 'md:justify-center' : ''}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut size={20} className={isCollapsed ? '' : 'mr-3'} />
              <span className={isCollapsed ? 'md:hidden' : ''}>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button
              className="p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button
              className="hidden md:block p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 hidden sm:block">
              {navItems.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <RealtimeStatus />
            <NotificationsMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
