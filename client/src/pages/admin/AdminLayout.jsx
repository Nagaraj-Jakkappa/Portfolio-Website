/**
 * AdminLayout.jsx
 * Path: client/src/pages/admin/AdminLayout.jsx
 *
 * Full-screen SaaS shell: collapsible sidebar + sticky topbar.
 * UPDATED:
 * ✅ Real MERN notification system
 * ✅ Real-time polling
 * ✅ Notification type colors
 * ✅ SaaS-style notification dropdown
 * ✅ Auto unread badge refresh
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
    certs: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    analytics: 'M18 20V10 M12 20V4 M6 20v-6',
    settings:
        'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
    logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
    menu: 'M3 12h18 M3 6h18 M3 18h18',
    bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
};

const NAV_MAIN = [
    { label: 'Dashboard', path: '/admin', icon: 'dashboard', end: true },
    { label: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
    { label: 'Projects', path: '/admin/projects', icon: 'projects' },
    { label: 'Messages', path: '/admin/messages', icon: 'messages' },
];

const NAV_SYSTEM = [
    { label: 'Certificates', path: '/admin/certificates', icon: 'certs' },
    { label: 'Settings', path: '/admin/settings', icon: 'settings' },
];

const PAGE_NAMES = {
    '/admin': 'Dashboard',
    '/admin/analytics': 'Analytics',
    '/admin/projects': 'Projects',
    '/admin/messages': 'Messages',
    '/admin/certificates': 'Certificates',
    '/admin/settings': 'Settings',
};

export default function AdminLayout() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [expanded, setExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    /**
     * ==========================================
     * ✅ UPDATED: REAL NOTIFICATION STATES
     * ==========================================
     */

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const notificationRef = useRef(null);

    /**
     * ==========================================
     * ✅ UPDATED: TYPE COLORS
     * ==========================================
     */

    const TYPE_STYLES = {
        system: {
            dot: 'bg-blue-400',
            badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
        },
        warning: {
            dot: 'bg-yellow-400',
            badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
        },
        error: {
            dot: 'bg-red-400',
            badge: 'bg-red-500/10 text-red-300 border-red-500/20'
        },
        success: {
            dot: 'bg-green-400',
            badge: 'bg-green-500/10 text-green-300 border-green-500/20'
        },
        message: {
            dot: 'bg-cyan-400',
            badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
        },
    };

    /**
     * ==========================================
     * ✅ UPDATED: FETCH NOTIFICATIONS
     * ==========================================
     */

    const fetchNotificationsData = async () => {
        try {
            const [listRes, countRes] = await Promise.all([
                axios.get('/notifications'),
                axios.get('/notifications/unread-count')
            ]);

            setNotifications(listRes.data.slice(0, 10));
            setUnreadCount(countRes.data.count);

        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    /**
     * ==========================================
     * ✅ UPDATED: REAL-TIME POLLING
     * ==========================================
     */

    useEffect(() => {
        fetchNotificationsData();

        const interval = setInterval(() => {
            fetchNotificationsData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    /**
     * ==========================================
     * ✅ UPDATED: MARK ALL READ
     * ==========================================
     */

    const markAllAsRead = async () => {
        try {
            await axios.put('/notifications/mark-all-read');

            setNotifications(prev =>
                prev.map(n => ({
                    ...n,
                    read: true
                }))
            );

            setUnreadCount(0);

        } catch (error) {
            console.error('Error marking notifications read', error);
        }
    };

    /**
     * Sidebar responsive
     */

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');

        if (mq.matches) setExpanded(false);

        const h = e => {
            if (e.matches) setExpanded(false);
        };

        mq.addEventListener('change', h);

        return () => mq.removeEventListener('change', h);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    /**
     * Close notification dropdown outside click
     */

    useEffect(() => {
        const handleClickOutside = e => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#060d1a] text-slate-200 overflow-hidden">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`hidden md:flex flex-col bg-[#0a1628] border-r border-[#1e2d3d] transition-all duration-300 ${expanded ? 'w-56' : 'w-14'}`}>
                <div className="flex flex-col h-full">

                    <div className={`h-16 flex items-center border-b border-[#1e2d3d] ${expanded ? 'px-5' : 'justify-center'}`}>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">NJ</span>
                        </div>

                        {expanded && (
                            <div className="ml-2.5">
                                <div className="text-sm font-semibold text-white">
                                    Techartistry
                                </div>
                                <div className="text-[10px] text-slate-600">
                                    Portfolio OS
                                </div>
                            </div>
                        )}
                    </div>

                    <nav className="flex-1 py-4 px-2">
                        {NAV_MAIN.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1 transition
                                    ${isActive
                                        ? 'bg-[#38bdf8]/10 text-[#38bdf8]'
                                        : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'
                                    }`
                                }
                            >
                                <Ic d={ICONS[item.icon]} size={15} />
                                {expanded && item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-16 border-b border-[#1e2d3d] bg-[#0a1628]/80 backdrop-blur-sm flex items-center gap-4 px-6">

                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="p-1.5 text-slate-500 hover:text-white"
                    >
                        <Ic d={ICONS.menu} size={17} />
                    </button>

                    <div className="text-sm">
                        <span className="text-slate-700">Admin</span>
                        <span className="mx-2 text-slate-800">/</span>
                        <span className="text-slate-300 font-medium">
                            {PAGE_NAMES[pathname] ?? 'Dashboard'}
                        </span>
                    </div>

                    <div className="flex-1" />

                    {/* ==========================================
                        ✅ UPDATED: NOTIFICATION DROPDOWN
                    ========================================== */}

                    <div className="relative" ref={notificationRef}>

                        <button
                            onClick={() => setShowNotifications(v => !v)}
                            className="relative p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition"
                        >
                            <Ic d={ICONS.bell} size={16} />

                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#38bdf8] text-[10px] font-bold text-white ring-2 ring-[#0a1628]">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-96 bg-[#0a1628] border border-[#1e2d3d] rounded-2xl shadow-2xl overflow-hidden z-50">

                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2d3d]">
                                    <h3 className="text-sm font-semibold text-white">
                                        Notifications
                                    </h3>

                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-[#38bdf8] hover:text-sky-300 font-medium"
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

                                        /**
                                         * ==========================================
                                         * ✅ UPDATED: COLORFUL NOTIFICATION TYPES
                                         * ==========================================
                                         */

                                        notifications.map(n => {

                                            const style =
                                                TYPE_STYLES[n.type] ||
                                                TYPE_STYLES.system;

                                            return (
                                                <div
                                                    key={n._id}
                                                    className={`
                                                        px-4 py-3 border-b border-[#1e2d3d]
                                                        hover:bg-white/[0.03]
                                                        transition cursor-pointer
                                                        ${!n.read ? 'bg-[#38bdf8]/5' : ''}
                                                    `}
                                                >

                                                    <div className="flex items-start gap-3">

                                                        {/* Colored Dot */}
                                                        <div
                                                            className={`
                                                                mt-1.5 w-2 h-2 rounded-full
                                                                flex-shrink-0
                                                                ${style.dot}
                                                            `}
                                                        />

                                                        <div className="min-w-0 flex-1">

                                                            {/* Top Row */}
                                                            <div className="flex items-center justify-between gap-2">

                                                                <p className={`
                                                                    text-sm truncate
                                                                    ${!n.read
                                                                        ? 'text-white font-semibold'
                                                                        : 'text-slate-400 font-medium'}
                                                                `}>
                                                                    {n.title}
                                                                </p>

                                                                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                                </span>

                                                            </div>

                                                            {/* Message */}
                                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                                {n.message}
                                                            </p>

                                                            {/* Type Badge */}
                                                            <div className="mt-2">

                                                                <span className={`
                                                                    inline-flex items-center
                                                                    px-2 py-1 rounded-md
                                                                    text-[10px]
                                                                    uppercase tracking-wide
                                                                    font-semibold border
                                                                    ${style.badge}
                                                                `}>
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
                                <div className="p-3 border-t border-[#1e2d3d]">
                                    <button
                                        onClick={() => {
                                            setShowNotifications(false);
                                            navigate('/admin/notifications');
                                        }}
                                        className="w-full text-xs bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] py-2 rounded-lg transition font-bold"
                                    >
                                        View Full Logs
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* View Site */}
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#38bdf8] border border-[#1e2d3d] hover:border-[#38bdf8]/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                        <Ic d={ICONS.eye} size={12} />
                        View Site
                    </a>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}