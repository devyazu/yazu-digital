import React from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationsPanelProps {
  onClose: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Credit usage', body: 'You have used 45% of your monthly credits.', time: '2 hours ago', read: false },
  { id: '2', title: 'Brand connected', body: 'Urban Sneakers Co. – 3 sources connected.', time: '1 day ago', read: true },
  { id: '3', title: 'New tool available', body: 'TikTok Hook Generator is now available in Visual Studio.', time: '3 days ago', read: true },
];

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 lg:bg-transparent" onClick={onClose} aria-hidden />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-600" /> Notifications
          </h2>
          <button onClick={onClose} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <p className="text-stone-500 text-sm text-center py-8">No notifications yet.</p>
          ) : (
            <ul className="space-y-2">
              {MOCK_NOTIFICATIONS.map((n) => (
                <li
                  key={n.id}
                  className={`p-4 rounded-xl border text-left ${n.read ? 'bg-stone-50/50 border-stone-100' : 'bg-brand-50/30 border-brand-100'}`}
                >
                  <p className="font-medium text-stone-800 text-sm">{n.title}</p>
                  <p className="text-stone-600 text-sm mt-0.5">{n.body}</p>
                  <p className="text-xs text-stone-400 mt-2">{n.time}</p>
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
