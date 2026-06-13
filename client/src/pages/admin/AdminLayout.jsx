/**
 * AdminLayout.jsx
 * Path: client/src/pages/admin/AdminLayout.jsx
 *
 * Exact video-replicated collapsible sidebar behavior.
 * Floating edge toggle, fixed 68px mobile rail, and premium transitions.
 * Includes interactive Admin Avatar upload/delete functionality.
 */

import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';

const Ic = ({ d, size = 18 }) => (
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
  certs: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  analytics: 'M18 20V10 M12 20V4 M6 20v-6',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  content: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  skills: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  experience: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  close: 'M18 6L6 18 M6 6l12 12',
};

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/admin', icon: 'dashboard', end: true },
      { label: 'Visitor Insights', path: '/admin/analytics', icon: 'analytics' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Content', path: '/admin/content', icon: 'content' },
      { label: 'Skills', path: '/admin/skills', icon: 'skills' },
      { label: 'Projects', path: '/admin/projects', icon: 'projects' },
      { label: 'Certificates', path: '/admin/certificates', icon: 'certs' },
      { label: 'Experiences', path: '/admin/experiences', icon: 'experience' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Messages', path: '/admin/messages', icon: 'messages' },
      { label: 'Notifications', path: '/admin/notifications', icon: 'bell' },
      { label: 'Settings', path: '/admin/settings', icon: 'settings' },
    ],
  },
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

/* ── SidebarNavItem ───────────────────────────────────────────── */
function SidebarNavItem({ item, isExpanded, hasNewVisitorEvents, unreadCount, onClick, setHoveredTooltip }) {
  const showDot =
    (item.path === '/admin/analytics' && hasNewVisitorEvents) ||
    (item.path === '/admin/notifications' && unreadCount > 0);

  const itemRef = useRef(null);

  return (
    <NavLink
      ref={itemRef}
      to={item.path}
      end={item.end}
      aria-label={item.label}
      onClick={onClick}
      onMouseEnter={() => {
        if (!isExpanded && itemRef.current) {
          const rect = itemRef.current.getBoundingClientRect();
          setHoveredTooltip({ label: item.label, top: rect.top + rect.height / 2, unreadCount });
        }
      }}
      onMouseLeave={() => setHoveredTooltip(null)}
      className={({ isActive }) =>
        `group relative flex items-center rounded-lg transition-all duration-200 cursor-pointer h-10 mb-1 outline-none overflow-hidden ${
          isActive
            ? 'bg-blue-500/10 text-blue-400 font-medium'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        } ${isExpanded ? 'px-3' : 'justify-center'}`
      }
    >
      <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'mr-3' : ''}`}>
        <Ic d={ICONS[item.icon]} size={18} />
      </div>

      <div
        className={`whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex-1 flex items-center ${
          isExpanded ? 'opacity-100 max-w-[200px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-2'
        }`}
      >
        <span className="text-[13px] tracking-wide truncate">{item.label}</span>
      </div>

      {showDot && (
        <span
          className={`absolute rounded-full bg-blue-400 transition-all duration-300 ${
            isExpanded
              ? 'right-3 w-1.5 h-1.5'
              : 'top-2 right-2 w-2 h-2 ring-2 ring-navy-900'
          }`}
        />
      )}
    </NavLink>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AdminLayout
   ═══════════════════════════════════════════════════════════════ */
export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 1024);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewVisitorEvents, setHasNewVisitorEvents] = useState(false);

  const notificationRef = useRef(null);
  
  // Profile Photo State & Refs
  const fileInputRef = useRef(null);
  const defaultAvatarPath = '/apple-touch-icon.png';
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('techartistry_admin_avatar') || '/profile.jpg';
  });

  const TYPE_STYLES = {
    system: { dot: 'bg-blue-400', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
    warning: { dot: 'bg-yellow-400', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
    error: { dot: 'bg-red-400', badge: 'bg-red-500/10 text-red-300 border-red-500/20' },
    success: { dot: 'bg-green-400', badge: 'bg-green-500/10 text-green-300 border-green-500/20' },
    message: { dot: 'bg-cyan-400', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
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
    const interval = setInterval(fetchNotificationsData, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) setIsExpanded(false);
    
    const handleResize = () => {
      if (window.innerWidth < 768) setIsExpanded(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Avatar Management Handlers
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local Preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    localStorage.setItem('techartistry_admin_avatar', previewUrl);

    // TODO: Send to backend
    // const formData = new FormData();
    // formData.append('avatar', file);
    // try {
    //   await axios.post('/admin/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
    // } catch (err) {
    //   console.error('Upload failed', err);
    // }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setAvatarUrl(defaultAvatarPath);
    localStorage.setItem('techartistry_admin_avatar', defaultAvatarPath);

    // TODO: Tell backend to remove avatar
    // axios.delete('/admin/avatar').catch(console.error);
  };

  const transitionClass = "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]";

  return (
    <div className="flex h-screen bg-navy-950 text-slate-200 overflow-hidden selection:bg-blue-500/30 font-sans">
      
      {/* ── MOBILE BACKDROP ────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40 md:hidden cursor-pointer transition-opacity duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsExpanded(false)}
        aria-hidden="true"
      />

      {/* ── UNIFIED SIDEBAR ────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col shrink-0
          bg-navy-900 border-r border-navy-800
          ${transitionClass}
          ${isExpanded ? 'w-[260px] shadow-2xl md:shadow-none' : 'w-[68px]'}
        `}
      >
        {/* Floating Edge Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute z-50 flex items-center justify-center w-6 h-6 rounded-full border border-navy-700 bg-navy-900 text-slate-400 hover:text-white hover:bg-navy-800 shadow-sm transition-all duration-300 ${
            isExpanded ? 'top-5 right-3' : 'top-6 -right-3'
          }`}
          aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
        >
          <Ic d={isExpanded ? ICONS.chevronLeft : ICONS.chevronRight} size={14} />
        </button>

        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Top Brand Area */}
          <div className={`relative flex shrink-0 overflow-visible ${transitionClass} ${isExpanded ? 'flex-row items-center h-16 px-4' : 'flex-col items-center pt-5 pb-4'}`}>
            <div className="flex items-center gap-3 overflow-hidden w-full">
              <div className="w-8 h-8 rounded-lg bg-navy-950 border border-navy-700 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/apple-touch-icon.png"
                  alt="Logo"
                  className="w-5 h-5 object-contain"
                  onError={(e) => { e.target.src = '/favicon-32x32.png'; }}
                />
              </div>
              <div className={`flex flex-col whitespace-nowrap ${transitionClass} ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 hidden'}`}>
                <span className="text-[14px] font-semibold text-slate-100 leading-tight tracking-wide">Techartistry</span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Portfolio OS</span>
              </div>
            </div>
          </div>

          {/* Navigation Area */}
          <nav 
            className="flex-1 py-4 px-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] space-y-5"
            onScroll={() => setHoveredTooltip(null)}
          >
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={group.label} className="relative">
                <div
                  className={`px-2 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden ${
                    isExpanded ? 'opacity-100 max-h-10 mb-2' : 'opacity-0 max-h-0 mb-0'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {group.label}
                  </span>
                </div>
                {!isExpanded && groupIdx !== 0 && (
                  <div className="flex justify-center mb-4 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-navy-800" />
                  </div>
                )}
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <SidebarNavItem
                      key={item.path}
                      item={item}
                      isExpanded={isExpanded}
                      hasNewVisitorEvents={hasNewVisitorEvents}
                      unreadCount={unreadCount}
                      setHoveredTooltip={setHoveredTooltip}
                      onClick={() => {
                        if (window.innerWidth < 768) setIsExpanded(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Profile Area */}
          <div className={`p-2 border-t border-navy-800 shrink-0 ${transitionClass}`}>
            
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center rounded-lg transition-all duration-200 cursor-pointer h-10 mb-1 outline-none text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] overflow-hidden ${isExpanded ? 'px-3' : 'justify-center'}`}
              onMouseEnter={(e) => {
                if (!isExpanded) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredTooltip({ label: 'View Site', top: rect.top + rect.height / 2 });
                }
              }}
              onMouseLeave={() => setHoveredTooltip(null)}
            >
              <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'mr-3' : ''}`}>
                <Ic d={ICONS.eye} size={18} />
              </div>
              <div className={`whitespace-nowrap ${transitionClass} flex-1 flex items-center ${isExpanded ? 'opacity-100 max-w-[200px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-2'}`}>
                <span className="text-[13px] tracking-wide truncate">View Site</span>
              </div>
            </a>

            <button
              onClick={handleLogout}
              className={`group relative w-full flex items-center rounded-lg transition-all duration-200 cursor-pointer h-10 outline-none text-slate-400 hover:text-red-400 hover:bg-red-500/10 overflow-hidden ${isExpanded ? 'px-3' : 'justify-center'}`}
              onMouseEnter={(e) => {
                if (!isExpanded) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredTooltip({ label: 'Logout', top: rect.top + rect.height / 2 });
                }
              }}
              onMouseLeave={() => setHoveredTooltip(null)}
            >
              <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'mr-3' : ''}`}>
                <Ic d={ICONS.logout} size={18} />
              </div>
              <div className={`whitespace-nowrap ${transitionClass} flex-1 flex items-center justify-start ${isExpanded ? 'opacity-100 max-w-[200px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-2'}`}>
                <span className="text-[13px] tracking-wide truncate">Logout</span>
              </div>
            </button>

            {/* Profile Avatar & Details */}
            <div className={`flex items-center rounded-lg h-12 mt-2 pt-2 border-t border-navy-800 ${isExpanded ? 'px-2' : 'justify-center'}`}>
              
              <div className={`relative group shrink-0 ${isExpanded ? 'mr-3' : ''}`}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-full border border-navy-700 bg-navy-950 flex items-center justify-center overflow-hidden shadow-sm cursor-pointer relative"
                >
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = defaultAvatarPath; }}
                  />
                  {/* Hover Edit Overlay */}
                  <div className="absolute inset-0 bg-navy-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white">
                      <Ic d={ICONS.camera} size={14} />
                    </span>
                  </div>
                </div>

                {/* Delete Badge */}
                {avatarUrl !== defaultAvatarPath && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1 -right-1 w-[14px] h-[14px] bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-400"
                    title="Remove Photo"
                  >
                    <Ic d={ICONS.close} size={8} />
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <div className={`whitespace-nowrap ${transitionClass} flex flex-col justify-center flex-1 ${isExpanded ? 'opacity-100 max-w-[200px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-2'}`}>
                <div className="text-[13px] font-medium text-slate-200 truncate leading-none mb-1.5">Nagaraj J.</div>
                <div className="text-[10px] text-slate-500 truncate leading-none">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── GLOBAL SIDEBAR TOOLTIP ── */}
      {!isExpanded && hoveredTooltip && (
        <div
          className="hidden md:flex pointer-events-none fixed z-[9999] items-center whitespace-nowrap rounded-md border border-navy-700 bg-navy-800 px-3 py-1.5 text-[12px] font-medium text-white shadow-xl animate-in fade-in zoom-in-95 duration-150"
          style={{ top: hoveredTooltip.top, left: 80, transform: 'translateY(-50%)' }}
        >
          {hoveredTooltip.label}
          {hoveredTooltip.label === 'Notifications' && hoveredTooltip.unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-blue-500 text-white shadow-sm shadow-blue-500/30 text-[10px] font-bold">
              {hoveredTooltip.unreadCount}
            </span>
          )}
        </div>
      )}

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <div 
        className={`
          flex-1 flex flex-col h-screen overflow-hidden
          ${transitionClass}
          ml-[68px] ${isExpanded ? 'md:ml-[260px]' : ''}
        `}
      >
        <header className="relative z-40 h-16 border-b border-navy-800 bg-navy-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            <div className="text-[13px] flex items-center text-slate-500">
              <span className="hidden sm:inline">Admin</span>
              <span className="hidden sm:inline mx-2 text-slate-700">/</span>
              <span className="text-slate-200 font-medium">
                {PAGE_NAMES[pathname] ?? 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Toggle notifications"
            >
              <Ic d={ICONS.bell} size={20} />
              {(unreadCount > 0 || hasNewVisitorEvents) && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-500 shadow-md shadow-blue-500/30 text-[10px] font-bold text-white ring-2 ring-navy-900">
                  {unreadCount > 0 ? unreadCount : '!'}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-[52px] right-0 w-[360px] max-h-[520px] z-[9999] rounded-xl border border-navy-700 bg-navy-800/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700 bg-navy-900">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-navy-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500 italic">
                      No new activity
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const style = TYPE_STYLES[n.type] || TYPE_STYLES.system;
                      return (
                        <div
                          key={n._id}
                          className={`px-4 py-3 border-b border-navy-700/50 hover:bg-white/[0.03] transition-colors cursor-pointer ${
                            !n.read ? 'bg-blue-500/[0.04]' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${style.dot}`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-[13px] truncate ${!n.read ? 'text-slate-100 font-semibold' : 'text-slate-300 font-medium'}`}>
                                  {n.title}
                                </p>
                                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold border ${style.badge}`}>
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

                <div className="p-2 border-t border-navy-700 bg-navy-900">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(false);
                      navigate('/admin/notifications');
                    }}
                    className="w-full text-xs bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 py-2.5 rounded-lg transition-colors font-medium"
                  >
                    View Full Logs
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-navy-950 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
