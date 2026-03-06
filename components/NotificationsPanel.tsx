import React, { useEffect, useState, useRef } from 'react';
import { Bell, X, Loader2 } from 'lucide-react';
import { getNotificationsForUser, markAllNotificationsAsRead, type NotificationRow } from '../services/notificationsService';

interface NotificationsPanelProps {
  onClose: () => void;
  onMarkAllRead?: () => void;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
  return d.toLocaleDateString();
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose, onMarkAllRead }) => {
  const [list, setList] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const markedReadRef = useRef(false);

  useEffect(() => {
    getNotificationsForUser().then(({ data }) => {
      setList(data ?? []);
      setLoading(false);
      if ((data?.length ?? 0) > 0 && !markedReadRef.current) {
        markedReadRef.current = true;
        markAllNotificationsAsRead().then(() => {
          onMarkAllRead?.();
        });
      }
    });
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 lg:bg-transparent" onClick={onClose} aria-hidden />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
          <h2 className="text-base font-bold text-stone-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" /> Notifications
          </h2>
          <button onClick={onClose} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-stone-500 text-sm text-center py-8">No notifications yet.</p>
          ) : (
            <ul className="space-y-2">
              {list.map((n) => (
                <li key={n.id} className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 text-left">
                  <p className="font-medium text-stone-800 text-sm">{n.title}</p>
                  <p className="text-stone-600 text-xs mt-0.5 line-clamp-3">{n.body}</p>
                  <p className="text-xs text-stone-400 mt-2">{formatTime(n.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
