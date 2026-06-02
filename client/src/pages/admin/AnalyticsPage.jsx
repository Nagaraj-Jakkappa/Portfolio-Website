/**
 * AnalyticsPage.jsx
 * Path: client/src/pages/admin/AnalyticsPage.jsx
 */

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, StatCard, PageHeader, Ic } from '../../components/admin/ui/ui';

const MONTHLY = [
  { month: 'Jan', views: 820, msgs: 4 },
  { month: 'Feb', views: 1140, msgs: 6 },
  { month: 'Mar', views: 980, msgs: 3 },
  { month: 'Apr', views: 1450, msgs: 9 },
  { month: 'May', views: 1890, msgs: 12 },
  { month: 'Jun', views: 1620, msgs: 8 },
  { month: 'Jul', views: 2200, msgs: 15 },
  { month: 'Aug', views: 2750, msgs: 18 },
];
const WEEKLY = [
  { day: 'Mon', views: 43, clicks: 12 },
  { day: 'Tue', views: 68, clicks: 22 },
  { day: 'Wed', views: 55, clicks: 18 },
  { day: 'Thu', views: 91, clicks: 31 },
  { day: 'Fri', views: 78, clicks: 27 },
  { day: 'Sat', views: 34, clicks: 9 },
  { day: 'Sun', views: 29, clicks: 7 },
];
const SOURCES = [
  { name: 'LinkedIn', pct: 38 },
  { name: 'GitHub', pct: 27 },
  { name: 'Direct', pct: 20 },
  { name: 'Google', pct: 11 },
  { name: 'Twitter', pct: 4 },
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-900 border border-navy-800 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-slate-500 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-400 capitalize">{p.dataKey}:</span>
          <span className="text-white font-semibold ml-1">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const totalViews = MONTHLY.reduce((s, m) => s + m.views, 0);
const totalMsgs = MONTHLY.reduce((s, m) => s + m.msgs, 0);
const avgPerDay = Math.round(totalViews / (MONTHLY.length * 30));
const peak = MONTHLY.reduce((a, b) => (a.views > b.views ? a : b)).month;

export default function AnalyticsPage() {
  return (
    <div className="p-5 md:p-7 max-w-[1400px] mx-auto space-y-4">
      <PageHeader title="Analytics" description="Portfolio performance insights — last 8 months" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Page Views"
          value={totalViews.toLocaleString()}
          delta={22}
          accent="#38bdf8"
          icon={
            <Ic
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z"
              size={16}
            />
          }
        />
        <StatCard
          label="Avg Views / Day"
          value={avgPerDay}
          delta={8}
          accent="#6366f1"
          icon={<Ic d="M18 20V10 M12 20V4 M6 20v-6" size={16} />}
        />
        <StatCard
          label="Messages Received"
          value={totalMsgs}
          delta={35}
          accent="#10b981"
          icon={<Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" size={16} />}
        />
        <StatCard
          label="Peak Month"
          value={peak}
          accent="#f59e0b"
          icon={
            <Ic
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              size={16}
            />
          }
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card padding={false}>
          <div className="p-5 pb-0">
            <CardHeader title="Monthly Traffic" subtitle="Page views over time" />
          </div>
          <div className="h-56 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY} margin={{ top: 5, right: 10, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gMV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#gMV)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding={false}>
          <div className="p-5 pb-0">
            <CardHeader title="This Week" subtitle="Daily views vs project link clicks" />
          </div>
          <div className="h-56 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY} margin={{ top: 5, right: 10, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} cursor={{ fill: '#1e2d3d50' }} />
                <Bar
                  dataKey="views"
                  fill="#38bdf8"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={16}
                  opacity={0.85}
                />
                <Bar
                  dataKey="clicks"
                  fill="#6366f1"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={16}
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Traffic Sources" subtitle="Where your visitors come from" />
        <div className="space-y-3">
          {SOURCES.map(({ name, pct }) => (
            <div key={name} className="flex items-center gap-4">
              <span className="text-sm text-slate-400 w-20 flex-shrink-0">{name}</span>
              <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-[#6366f1]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-600 w-9 text-right tabular-nums">{pct}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-800 mt-5 pt-4 border-t border-navy-800">
          Connect Plausible, Umami, or Google Analytics to replace this seeded data with real
          numbers.
        </p>
      </Card>
    </div>
  );
}
