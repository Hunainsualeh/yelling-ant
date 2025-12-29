import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export type SidebarVariant = 'admin' | 'compact';

const NavItem: React.FC<{ label: string; to?: string; active?: boolean; icon?: React.ReactNode; collapsed?: boolean }> = ({ label, to, active, icon, collapsed }) => (
  <li>
    {to ? (
      <Link
        to={to}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 ${
          active ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="w-5 h-5 text-gray-400">{icon}</span>
        <span className={`transition-opacity duration-150 ${collapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>{label}</span>
      </Link>
    ) : (
      <a
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 ${
          active ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
        }`}
        href="#"
      >
        <span className="w-5 h-5 text-gray-400">{icon}</span>
        <span className={`transition-opacity duration-150 ${collapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>{label}</span>
      </a>
    )}
  </li>
);

const Sidebar: React.FC<{ variant?: SidebarVariant }> = ({ variant = 'admin' }) => {
  const [collapsed, setCollapsed] = useState(false);

  const baseStyle = 'flex flex-col bg-white shadow-md h-screen p-4 transition-all duration-200 relative';
  const compactStyle = 'flex flex-col bg-white h-full p-2 relative';

  const widthStyle = variant === 'admin' ? (collapsed ? '72px' : 'clamp(220px, 18vw, 320px)') : (collapsed ? '72px' : '80px');

  return (
    <aside style={{ width: widthStyle }} className={variant === 'admin' ? baseStyle : compactStyle}>
      <div className="relative">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
           <img src="/sidebar-logo.svg" alt="Yelling Ant" className="w-[221px] h-[37px] object-contain" />
          
        </div>

        <button
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((s) => !s)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute top-3 z-20 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
          style={{ right: -12 }}
        >
          <svg className={`w-3 h-3 text-gray-600 transform transition-transform ${collapsed ? '' : 'rotate-180'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <nav className="mt-2 flex-1 overflow-auto">
        <ul className="space-y-1">
          <NavItem
            label="Dashboard"
            active
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" />
              </svg>
            }
            collapsed={collapsed}
          />

          <NavItem
            label="Quizzes"
            to="/admin/quizzes"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" fill="currentColor" />
              </svg>
            }
            collapsed={collapsed}
          />

          {/* subtle divider between Quizzes and Notifications per design */}
          <li aria-hidden className={`mx-2 ${collapsed ? 'hidden' : ''}`}>
            <div className="border-t border-gray-200 my-2" />
          </li>

          <NavItem
            label="Notifications"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2zM18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
              </svg>
            }
            collapsed={collapsed}
          />

          <NavItem
            label="Settings"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.11-.64l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.54A.5.5 0 0013.5 2h-3a.5.5 0 00-.5.42l-.36 2.54c-.57.22-1.1.5-1.62.94l-2.39-.96a.5.5 0 00-.6.22L2.7 8.88a.5.5 0 00.11.64L4.84 11.1c-.04.31-.06.63-.06.94s.02.63.06.94L2.81 14.56a.5.5 0 00-.11.64l1.92 3.32c.14.24.43.34.68.23l2.39-.96c.5.44 1.05.8 1.62.94l.36 2.54c.05.25.26.42.5.42h3c.24 0 .45-.17.5-.42l.36-2.54c.57-.22 1.1-.5 1.62-.94l2.39.96c.25.11.54.01.68-.23l1.92-3.32a.5.5 0 00-.11-.64l-2.03-1.58z" fill="currentColor" />
              </svg>
            }
            collapsed={collapsed}
          />

          <NavItem
            label="Support"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 18h2v-2h-2v2zm1-16a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a4 4 0 00-4 4h2a2 2 0 114 0c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 00-4-4z" fill="currentColor" />
              </svg>
            }
            collapsed={collapsed}
          />
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            👋
          </div>
          {variant === 'admin' && !collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-Poppins text-[12px] font-medium text-[#696F79] truncate">Welcome back 👋</div>
              <div className="font-Poppins text-[14px] text-black font-medium truncate">Johnathan</div>
            </div>
          )}
          {variant === 'admin' && !collapsed && (
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;