import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, Star, MessageSquare, HelpCircle, Image, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/hero', label: 'Hero Slides', icon: Image },
  { to: '/admin/founders', label: 'Founders', icon: Users },
  { to: '/admin/content', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { logout, state: authState } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col bg-slate-900 text-slate-300">
        <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950">
          <h1 className="text-xl font-black text-white">Wealthora Admin</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="flex flex-col gap-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Account / Logout */}
        <div className="border-t border-slate-800 p-4">
          <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Account
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                {(authState.user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-white">{authState.user?.name || 'Admin'}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500 hover:text-white"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Dynamic header / Topbar could go here if needed */}
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {/* The nested routes (Dashboard, EnquiryManager, etc.) render here */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
