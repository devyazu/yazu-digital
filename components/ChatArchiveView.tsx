import React, { useEffect, useState } from 'react';
import { Copy, FileText, Loader2 } from 'lucide-react';
import { getChatArchive, type ChatArchiveRow } from '../services/chatArchive';

interface ChatArchiveViewProps {
  userId: string;
}

const ChatArchiveView: React.FC<ChatArchiveViewProps> = ({ userId }) => {
  const [items, setItems] = useState<ChatArchiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getChatArchive(userId).then(({ data, error: err }) => {
      if (cancelled) return;
      setLoading(false);
      if (err) setError(err.message);
      else setItems(data);
    });
    return () => { cancelled = true; };
  }, [userId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center text-stone-500">
        <p className="text-red-600 font-medium">Yüklenemedi</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center text-stone-500 rounded-2xl m-6 bg-white/60 border border-stone-200">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-xl font-bold text-stone-600 mb-2">Chat Archive</h3>
        <p>Henüz kayıt yok. Araçlarda üretim yaptıkça burada listelenecek.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Chat Archive</h2>
        <p className="text-stone-500 text-sm mb-6">AI aracı yazışmalarınız</p>
        <ul className="space-y-4">
          {items.map((row) => {
            const isExpanded = expandedId === row.id;
            return (
              <li
                key={row.id}
                className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : row.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-800 truncate">{row.tool_name}</p>
                      <p className="text-xs text-stone-500">{formatDate(row.created_at)}</p>
                    </div>
                  </div>
                  <span className="text-stone-400 text-sm shrink-0 ml-2">
                    {isExpanded ? 'Daralt' : 'Genişlet'}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-stone-100 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-stone-400 uppercase mb-1">Girdi</p>
                      <p className="text-sm text-stone-700 bg-stone-50 rounded-lg p-3 whitespace-pre-wrap">
                        {row.input}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(row.input)}
                        className="mt-1 text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Kopyala
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-400 uppercase mb-1">Çıktı</p>
                      <p className="text-sm text-stone-700 bg-stone-50 rounded-lg p-3 whitespace-pre-wrap max-h-60 overflow-y-auto">
                        {row.output}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(row.output)}
                        className="mt-1 text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Kopyala
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatArchiveView;
