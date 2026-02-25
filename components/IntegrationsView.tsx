import React from 'react';
import { Brand, Integration } from '../types';
import { 
  CheckCircle, XCircle, RefreshCw, Plus, 
  ShoppingBag, BarChart2, Facebook, Search, Mail, 
  Link, AlertCircle
} from 'lucide-react';

interface IntegrationsViewProps {
  brand: Brand;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShoppingBag': return <ShoppingBag className="w-8 h-8 text-[#95BF47]" />; // Shopify Green
    case 'BarChart2': return <BarChart2 className="w-8 h-8 text-[#F4B400]" />; // Google Analytics Yellow
    case 'Facebook': return <Facebook className="w-8 h-8 text-[#1877F2]" />; // Meta Blue
    case 'Search': return <Search className="w-8 h-8 text-[#4285F4]" />; // Google Blue
    case 'Mail': return <Mail className="w-8 h-8 text-stone-600" />;
    default: return <Link className="w-8 h-8 text-stone-400" />;
  }
};

const IntegrationsView: React.FC<IntegrationsViewProps> = ({ brand }) => {
  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#FAFAF9] p-6 lg:p-10">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">My Brand Assets</h1>
        <p className="text-stone-500 text-lg">
          Connect your store, ads, and analytics to unlock <span className="font-semibold text-brand-600">Smart Sales Intelligence</span>.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Active Brand Card */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-stone-900 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
              {brand.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800">{brand.name}</h2>
              <a href={`https://${brand.website}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline text-sm">
                {brand.website}
              </a>
            </div>
          </div>
          <button className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors">
            Edit Brand Settings
          </button>
        </div>

        {/* Integrations Grid */}
        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-brand-500" />
            Connected Data Sources
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brand.integrations.map((integration) => (
              <div 
                key={integration.id}
                className={`
                  relative bg-white p-6 rounded-xl border transition-all
                  ${integration.isConnected ? 'border-green-200 shadow-sm' : 'border-stone-200 border-dashed opacity-80'}
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-stone-50 rounded-xl">
                    {getIcon(integration.iconName)}
                  </div>
                  <div className="flex flex-col items-end">
                    {integration.isConnected ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                        <XCircle className="w-3 h-3" /> Not Linked
                      </span>
                    )}
                  </div>
                </div>
                
                <h4 className="font-bold text-stone-800 mb-1">{integration.name}</h4>
                
                {integration.isConnected ? (
                  <p className="text-xs text-stone-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Last synced: {integration.lastSync}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400">
                    Connect to analyze {integration.type} data.
                  </p>
                )}

                <div className="mt-6">
                  {integration.isConnected ? (
                    <button className="w-full py-2 text-xs font-medium text-stone-500 border border-stone-200 rounded-lg hover:text-red-500 hover:border-red-200 transition-colors">
                      Manage Connection
                    </button>
                  ) : (
                    <button className="w-full py-2 text-xs font-bold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-md">
                      Connect Now
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add New Integration Placeholder */}
            <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-stone-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                <Plus className="w-6 h-6 text-stone-400 group-hover:text-brand-600" />
              </div>
              <span className="font-medium text-stone-600 group-hover:text-brand-700">Add New Source</span>
              <span className="text-xs text-stone-400 mt-1">TikTok, Pinterest, etc.</span>
            </button>
          </div>
        </div>

        {/* Manual Data Entry Callout */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-brand-600 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-brand-900 mb-1">Don't have API access?</h4>
            <p className="text-sm text-brand-800/80 mb-3">
              You can manually upload your CSV reports (Sales, Customer Lists, Ad Spend) to get the same level of AI insights.
            </p>
            <button className="text-xs font-bold text-brand-700 underline hover:text-brand-900">
              Upload CSV Data Manually &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IntegrationsView;
