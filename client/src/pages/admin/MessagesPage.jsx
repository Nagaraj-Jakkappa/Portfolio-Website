/**
 * MessagesPage.jsx
 * Path: client/src/pages/admin/MessagesPage.jsx
 * Uses existing useMessages() hook — no changes needed.
 */

import { useState } from 'react';
import { useMessages } from '../../hooks/useData';
import {
  Card,
  Badge,
  Btn,
  EmptyState,
  PageHeader,
  Ic,
  Spinner,
} from '../../components/admin/ui/ui';
import toast from 'react-hot-toast';

const IC = {
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
  reply: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
  check: 'M20 6L9 17l-5-5',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  inbox:
    'M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z',
};

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const GRAD = [
  'from-blue-400 to-blue-600',
  'from-[#6366f1] to-[#4f46e5]',
  'from-[#10b981] to-[#059669]',
  'from-[#f59e0b] to-[#d97706]',
];
function Avatar({ name, size = 8 }) {
  const i = (name?.charCodeAt(0) ?? 0) % GRAD.length;
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${GRAD[i]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
    >
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

// ── Left panel: message list item ─────────────────────────────
function ListItem({ msg, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-navy-800 relative transition-colors ${
        selected ? 'bg-blue-400/[0.06] border-l-2 border-l-[#38bdf8]' : 'hover:bg-white/[0.02]'
      }`}
    >
      {!msg.read && <div className="absolute right-4 top-4 w-2 h-2 bg-blue-400 rounded-full" />}
      <div className="flex items-center gap-2.5 mb-1.5">
        <Avatar name={msg.name} size={7} />
        <div className="min-w-0">
          <p
            className={`text-sm truncate ${msg.read ? 'text-slate-400 font-normal' : 'text-white font-semibold'}`}
          >
            {msg.name}
          </p>
          <p className="text-xs text-slate-700 truncate">{msg.email}</p>
        </div>
      </div>
      {msg.subject && (
        <p
          className={`text-xs mb-1 truncate pr-6 ${msg.read ? 'text-slate-600' : 'text-slate-400'}`}
        >
          {msg.subject}
        </p>
      )}
      <p className="text-xs text-slate-700 truncate pr-6">{msg.message}</p>
      <p className="text-xs text-slate-800 mt-1.5">{timeAgo(msg.createdAt)}</p>
    </button>
  );
}

// ── Right panel: message detail ───────────────────────────────
function Detail({ msg, onMarkRead, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(msg._id);
    } catch {
      toast.error('Delete failed');
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-navy-800 flex-shrink-0">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">
              {msg.subject || '(No subject)'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">{msg.name}</span>
              <span className="text-slate-700">·</span>
              <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline">
                {msg.email}
              </a>
              <span className="text-slate-700">·</span>
              <span className="text-slate-600">
                {new Date(msg.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!msg.read && (
              <Btn variant="success" size="sm" onClick={() => onMarkRead(msg._id)}>
                <Ic d={IC.check} size={12} /> Mark Read
              </Btn>
            )}
            <Btn variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Spinner size={12} /> : <Ic d={IC.trash} size={12} />}
              Delete
            </Btn>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge label={msg.read ? 'Read' : 'Unread'} variant={msg.read ? 'slate' : 'blue'} />
          {msg.subject && <Badge label="Has Subject" variant="green" />}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-navy-950 border border-navy-800 rounded-xl p-5 max-w-2xl">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-navy-800">
            <Avatar name={msg.name} size={9} />
            <div>
              <p className="text-sm font-semibold text-white">{msg.name}</p>
              <p className="text-xs text-slate-600">{msg.email}</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {msg.message}
          </p>
        </div>
      </div>

      {/* Reply bar */}
      <div className="p-4 border-t border-navy-800 flex-shrink-0">
        <a
          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your message')}`}
          className="flex items-center gap-2 w-full bg-navy-950 border border-navy-800 hover:border-blue-400/40 rounded-xl px-4 py-3 text-sm text-slate-600 hover:text-slate-300 transition-colors"
        >
          <Ic d={IC.reply} size={14} />
          <span>
            Reply to <span className="text-blue-400">{msg.email}</span>…
          </span>
          <span className="ml-auto text-xs text-slate-800">Opens your mail app</span>
        </a>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function MessagesPage() {
  const { messages, loading, markRead, deleteMessage } = useMessages();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | unread | read

  const unread = messages.filter((m) => !m.read).length;

  const filtered = messages
    .filter((m) => filter === 'all' || (filter === 'unread' ? !m.read : m.read))
    .filter(
      (m) =>
        !search ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.message?.toLowerCase().includes(search.toLowerCase())
    );

  const selected = messages.find((m) => m._id === selectedId);

  const handleSelect = (msg) => {
    setSelectedId(msg._id);
    if (!msg.read) markRead(msg._id);
  };

  const handleMarkRead = async (id) => {
    await markRead(id);
    toast.success('Marked as read');
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
    if (selectedId === id) setSelectedId(null);
    toast.success('Message deleted');
  };

  return (
    <div className="p-5 md:p-7 max-w-[1400px] mx-auto" style={{ height: 'calc(100vh - 4rem)' }}>
      <PageHeader title="Messages" description={`${unread} unread · ${messages.length} total`} />

      <div className="grid md:grid-cols-[300px_1fr] gap-4" style={{ height: 'calc(100% - 64px)' }}>
        {/* Left — list */}
        <Card padding={false} className="flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="p-3 border-b border-navy-800 space-y-2 flex-shrink-0">
            <label className="flex items-center gap-2 bg-navy-950 border border-navy-800 focus-within:border-blue-400/40 rounded-lg px-3 py-2 transition-colors cursor-text">
              <Ic d={IC.search} size={12} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages…"
                className="bg-transparent text-sm text-slate-300 placeholder-slate-700 outline-none w-full"
              />
            </label>
            <div className="flex gap-1 bg-navy-950 border border-navy-800 rounded-lg p-0.5">
              {['all', 'unread', 'read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${filter === f ? 'bg-blue-400 text-white' : 'text-slate-600 hover:text-slate-300'}`}
                >
                  {f}
                  {f === 'unread' && unread > 0 ? ` (${unread})` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-4 border-b border-navy-800 animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-navy-800 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-navy-800 rounded w-1/2" />
                    <div className="h-2.5 bg-navy-800 rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Ic d={IC.inbox} size={20} />}
                title="No messages"
                description={
                  search
                    ? `No results for "${search}"`
                    : filter === 'unread'
                      ? "You're all caught up!"
                      : 'No messages yet.'
                }
              />
            ) : (
              filtered.map((m) => (
                <ListItem
                  key={m._id}
                  msg={m}
                  selected={selectedId === m._id}
                  onClick={() => handleSelect(m)}
                />
              ))
            )}
          </div>
        </Card>

        {/* Right — detail */}
        <Card padding={false} className="overflow-hidden">
          {selected ? (
            <Detail msg={selected} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center mb-4 text-slate-700">
                <Ic d={IC.mail} size={22} />
              </div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">No message selected</h3>
              <p className="text-xs text-slate-700">
                Click a message from the list to read it here.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
