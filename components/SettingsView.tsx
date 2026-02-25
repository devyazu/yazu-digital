import React, { useState } from 'react';
import { UserProfile, AccessLevel } from '../types';
import { User, CreditCard, Shield, Bell, Check, Zap, AlertCircle, Plus, MapPin, Building } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'billing'>('profile');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$4.99',
      features: ['10 Essential Tools', '1 Brand Connection', 'Basic Support'],
      credits: '10,000 Credits',
      current: user.tier === 'basic'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99',
      features: ['50+ Advanced Tools', '5 Brand Connections', 'Priority Support', 'Sales Intelligence'],
      credits: '50,000 Credits',
      current: user.tier === 'pro'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29.99',
      features: ['All Tools Unlocked', 'Unlimited Brands', 'Dedicated Account Manager', 'API Access'],
      credits: 'Unlimited Credits*',
      current: user.tier === 'premium'
    }
  ];

  const renderProfile = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-stone-200">
          <img 
            src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80"} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <button className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 text-stone-700 shadow-sm transition-all">
            Change Avatar
          </button>
          <p className="text-xs text-stone-400 mt-2">JPG, GIF or PNG. Max 1MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
          <input type="text" defaultValue={user.name} className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
          <input type="email" defaultValue="demo@marketerai.com" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Company Name</label>
          <input type="text" defaultValue="Acme Corp" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Job Title</label>
          <input type="text" defaultValue="Marketing Director" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
        </div>
      </div>

      <div className="pt-6 border-t border-stone-200 flex justify-end">
        <button className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Current Plan Status */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-lg font-bold mb-1">Current Plan: <span className="text-brand-400 uppercase tracking-wide">{user.tier}</span></h3>
          <p className="text-stone-400 text-sm">Your next billing date is <span className="text-white">November 24, 2024</span></p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            Cancel Plan
          </button>
          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-bold shadow-lg transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Credit Usage */}
      <div>
        <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-500" /> Credit Usage
        </h4>
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-bold text-stone-800">{user.credits.used.toLocaleString()}</span>
              <span className="text-stone-400 text-sm font-medium"> / {user.credits.total.toLocaleString()}</span>
            </div>
            <span className="text-sm font-bold text-brand-600">
              {Math.round((user.credits.used / user.credits.total) * 100)}% Used
            </span>
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-400 to-brand-600" 
              style={{ width: `${(user.credits.used / user.credits.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-stone-500 mt-3">
            Credits reset on the 1st of every month. Need more? <button className="text-brand-600 hover:underline">Buy One-time Pack</button>.
          </p>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`border rounded-xl p-6 relative flex flex-col ${plan.current ? 'border-brand-500 bg-brand-50/20 shadow-md ring-1 ring-brand-500' : 'border-stone-200 bg-white hover:border-brand-200'}`}
          >
            {plan.current && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Current Plan
              </div>
            )}
            <h4 className="font-bold text-lg text-stone-800 mb-1">{plan.name}</h4>
            <div className="text-2xl font-bold text-stone-900 mb-1">{plan.price}<span className="text-sm font-medium text-stone-400">/mo</span></div>
            <div className="text-xs font-bold text-brand-600 mb-6 bg-brand-50 inline-block px-2 py-1 rounded self-start">
              {plan.credits}
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              disabled={plan.current}
              className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${plan.current ? 'bg-stone-200 text-stone-400 cursor-default' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
            >
              {plan.current ? 'Active' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
       
       {/* Deep Billing Fields */}
       <div>
         <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" /> Billing Address
         </h4>
         <div className="bg-white border border-stone-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Company Name</label>
              <input type="text" placeholder="e.g. Acme Inc" className="w-full px-4 py-2 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-brand-400 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Street Address</label>
              <input type="text" placeholder="123 Market St" className="w-full px-4 py-2 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-brand-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">City</label>
              <input type="text" placeholder="New York" className="w-full px-4 py-2 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-brand-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">State / Province</label>
              <input type="text" placeholder="NY" className="w-full px-4 py-2 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-brand-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Postal Code</label>
              <input type="text" placeholder="10001" className="w-full px-4 py-2 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-brand-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Country</label>
              <select className="w-full px-4 py-2 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-brand-400 transition-colors">
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Germany</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">VAT / Tax ID</label>
              <div className="relative">
                <input type="text" placeholder="Optional" className="w-full pl-10 px-4 py-2 rounded-lg bg-stone-50 border border-stone-200 outline-none focus:border-brand-400 transition-colors" />
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>
         </div>
         <div className="mt-4 flex justify-end">
            <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Save Billing Details</button>
         </div>
       </div>

       {/* Payment Method */}
       <div>
         <h4 className="font-bold text-stone-800 mb-4">Payment Method</h4>
         <div className="bg-white border border-stone-200 rounded-xl p-6">
            <div className="flex items-center justify-between p-4 border border-stone-200 rounded-lg bg-stone-50">
            <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white border border-stone-200 rounded flex items-center justify-center">
                <span className="font-bold text-xs italic text-blue-800">VISA</span>
                </div>
                <div>
                <div className="text-sm font-bold text-stone-800">•••• •••• •••• 4242</div>
                <div className="text-xs text-stone-500">Expires 12/28</div>
                </div>
            </div>
            <button className="text-sm font-medium text-brand-600 hover:text-brand-700">Edit</button>
            </div>
            <button className="mt-4 flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
            <Plus className="w-4 h-4" /> Add New Card
            </button>
         </div>
       </div>

       {/* History */}
       <div>
         <h4 className="font-bold text-stone-800 mb-4">Billing History</h4>
         <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
           <table className="w-full text-left text-sm">
             <thead className="bg-stone-50 border-b border-stone-200">
               <tr>
                 <th className="px-6 py-3 font-medium text-stone-500">Date</th>
                 <th className="px-6 py-3 font-medium text-stone-500">Amount</th>
                 <th className="px-6 py-3 font-medium text-stone-500">Plan</th>
                 <th className="px-6 py-3 font-medium text-stone-500">Status</th>
                 <th className="px-6 py-3 font-medium text-stone-500 text-right">Invoice</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-stone-100">
               {[1,2,3].map((i) => (
                 <tr key={i} className="hover:bg-stone-50/50">
                   <td className="px-6 py-4 text-stone-800">Oct 24, 2024</td>
                   <td className="px-6 py-4 text-stone-800">$19.99</td>
                   <td className="px-6 py-4 text-stone-600">Pro Plan</td>
                   <td className="px-6 py-4">
                     <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">Paid</span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="text-brand-600 hover:underline">Download</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#FAFAF9] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Account Settings</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Nav */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-stone-200' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              <User className="w-4 h-4" /> My Profile
            </button>
            <button 
              onClick={() => setActiveTab('subscription')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'subscription' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-stone-200' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              <Shield className="w-4 h-4" /> Plan & Usage
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-stone-200' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              <CreditCard className="w-4 h-4" /> Billing
            </button>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <Bell className="w-4 h-4" /> Notifications
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'subscription' && renderSubscription()}
            {activeTab === 'billing' && renderBilling()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
