import { useState, useEffect } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../../api/axios';
import { StatCard, Card, CardHeader, Badge, Btn, PageHeader, Ic } from '../../components/admin/ui/ui';

const IC = {
    proj: 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
    msg: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
    cert: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
    plus: 'M12 5v14 M5 12h14',
    arrow: 'M5 12h14 M12 5l7 7-7 7',
    check: 'M20 6L9 17l-5-5',
    edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
    trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
    live: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
};

const VISITOR_DATA = [
    { month: 'Jan', visitors: 124, pageviews: 348 },
    { month: 'Feb', visitors: 187, pageviews: 502 },
    { month: 'Mar', visitors: 152, pageviews: 431 },
    { month: 'Apr', visitors: 241, pageviews: 628 },
    { month: 'May', visitors: 318, pageviews: 847 },
    { month: 'Jun', visitors: 282, pageviews: 731 },
    { month: 'Jul', visitors: 397, pageviews: 962 },
    { month: 'Aug', visitors: 471, pageviews: 1138 },
];

const MSG_DATA = [
    { month: 'Jan', count: 2 }, { month: 'Feb', count: 5 }, { month: 'Mar', count: 3 },
    { month: 'Apr', count: 8 }, { month: 'May', count: 6 }, { month: 'Jun', count: 11 },
    { month: 'Jul', count: 9 }, { month: 'Aug', count: 14 },
];

const TECH_PIE = [
    { name: 'React', value: 42 },
    { name: 'Node.js', value: 23 },
    { name: 'Python', value: 21 },
    { name: 'MongoDB', value: 14 },
];
const PIE_COLORS = ['#38bdf8', '#0ea5e9', '#6366f1', '#8b5cf6'];

const ChartTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0d1b2a] border border-[#1e2d3d] rounded-xl p-3 shadow-2xl text-xs">
            <p className="text-slate-500 mb-2 font-medium">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-400 capitalize">{p.dataKey}:</span>
                    <span className="text-white font-semibold ml-1">{p.value}</span>
                </div>
            ))}
        </div>
    );
};

function ActivityRow({ color, icon, title, meta, time }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-[#1e2d3d] last:border-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${color}12` }}>
                <span style={{ color }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 leading-snug">{title}</p>
                {meta && <p className="text-xs text-slate-600 mt-0.5 truncate">{meta}</p>}
            </div>
            <span className="text-xs text-slate-700 flex-shrink-0 whitespace-nowrap">{time}</span>
        </div>
    );
}

function QuickAction({ icon, accent, label, desc, href }) {
    return (
        <a href={href}
            className="flex items-center gap-3 p-3 rounded-xl border border-[#1e2d3d] hover:border-[#2a3f55] hover:bg-white/[0.02] transition-all duration-150 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${accent}10`, border: `1px solid ${accent}18` }}>
                <span style={{ color: accent }}>{icon}</span>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</p>
                <p className="text-xs text-slate-600">{desc}</p>
            </div>
            <span className="text-slate-800 group-hover:text-slate-500 transition-colors">
                <Ic d={IC.arrow} size={14} />
            </span>
        </a>
    );
}

function ProjectRow({ p }) {
    const CAT = { web: 'blue', fullstack: 'green', ml: 'purple', other: 'slate' };
    return (
        <div className="flex items-center gap-3 py-3 border-b border-[#1e2d3d] last:border-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#1e2d3d] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#38bdf8] overflow-hidden">
                {p.imageUrl
                    ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    : p.title?.[0]
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{p.title}</p>
                <p className="text-xs text-slate-600 truncate">{p.techStack?.slice(0, 3).join(', ')}</p>
            </div>
            <Badge label={p.category ?? 'web'} variant={CAT[p.category] ?? 'slate'} />
        </div>
    );
}

function MsgRow({ m }) {
    const colors = ['from-[#38bdf8] to-[#0284c7]', 'from-[#6366f1] to-[#4f46e5]', 'from-[#10b981] to-[#059669]'];
    const ci = (m.name?.charCodeAt(0) ?? 0) % colors.length;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-[#1e2d3d] last:border-0">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[ci]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                {m.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-sm font-medium ${m.read ? 'text-slate-400' : 'text-white'}`}>{m.name}</span>
                    {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-600 truncate">{m.message}</p>
            </div>
            <span className="text-xs text-slate-700 whitespace-nowrap flex-shrink-0">
                {new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
        </div>
    );
}

export default function DashboardPage() {
    const [data, setData] = useState({ projects: [], messages: [], certificates: [], counts: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/stats')
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.error("Dashboard Load Error:", err))
            .finally(() => setLoading(false));
    }, []);

    // SAFE GUARD: Line 172 - Check if array exists before filtering
    const unreadCount = Array.isArray(data.messages)
        ? data.messages.filter(m => !m.read).length
        : 0;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="p-5 md:p-7 max-w-[1400px] mx-auto space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <p className="text-xs text-slate-700 font-mono mb-0.5">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h1 className="text-xl font-semibold text-white">{greeting}, Admin 👋</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Here's your portfolio overview for today.</p>
                </div>
                <Btn variant="primary" size="sm" onClick={() => window.location.href = '/admin/projects'}>
                    <Ic d={IC.plus} size={13} /> Add Project
                </Btn>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Projects" value={loading ? '—' : data.counts?.projectCount ?? 0} accent="#38bdf8" loading={loading} icon={<Ic d={IC.proj} size={16} />} />
                <StatCard label="Messages Received" value={loading ? '—' : data.counts?.messageCount ?? 0} delta={data.counts?.unreadMessages > 0 ? data.counts.unreadMessages : undefined} accent="#6366f1" loading={loading} icon={<Ic d={IC.msg} size={16} />} />
                <StatCard label="Certificates" value={loading ? '—' : data.counts?.certCount ?? 0} accent="#f59e0b" loading={loading} icon={<Ic d={IC.cert} size={16} />} />
                <StatCard label="Profile Views" value={loading ? '—' : '1.2k'} delta={8} accent="#10b981" loading={loading} icon={<Ic d={IC.eye} size={16} />} />
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2" padding={false}>
                    <div className="p-5 pb-0">
                        <CardHeader title="Visitor Traffic" subtitle="Monthly unique visitors vs page views" />
                    </div>
                    <div className="h-52 px-2 pb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={VISITOR_DATA} margin={{ top: 5, right: 10, left: -22, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.28} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTip />} cursor={{ stroke: '#1e2d3d' }} />
                                <Area type="monotone" dataKey="pageviews" stroke="#6366f1" strokeWidth={1.5} fill="url(#gP)" dot={false} />
                                <Area type="monotone" dataKey="visitors" stroke="#38bdf8" strokeWidth={2} fill="url(#gV)" dot={false}
                                    activeDot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <CardHeader title="Tech Stack" subtitle="Distribution across projects" />
                    <div className="h-36 mb-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={TECH_PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                                    dataKey="value" strokeWidth={0}>
                                    {TECH_PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} opacity={0.9} />)}
                                </Pie>
                                <Tooltip content={<ChartTip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                        {TECH_PIE.map(({ name, value }, i) => (
                            <div key={name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                                <span className="text-xs text-slate-400 flex-1">{name}</span>
                                <div className="w-20 h-1 bg-[#1e2d3d] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: PIE_COLORS[i] }} />
                                </div>
                                <span className="text-xs text-slate-700 w-8 text-right tabular-nums">{value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader title="Message Volume" subtitle="Contact form submissions per month" />
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MSG_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTip />} cursor={{ fill: '#1e2d3d50' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={26} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader title="Quick Actions" subtitle="Jump to common tasks" />
                    <div className="grid sm:grid-cols-2 gap-2">
                        <QuickAction icon={<Ic d={IC.plus} size={14} />} accent="#38bdf8" label="Add Project" desc="Create a new portfolio entry" href="/admin/projects" />
                        <QuickAction icon={<Ic d={IC.msg} size={14} />} accent="#6366f1" label="View Messages" desc={`${unreadCount} unread messages`} href="/admin/messages" />
                        <QuickAction icon={<Ic d={IC.cert} size={14} />} accent="#f59e0b" label="Add Certificate" desc="Upload a new certificate" href="/admin/certificates" />
                        <QuickAction icon={<Ic d={IC.live} size={14} />} accent="#10b981" label="Live Site" desc="Open your public portfolio" href="/" />
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <Card padding={false}>
                    <div className="p-5 pb-0">
                        <CardHeader title="Recent Projects" subtitle="Last added to your portfolio"
                            action={<a href="/admin/projects" className="text-xs text-[#38bdf8] hover:text-[#7dd3fc] transition-colors">View all →</a>} />
                    </div>
                    <div className="px-5">
                        {loading
                            ? [1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 py-3 border-b border-[#1e2d3d]">
                                    <div className="w-8 h-8 rounded-lg bg-[#1e2d3d] animate-pulse flex-shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-[#1e2d3d] rounded animate-pulse w-3/4" />
                                        <div className="h-2.5 bg-[#1e2d3d] rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))
                            : (data.projects || []).length === 0
                                ? <p className="text-sm text-slate-700 py-10 text-center">No projects yet.</p>
                                : data.projects.slice(0, 5).map(p => <ProjectRow key={p._id} p={p} />)
                        }
                    </div>
                </Card>

                <Card padding={false}>
                    <div className="p-5 pb-0">
                        <CardHeader title="Recent Messages" subtitle="Latest contact form submissions"
                            action={<a href="/admin/messages" className="text-xs text-[#38bdf8] hover:text-[#7dd3fc] transition-colors">View all →</a>} />
                    </div>
                    <div className="px-5">
                        {loading
                            ? [1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 py-3 border-b border-[#1e2d3d]">
                                    <div className="w-7 h-7 rounded-full bg-[#1e2d3d] animate-pulse flex-shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-[#1e2d3d] rounded animate-pulse w-1/2" />
                                        <div className="h-2.5 bg-[#1e2d3d] rounded animate-pulse w-3/4" />
                                    </div>
                                </div>
                            ))
                            : (data.messages || []).length === 0
                                ? <p className="text-sm text-slate-700 py-10 text-center">No messages yet.</p>
                                : data.messages.slice(0, 5).map(m => <MsgRow key={m._id} m={m} />)
                        }
                    </div>
                </Card>
            </div>
        </div>
    );
}