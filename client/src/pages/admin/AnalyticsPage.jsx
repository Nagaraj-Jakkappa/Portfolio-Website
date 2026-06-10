/**
 * AnalyticsPage.jsx
 * Path: client/src/pages/admin/AnalyticsPage.jsx
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, StatCard, PageHeader, Ic } from '../../components/admin/ui/ui';
import api from '../../api/axios';

const EVENT_LABELS = {
  page_view: 'Page View',
  project_view: 'Project View',
  github_click: 'GitHub Click',
  linkedin_click: 'LinkedIn Click',
  whatsapp_click: 'WhatsApp Click',
  email_click: 'Email Click',
  resume_click: 'Resume Click',
  resume_download: 'Resume Download',
  credential_click: 'Credential Click',
  case_study_open: 'Case Study Open',
  experience_breakdown_open: 'Experience Breakdown Open',
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/visitor-events/admin/summary');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch visitor insights:', err);
      setError('Failed to load visitor insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleClearTestEvents = async () => {
    if (!window.confirm('Are you sure you want to clear manual test events?')) return;
    try {
      await api.delete('/visitor-events/admin/test-events');
      fetchInsights();
    } catch (err) {
      console.error('Failed to clear test events', err);
      alert('Failed to clear test events');
    }
  };

  if (loading && !data) {
    return (
      <div className="p-5 md:p-7 max-w-[1400px] mx-auto space-y-4">
        <PageHeader title="Visitor Insights" description="Loading real-time analytics..." />
        <div className="animate-pulse flex gap-4">
          <div className="h-24 bg-navy-800 rounded-xl w-full" />
          <div className="h-24 bg-navy-800 rounded-xl w-full" />
          <div className="h-24 bg-navy-800 rounded-xl w-full" />
          <div className="h-24 bg-navy-800 rounded-xl w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 md:p-7 max-w-[1400px] mx-auto space-y-4">
        <PageHeader title="Visitor Insights" description="Real-time analytics" />
        <Card className="border-red-500/20 bg-red-500/5">
          <div className="p-5 text-red-400">
            <p>{error}</p>
            <button
              onClick={fetchInsights}
              className="mt-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-5 md:p-7 max-w-[1400px] mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Visitor Insights" description="Anonymous tracking and engagement metrics" />
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearTestEvents}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition"
          >
            Clear Test Events
          </button>
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-lg text-sm transition disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={data.totalEvents?.toLocaleString() || 0}
          accent="#38bdf8"
          icon={<Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z" size={16} />}
        />
        <StatCard
          label="Today's Events"
          value={data.todayEvents?.toLocaleString() || 0}
          accent="#10b981"
          icon={<Ic d="M18 20V10 M12 20V4 M6 20v-6" size={16} />}
        />
        <StatCard
          label="Page Views"
          value={data.pageViews?.toLocaleString() || 0}
          accent="#6366f1"
          icon={<Ic d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6" size={16} />}
        />
        <StatCard
          label="CTA Clicks"
          value={data.ctaClicks?.toLocaleString() || 0}
          accent="#f59e0b"
          icon={<Ic d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.773 2.882M2.728 11.83l.149 2.988M2.239 7.188l2.882.773M11.83 2.728l2.988.149M20 7h.01" size={16} />}
        />
      </div>

      {/* Sections: Top Pages, Top Referrers, Device Breakdown */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Top Pages */}
        <Card padding={false}>
          <div className="p-5 border-b border-navy-800">
            <CardHeader title="Top Pages" subtitle="Most viewed routes" />
          </div>
          <div className="p-3">
            {data.topPages?.length > 0 ? (
              data.topPages.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 px-2 hover:bg-white/5 rounded-lg">
                  <span className="text-sm text-slate-300 truncate pr-4">{item.page || '/'}</span>
                  <span className="text-sm font-mono text-blue-400">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No page data yet</p>
            )}
          </div>
        </Card>

        {/* Top Referrers */}
        <Card padding={false}>
          <div className="p-5 border-b border-navy-800">
            <CardHeader title="Top Referrers" subtitle="Where visitors come from" />
          </div>
          <div className="p-3">
            {data.topReferrers?.length > 0 ? (
              data.topReferrers.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 px-2 hover:bg-white/5 rounded-lg">
                  <span className="text-sm text-slate-300 truncate pr-4">{item.referrer}</span>
                  <span className="text-sm font-mono text-blue-400">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No referrer data yet</p>
            )}
          </div>
        </Card>

        {/* Device Breakdown */}
        <Card padding={false}>
          <div className="p-5 border-b border-navy-800">
            <CardHeader title="Device Breakdown" subtitle="Desktop vs Mobile" />
          </div>
          <div className="p-3">
            {data.deviceBreakdown?.length > 0 ? (
              data.deviceBreakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 px-2 hover:bg-white/5 rounded-lg">
                  <span className="text-sm text-slate-300 capitalize">{item.device || 'Unknown'}</span>
                  <span className="text-sm font-mono text-blue-400">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No device data yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card padding={false}>
        <div className="p-5 border-b border-navy-800">
          <CardHeader title="Recent Events" subtitle="Latest tracking activity" />
        </div>
        <div className="w-full overflow-x-auto">
          {data.recentEvents?.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-navy-900/50">
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Type</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Page</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Device</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Browser/OS</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {data.recentEvents.map((ev) => (
                  <tr key={ev._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-slate-300 whitespace-nowrap">
                      {new Date(ev.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        ev.eventType === 'page_view' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {EVENT_LABELS[ev.eventType] || ev.eventType}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-300 truncate max-w-[200px]" title={ev.page || ev.path}>
                      {ev.page || ev.path || 'Unknown'}
                    </td>
                    <td className="p-4 text-sm text-slate-300 capitalize">{ev.deviceType || 'Unknown'}</td>
                    <td className="p-4 text-sm text-slate-400">
                      {(ev.browser || 'Unknown')} / {(ev.os || 'Unknown')}
                    </td>
                    <td className="p-4 text-sm text-slate-500 truncate max-w-[200px]" title={ev.referrer}>
                      {ev.referrer || 'Direct / None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              No recent events recorded.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
