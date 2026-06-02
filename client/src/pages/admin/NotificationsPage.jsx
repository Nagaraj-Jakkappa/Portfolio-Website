import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast'; // Optional: if you use toast

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('/notifications/mark-all-read');
      // Update local state so UI reflects change immediately
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All caught up!');
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  if (loading) return <div className="p-10 text-sky-400 font-mono">Fetching data...</div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-slate-400 mt-1 font-mono text-sm">System Activity & Inquiries</p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="px-5 py-2.5 rounded-full bg-sky-500/10 border border-sky-500/50 text-sky-400 hover:bg-sky-500 hover:text-white transition-all duration-300 text-sm font-bold"
          >
            Clear All Unread
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
              notification.read
                ? 'bg-[#0f172a]/50 border-[#1e293b]'
                : 'bg-sky-500/5 border-sky-500/40 shadow-[0_0_20px_rgba(14,165,233,0.05)]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-2 h-2.5 w-2.5 rounded-full ${notification.read ? 'bg-slate-700' : 'bg-sky-400 animate-pulse'}`}
              />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3
                    className={`font-bold ${notification.read ? 'text-slate-400' : 'text-white'}`}
                  >
                    {notification.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500 font-mono italic">
              "The silence is peaceful. No new alerts."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
