/**
 * AdminLayout.jsx
 * Path: client/src/pages/admin/AdminLayout.jsx
 *
 * Full-screen SaaS shell: collapsible sidebar + sticky topbar.
 * All admin child routes render inside <Outlet />.
 */

import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Ic = ({ d, size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
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
    menu: 'M3 12h18 M3 6h18 M3 18h18',
    bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
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
    const [expanded, setExpanded] = useState(true);   // desktop sidebar
    const [mobileOpen, setMobileOpen] = useState(false);

    // Auto-collapse on small screens
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        if (mq.matches) setExpanded(false);
        const h = e => { if (e.matches) setExpanded(false); };
        mq.addEventListener('change', h);
        return () => mq.removeEventListener('change', h);
    }, []);

    // Close mobile on navigate
    useEffect(() => setMobileOpen(false), [pathname]);

    const handleLogout = () => { logout(); navigate('/'); };

    const NavItem = ({ item }) => (
        <NavLink to={item.path} end={item.end}
            className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg transition-all duration-150 group
         ${expanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
         ${isActive
                    ? 'bg-[#38bdf8]/10 text-[#38bdf8]'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#38bdf8] rounded-full" />
                    )}
                    <span className="flex-shrink-0 ml-1">
                        <Ic d={ICONS[item.icon]} size={15} />
                    </span>
                    {expanded && (
                        <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    )}
                    {/* Tooltip when collapsed */}
                    {!expanded && (
                        <span className="absolute left-full ml-3 px-2 py-1 bg-[#0d1b2a] border border-[#1e2d3d] rounded-md text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-opacity">
                            {item.label}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );

    const SidebarInner = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className={`h-16 flex items-center border-b border-[#1e2d3d] flex-shrink-0 ${expanded ? 'px-5' : 'px-0 justify-center'}`}>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">NJ</span>
                </div>
                {expanded && (
                    <div className="ml-2.5 overflow-hidden">
                        <div className="text-sm font-semibold text-white whitespace-nowrap leading-tight">Techartistry</div>
                        <div className="text-[10px] text-slate-600 whitespace-nowrap">Portfolio OS</div>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 overflow-y-auto px-2 space-y-0.5">
                {expanded && <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest px-2 mb-2">Main</p>}
                {NAV_MAIN.map(item => <NavItem key={item.path} item={item} />)}
                <div className="my-3 border-t border-[#1e2d3d]" />
                {expanded && <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest px-2 mb-2">System</p>}
                {NAV_SYSTEM.map(item => <NavItem key={item.path} item={item} />)}
            </nav>

            {/* User row */}
            <div className="border-t border-[#1e2d3d] p-3 flex-shrink-0">
                <div className={`flex items-center gap-3 ${expanded ? '' : 'justify-center'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {admin?.username?.[0]?.toUpperCase() ?? 'A'}
                    </div>
                    {expanded && (
                        <>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white truncate">{admin?.username ?? 'Admin'}</div>
                                <div className="text-[10px] text-slate-600">Administrator</div>
                            </div>
                            <button onClick={handleLogout} title="Logout"
                                className="p-1 text-slate-600 hover:text-red-400 transition-colors rounded">
                                <Ic d={ICONS.logout} size={13} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#060d1a] text-slate-200 overflow-hidden">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)} />
            )}

            {/* Desktop sidebar */}
            <aside className={`hidden md:flex flex-col bg-[#0a1628] border-r border-[#1e2d3d] flex-shrink-0 transition-all duration-300 ${expanded ? 'w-56' : 'w-14'}`}>
                <SidebarInner />
            </aside>

            {/* Mobile drawer */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0a1628] border-r border-[#1e2d3d] flex flex-col md:hidden transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarInner />
            </aside>

            {/* Main column */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 border-b border-[#1e2d3d] bg-[#0a1628]/80 backdrop-blur-sm flex items-center gap-4 px-4 md:px-6 flex-shrink-0">
                    <button
                        onClick={() => window.innerWidth < 768 ? setMobileOpen(v => !v) : setExpanded(v => !v)}
                        className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors">
                        <Ic d={ICONS.menu} size={17} />
                    </button>

                    {/* Breadcrumb */}
                    <div className="hidden sm:flex items-center gap-2 text-sm">
                        <span className="text-slate-700">Admin</span>
                        <span className="text-slate-800">/</span>
                        <span className="text-slate-300 font-medium">{PAGE_NAMES[pathname] ?? 'Dashboard'}</span>
                    </div>

                    <div className="flex-1" />

                    {/* Search bar */}
                    <label className="hidden md:flex items-center gap-2 bg-[#060d1a] border border-[#1e2d3d] focus-within:border-[#38bdf8]/40 rounded-lg px-3 py-2 w-48 transition-colors cursor-text">
                        <Ic d={ICONS.search} size={13} />
                        <input placeholder="Search…"
                            className="bg-transparent text-sm text-slate-400 placeholder-slate-700 outline-none w-full" />
                        <kbd className="text-[10px] text-slate-700 bg-[#1e2d3d] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
                    </label>

                    <button className="relative p-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors">
                        <Ic d={ICONS.bell} size={15} />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#38bdf8] rounded-full" />
                    </button>

                    <a href="/" target="_blank" rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#38bdf8] border border-[#1e2d3d] hover:border-[#38bdf8]/30 px-3 py-1.5 rounded-lg transition-all">
                        <Ic d={ICONS.eye} size={12} /> View Site
                    </a>
                </header>

                {/* Page content area */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
