import React, { useState } from 'react';
import { FAQS, FORUM_TOPICS } from '../data';
import { 
  Search, MessageCircle, Book, Users, 
  ChevronDown, ChevronUp, LifeBuoy, Send
} from 'lucide-react';

const SupportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'forum' | 'chat'>('faq');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const renderFAQ = () => (
    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in">
        {FAQS.map(faq => (
            <div key={faq.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <button 
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors"
                >
                    <span className="font-bold text-stone-800">{faq.question}</span>
                    {openFaqId === faq.id ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                </button>
                {openFaqId === faq.id && (
                    <div className="p-4 pt-0 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                        {faq.answer}
                    </div>
                )}
            </div>
        ))}
    </div>
  );

  const renderForum = () => (
      <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-stone-800">Community Discussions</h3>
              <button className="px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-lg hover:bg-stone-800">New Topic</button>
          </div>
          {FORUM_TOPICS.map(topic => (
              <div key={topic.id} className="bg-white p-4 rounded-xl border border-stone-200 hover:border-brand-300 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between">
                      <div>
                          <h4 className="font-bold text-stone-800 group-hover:text-brand-600 mb-1">{topic.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-stone-400">
                              <span>by {topic.author}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {topic.views} views</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                           {topic.isPinned && <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-1 rounded uppercase">Pinned</span>}
                           <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                               <MessageCircle className="w-3 h-3" /> {topic.replies}
                           </span>
                      </div>
                  </div>
              </div>
          ))}
      </div>
  );

  const renderChat = () => (
      <div className="max-w-2xl mx-auto h-[600px] bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white"><LifeBuoy className="w-5 h-5" /></div>
              <div>
                  <h3 className="font-bold text-stone-800">Support Team</h3>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                  </div>
              </div>
          </div>
          <div className="flex-1 p-4 bg-stone-50/30 flex flex-col gap-4 overflow-y-auto">
               <div className="self-start max-w-[80%] bg-stone-100 p-3 rounded-xl rounded-tl-none text-sm text-stone-700">
                   Hello! How can we help you increase your sales today?
               </div>
          </div>
          <div className="p-4 border-t border-stone-100 bg-white flex gap-2">
              <input type="text" placeholder="Type your message..." className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-300" />
              <button className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"><Send className="w-5 h-5" /></button>
          </div>
      </div>
  );

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-6 lg:p-10 bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto mb-10 text-center">
            <h1 className="text-3xl font-bold text-stone-800 mb-4">Help & Support Center</h1>
            <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search for answers..." 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 shadow-sm focus:ring-2 focus:ring-brand-200 outline-none"
                />
            </div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
            <button 
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'faq' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
            >
                <div className="flex items-center gap-2"><Book className="w-4 h-4" /> FAQ</div>
            </button>
            <button 
                onClick={() => setActiveTab('forum')}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'forum' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
            >
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Community</div>
            </button>
            <button 
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'chat' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
            >
                <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Live Chat</div>
            </button>
        </div>

        {activeTab === 'faq' && renderFAQ()}
        {activeTab === 'forum' && renderForum()}
        {activeTab === 'chat' && renderChat()}
    </div>
  );
};

export default SupportView;
