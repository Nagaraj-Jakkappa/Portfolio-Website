/**
 * AdminLayout.jsx
 * Path: client/src/pages/admin/AdminLayout.jsx
 *
 * Compact icon-rail sidebar with tooltips, glowing active state,
 * notification badges, mobile drawer, and header notification panel.
 */

import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';

const Ic = ({ d, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  projects: 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
  messages: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  certs:
    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  analytics: 'M18 20V10 M12 20V4 M6 20v-6',
  settings:
    'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  menu: 'M3 12h18 M3 6h18 M3 18h18',
  close: 'M18 6L6 18 M6 6l12 12',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  content: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  skills: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  experience: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
};

const NAV_MAIN = [
  { label: 'Dashboard', path: '/admin', icon: 'dashboard', end: true },
  { label: 'Visitor Insights', path: '/admin/analytics', icon: 'analytics' },
  { label: 'Content', path: '/admin/content', icon: 'content' },
  { label: 'Skills', path: '/admin/skills', icon: 'skills' },
  { label: 'Projects', path: '/admin/projects', icon: 'projects' },
  { label: 'Certificates', path: '/admin/certificates', icon: 'certs' },
  { label: 'Experiences', path: '/admin/experiences', icon: 'experience' },
  { label: 'Messages', path: '/admin/messages', icon: 'messages' },
  { label: 'Notifications', path: '/admin/notifications', icon: 'bell' },
  { label: 'Settings', path: '/admin/settings', icon: 'settings' },
];

const PAGE_NAMES = {
  '/admin': 'Dashboard',
  '/admin/analytics': 'Visitor Insights',
  '/admin/content': 'Content',
  '/admin/skills': 'Skills',
  '/admin/projects': 'Projects',
  '/admin/messages': 'Messages',
  '/admin/certificates': 'Certificates',
  '/admin/experiences': 'Experiences',
  '/admin/notifications': 'Notifications',
  '/admin/settings': 'Settings',
};

/* ── Sidebar Nav Item (icon-only with tooltip) ─────────────── */
function SidebarItem({ item, hasNewVisitorEvents, unreadCount }) {
  const showDot =
    (item.path === '/admin/analytics' && hasNewVisitorEvents) ||
    (item.path === '/admin/notifications' && unreadCount > 0);

  return (
    <NavLink
      to={item.path}
      end={item.end}
      aria-label={item.label}
      className={({ isActive }) =>
        `group relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 ${
          isActive
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.08)]'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent'
        }`
      }
    >
      <Ic d={ICONS[item.icon]} size={18} />

      {/* Notification dot */}
      {showDot && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950" />
      )}

      {/* Tooltip */}
      <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-medium text-white whitespace-nowrap opacity-0 scale-95 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl">
        {item.label}
        {item.path === '/admin/notifications' && unreadCount > 0 && (
          <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] font-bold">
            {unreadCount}
          </span>
        )}
      </span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewVisitorEvents, setHasNewVisitorEvents] = useState(false);

  const notificationRef = useRef(null);

  const TYPE_STYLES = {
    system: {
      dot: 'bg-blue-400',
      badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    },
    warning: {
      dot: 'bg-yellow-400',
      badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    },
    error: {
      dot: 'bg-red-400',
      badge: 'bg-red-500/10 text-red-300 border-red-500/20',
    },
    success: {
      dot: 'bg-green-400',
      badge: 'bg-green-500/10 text-green-300 border-green-500/20',
    },
    message: {
      dot: 'bg-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    },
  };

  const fetchNotificationsData = async () => {
    try {
      const [listRes, countRes, visitorRes] = await Promise.all([
        axios.get('/notifications').catch(() => ({ data: [] })),
        axios.get('/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
        axios.get('/visitor-events/admin/summary').catch(() => null),
      ]);

      setNotifications(listRes.data.slice(0, 10));
      setUnreadCount(countRes.data.count);

      if (visitorRes?.data?.latestEventCreatedAt) {
        const lastSeen = localStorage.getItem('techartistry_visitor_insights_seen_at');
        if (!lastSeen || new Date(visitorRes.data.latestEventCreatedAt).getTime() > parseInt(lastSeen, 10)) {
          setHasNewVisitorEvents(true);
        } else {
          setHasNewVisitorEvents(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotificationsData();

    const interval = setInterval(() => {
      fetchNotificationsData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/mark-all-read');

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications read', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-navy-950 text-slate-200 overflow-hidden">

      {/* ════════════════════════════════════════════════════════
          MOBILE OVERLAY
         ════════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden cursor-pointer"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ════════════════════════════════════════════════════════
          MOBILE DRAWER (full labels)
         ════════════════════════════════════════════════════════ */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64
          bg-slate-950/95 backdrop-blur-xl
          border-r border-slate-800/80
          z-50
          transform transition-transform duration-300 ease-out
          md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Logo + Close */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-[10px] font-black text-white tracking-tight">TA</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Techartistry</div>
                <div className="text-[10px] text-slate-600 font-mono">Admin Panel</div>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
              aria-label="Close menu"
            >
              <Ic d={ICONS.close} size={16} />
            </button>
          </div>

          {/* Mobile Nav */}
          <nav className="flex-1 py-3 px-2 overflow-y-auto">
            {NAV_MAIN.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 mb-0.5 transition-all duration-200 relative text-sm ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Ic d={ICONS[item.icon]} size={16} />
                {item.label}
                {item.path === '/admin/analytics' && hasNewVisitorEvents && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
                {item.path === '/admin/notifications' && unreadCount > 0 && (
                  <span className="absolute right-3 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Bottom */}
          <div className="p-3 border-t border-slate-800/60 space-y-1.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <Ic d={ICONS.eye} size={16} />
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
            >
              <Ic d={ICONS.logout} size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          DESKTOP ICON RAIL SIDEBAR
         ════════════════════════════════════════════════════════ */}
      <aside
        className="
          hidden md:flex flex-col flex-shrink-0
          w-[72px]
          bg-slate-950/95 backdrop-blur-xl
          border-r border-slate-800/80
        "
      >
        <div className="flex flex-col items-center h-full py-4">
          {/* Logo */}
          <NavLink
            to="/admin"
            aria-label="Techartistry Admin"
            className="group relative mb-6"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform duration-200 group-hover:scale-105">
              <span className="text-[11px] font-black text-white tracking-tight">TA</span>
            </div>
            {/* Logo tooltip */}
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-medium text-white whitespace-nowrap opacity-0 scale-95 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl">
              Techartistry Admin
            </span>
          </NavLink>

          {/* Divider */}
          <div className="w-8 h-px bg-slate-800/80 mb-4" />

          {/* Navigation */}
          <nav className="flex-1 flex flex-col items-center gap-1.5 w-full px-3 overflow-y-auto">
            {NAV_MAIN.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                hasNewVisitorEvents={hasNewVisitorEvents}
                unreadCount={unreadCount}
              />
            ))}
          </nav>

          {/* Divider */}
          <div className="w-8 h-px bg-slate-800/80 mt-4 mb-4" />

          {/* Bottom actions */}
          <div className="flex flex-col items-center gap-1.5 px-3">
            {/* View Site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Site"
              className="group relative flex items-center justify-center w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent transition-all duration-200"
            >
              <Ic d={ICONS.eye} size={18} />
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-medium text-white whitespace-nowrap opacity-0 scale-95 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl">
                View Site
              </span>
            </a>

            {/* Logout */}
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="group relative flex items-center justify-center w-11 h-11 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-200"
            >
              <Ic d={ICONS.logout} size={18} />
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-medium text-white whitespace-nowrap opacity-0 scale-95 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl">
                Logout
              </span>
            </button>

            {/* Admin Avatar */}
            <div className="group relative mt-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700/60 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-300">NJ</span>
              </div>
              <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-medium text-white whitespace-nowrap opacity-0 scale-95 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 z-[100] shadow-xl">
                Admin
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT AREA
         ════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="relative z-40 h-14 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm flex items-center gap-4 px-4 md:px-6">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Ic d={ICONS.menu} size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="text-sm">
            <span className="text-slate-600">Admin</span>
            <span className="mx-2 text-slate-800">/</span>
            <span className="text-slate-200 font-medium">
              {PAGE_NAMES[pathname] ?? 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all"
              aria-label="Toggle notifications"
            >
              <Ic d={ICONS.bell} size={16} />

              {(unreadCount > 0 || hasNewVisitorEvents) && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-cyan-400 text-[9px] font-bold text-slate-950 ring-2 ring-slate-950">
                  {unreadCount > 0 ? unreadCount : '!'}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="
                  absolute top-[52px] right-0
                  w-[360px] max-h-[520px]
                  z-[9999]
                  rounded-2xl
                  border border-slate-700/60
                  bg-slate-950/95 backdrop-blur-xl
                  shadow-2xl shadow-black/40
                  overflow-hidden
                "
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>

                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-600 italic">
                      No new activity
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const style = TYPE_STYLES[n.type] || TYPE_STYLES.system;

                      return (
                        <div
                          key={n._id}
                          className={`
                            px-4 py-3
                            border-b border-slate-800/40
                            hover:bg-white/[0.02]
                            transition
                            cursor-pointer
                            ${!n.read ? 'bg-cyan-500/[0.03]' : ''}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`
                                mt-1.5 w-2 h-2 rounded-full flex-shrink-0
                                ${style.dot}
                              `}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p
                                  className={`
                                    text-sm truncate
                                    ${!n.read ? 'text-white font-semibold' : 'text-slate-400 font-medium'}
                                  `}
                                >
                                  {n.title}
                                </p>

                                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {n.message}
                              </p>

                              <div className="mt-2">
                                <span
                                  className={`
                                    inline-flex items-center
                                    px-2 py-1 rounded-md
                                    text-[10px] uppercase tracking-wide
                                    font-semibold border
                                    ${style.badge}
                                  `}
                                >
                                  {n.type || 'system'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(false);
                      navigate('/admin/notifications');
                    }}
                    className="
                      w-full text-xs
                      bg-cyan-500/10 hover:bg-cyan-500/20
                      text-cyan-400 py-2 rounded-lg
                      transition font-bold
                    "
                  >
                    View Full Logs
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Site (header, hidden on small screens) */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 border border-slate-800/60 hover:border-cyan-400/30 px-3 py-1.5 rounded-lg transition-all"
          >
            <Ic d={ICONS.eye} size={12} />
            View Site
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
