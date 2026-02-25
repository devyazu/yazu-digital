import React, { useState } from 'react';
import { Brand, SalesAgentConfig } from '../types';
import { 
  Bot, Settings, BarChart2, Code, MessageSquare, 
  Power, Save, RefreshCw, Copy, ExternalLink,
  MessageCircle, DollarSign, Users, Clock, Plus
} from 'lucide-react';

interface SalesAgentViewProps {
  brand: Brand;
  onUpdateConfig: (config: SalesAgentConfig) => void;
}

const SalesAgentView: React.FC<SalesAgentViewProps> = ({ brand, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'install' | 'preview'>('overview');
  
  // Local state for form editing
  const [config, setConfig] = useState<SalesAgentConfig>(brand.salesAgentConfig || {
    isActive: false,
    name: 'Sales Assistant',
    tone: 'friendly',
    goal: 'capture_lead',
    knowledgeBase: [],
    customInstructions: '',
    colorHex: '#000000',
    stats: { conversations: 0, conversions: 0, revenueGenerated: 0, avgResponseTime: 0 }
  });

  const handleSave = () => {
    onUpdateConfig(config);
    // Show success notification logic here
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in">
        {/* Status Banner */}
        <div className={`p-6 rounded-xl border flex items-center justify-between ${config.isActive ? 'bg-green-50 border-green-200' : 'bg-stone-50 border-stone-200'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${config.isActive ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                    <Power className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-stone-800">{config.isActive ? 'Agent is Active' : 'Agent is Inactive'}</h3>
                    <p className="text-sm text-stone-500">{config.isActive ? 'Your sales agent is currently engaging with visitors.' : 'Enable the agent to start capturing sales.'}</p>
                </div>
            </div>
            <button 
                onClick={() => setConfig({...config, isActive: !config.isActive})}
                className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${config.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
            >
                {config.isActive ? 'Deactivate' : 'Activate Now'}
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-stone-400 uppercase">Revenue Generated</span>
                    <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800">${config.stats.revenueGenerated.toLocaleString()}</h3>
                <span className="text-xs text-green-600 font-bold">+12% this week</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-stone-400 uppercase">Conversations</span>
                    <MessageCircle className="w-4 h-4 text-brand-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800">{config.stats.conversations}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-stone-400 uppercase">Conversions</span>
                    <Users className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800">{config.stats.conversions}</h3>
                <span className="text-xs text-stone-500">{(config.stats.conversions / (config.stats.conversations || 1) * 100).toFixed(1)}% Rate</span>
            </div>
             <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-stone-400 uppercase">Avg Response</span>
                    <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800">{config.stats.avgResponseTime}s</h3>
            </div>
        </div>

        {/* Recent Activity Mock */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-stone-100 font-bold text-stone-800">Recent Sales Conversations</div>
             <div className="divide-y divide-stone-100">
                {[1,2,3].map((i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">U{i}</div>
                            <div>
                                <p className="text-sm font-medium text-stone-800">User asked about "Winter Jacket Sizing"</p>
                                <p className="text-xs text-stone-400">Agent recommended Size M • Sale Closed ($120)</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Converted</span>
                    </div>
                ))}
             </div>
        </div>
    </div>
  );

  const renderConfig = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200">
                <h3 className="font-bold text-stone-800 mb-4">Identity & Appearance</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Agent Name</label>
                        <input 
                           type="text" 
                           value={config.name}
                           onChange={(e) => setConfig({...config, name: e.target.value})}
                           className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Theme Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={config.colorHex}
                                onChange={(e) => setConfig({...config, colorHex: e.target.value})}
                                className="w-10 h-10 rounded border border-stone-200 p-1 cursor-pointer"
                            />
                            <input 
                                type="text"
                                value={config.colorHex} 
                                onChange={(e) => setConfig({...config, colorHex: e.target.value})}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200">
                <h3 className="font-bold text-stone-800 mb-4">Sales Strategy</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Conversation Tone</label>
                        <select 
                            value={config.tone}
                            onChange={(e) => setConfig({...config, tone: e.target.value as any})}
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none"
                        >
                            <option value="friendly">Friendly & Casual</option>
                            <option value="consultative">Professional Consultant</option>
                            <option value="aggressive">High Energy / Sales Focused</option>
                            <option value="luxury">Luxury / Minimalist</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Primary Goal</label>
                        <select 
                            value={config.goal}
                            onChange={(e) => setConfig({...config, goal: e.target.value as any})}
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none"
                        >
                            <option value="direct_sale">Close Sale Directly</option>
                            <option value="capture_lead">Capture Email/Lead</option>
                            <option value="support_upsell">Support + Soft Upsell</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Specific Instructions (System Prompt)</label>
                        <textarea 
                           rows={4}
                           value={config.customInstructions}
                           onChange={(e) => setConfig({...config, customInstructions: e.target.value})}
                           className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                           placeholder="e.g. Never offer discounts above 10%. Always mention free shipping on orders over $50."
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-stone-200">
                <h3 className="font-bold text-stone-800 mb-4">Knowledge Base</h3>
                <p className="text-sm text-stone-500 mb-4">The agent automatically scrapes product data from your connected store integration. Add extra policies here.</p>
                
                <div className="space-y-2">
                    {config.knowledgeBase.map((kb, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded border border-stone-100">
                            <span className="text-sm flex-1 truncate">{kb}</span>
                            <button className="text-red-500 hover:text-red-700"><ExternalLink className="w-4 h-4" /></button>
                        </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-stone-200 rounded-lg text-stone-400 font-bold hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Policy Text or URL
                    </button>
                </div>
            </div>

            <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 flex items-start gap-3">
                <Save className="w-6 h-6 text-brand-600 shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-brand-800 mb-1">Ready to Deploy?</h4>
                    <p className="text-sm text-brand-700 mb-3">Save your changes before switching tabs or leaving.</p>
                    <button onClick={handleSave} className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Save Configuration</button>
                </div>
            </div>
        </div>
    </div>
  );

  const renderInstall = () => (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
          <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm text-center">
              <h3 className="text-xl font-bold text-stone-800 mb-2">1-Click Installation</h3>
              <p className="text-stone-500 mb-6">If you use Shopify or WordPress, click below to inject the Sales Agent automatically.</p>
              <div className="flex justify-center gap-4">
                  <button className="px-6 py-3 bg-[#95BF47] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#85AB3D]">
                      Install on Shopify
                  </button>
                  <button className="px-6 py-3 bg-[#21759B] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#1A6080]">
                      Install on WordPress
                  </button>
              </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-stone-300"></div>
             </div>
             <div className="relative flex justify-center">
                 <span className="px-2 bg-[#FAFAF9] text-sm text-stone-500">Or use manual code</span>
             </div>
          </div>

          <div className="bg-stone-900 rounded-xl p-6 overflow-hidden relative group">
              <button className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 bg-white/10 rounded">
                  <Copy className="w-4 h-4" />
              </button>
              <h4 className="text-stone-400 text-sm font-mono mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4" /> Place before &lt;/body&gt; tag
              </h4>
              <code className="text-green-400 font-mono text-sm leading-relaxed block break-all">
                  &lt;script src="https://cdn.salesmind.ai/agent.js?id={brand.id}" async&gt;&lt;/script&gt;
                  <br/>
                  &lt;script&gt;
                  <br/>
                  &nbsp;&nbsp;window.SalesMindConfig = &#123; theme: '{config.colorHex}', tone: '{config.tone}' &#125;;
                  <br/>
                  &lt;/script&gt;
              </code>
          </div>
      </div>
  );

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-6 lg:p-10 bg-[#FAFAF9]">
       <div className="max-w-6xl mx-auto mb-8">
           <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
                   <Bot className="w-8 h-8" />
               </div>
               <div>
                   <h1 className="text-3xl font-bold text-stone-800">AI Sales Agent</h1>
                   <p className="text-stone-500">Your 24/7 automated conversion expert.</p>
               </div>
           </div>

           {/* Navigation */}
           <div className="border-b border-stone-200 flex gap-6">
                {[
                    {id: 'overview', icon: BarChart2, label: 'Performance'},
                    {id: 'config', icon: Settings, label: 'Configuration'},
                    {id: 'install', icon: Code, label: 'Installation'},
                    {id: 'preview', icon: MessageSquare, label: 'Live Preview'},
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
           </div>
       </div>

       <div className="max-w-6xl mx-auto">
           {activeTab === 'overview' && renderOverview()}
           {activeTab === 'config' && renderConfig()}
           {activeTab === 'install' && renderInstall()}
           {activeTab === 'preview' && (
               <div className="flex justify-center h-[500px] items-center bg-stone-100 rounded-xl border border-stone-200 border-dashed">
                   <div className="bg-white w-[350px] h-[450px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
                       <div className="bg-brand-600 p-4 text-white flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Bot className="w-5 h-5" /></div>
                           <div>
                               <div className="font-bold text-sm">{config.name}</div>
                               <div className="text-[10px] opacity-80">Typically replies instantly</div>
                           </div>
                       </div>
                       <div className="flex-1 bg-stone-50 p-4 space-y-3">
                           <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-stone-700 max-w-[85%]">
                               Hi there! 👋 I noticed you're looking at our sneakers. Can I help you find the right size?
                           </div>
                       </div>
                       <div className="p-3 bg-white border-t border-stone-100">
                           <input type="text" placeholder="Type a message..." className="w-full px-3 py-2 bg-stone-100 rounded-full text-sm outline-none" disabled />
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
};

export default SalesAgentView;