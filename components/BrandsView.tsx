import React from 'react';
import { Brand, UserProfile } from '../types';
import { Plus, Settings, ShoppingBag, ShieldCheck, Pen, UploadCloud } from 'lucide-react';

interface BrandsViewProps {
  brands: Brand[];
  user: UserProfile;
  onSelectBrand: (brand: Brand) => void;
  onManageBrand: (brand: Brand) => void;
  onAddNew: () => void;
}

const BrandsView: React.FC<BrandsViewProps> = ({ brands, user, onSelectBrand, onManageBrand, onAddNew }) => {
  const brandLimit = user.maxBrands;
  const usedBrands = brands.length;
  const percentage = (usedBrands / brandLimit) * 100;

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#FAFAF9] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">My Brands</h1>
            <p className="text-stone-500 text-lg">Manage your workspaces and connected assets.</p>
          </div>
          
          <div className="bg-white px-5 py-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Plan Usage</div>
              <div className="text-sm font-bold text-stone-800">
                <span className={usedBrands >= brandLimit ? "text-red-600" : "text-brand-600"}>{usedBrands}</span>
                <span className="text-stone-400"> / {brandLimit} Brands</span>
              </div>
            </div>
            <div className="w-12 h-12 relative">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-stone-100" />
                 <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                         strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * percentage) / 100}
                         className={usedBrands >= brandLimit ? "text-red-500" : "text-brand-500"} />
               </svg>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {brands.map((brand) => {
            const connectedCount = brand.integrations.filter(i => i.isConnected).length;
            
            return (
              <div 
                key={brand.id} 
                className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all group overflow-hidden flex flex-col cursor-pointer"
                onClick={() => onSelectBrand(brand)}
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    {/* Logo with Hover Edit Effect */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md group/logo">
                        <img 
                            src={brand.logoUrl || "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop"} 
                            alt={brand.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                            <Pen className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {connectedCount > 0 ? (
                       <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                         <ShieldCheck className="w-3 h-3" /> Data Ready
                       </span>
                    ) : (
                       <span className="px-2 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase rounded-full">
                         No Data
                       </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-stone-800 mb-1 group-hover:text-brand-600 transition-colors">{brand.name}</h3>
                  <p className="text-sm text-stone-400 mb-6 font-mono truncate">{brand.website || 'No website connected'}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-2 rounded-lg">
                    <ShoppingBag className="w-4 h-4 text-stone-400" />
                    <span>{connectedCount} sources connected</span>
                  </div>
                </div>

                <div className="bg-stone-50 border-t border-stone-100 p-3">
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onManageBrand(brand);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-stone-600 hover:bg-brand-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2 border border-stone-200 hover:border-brand-600 bg-white shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5" /> Configure Integrations
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Brand Card */}
          {usedBrands < brandLimit ? (
             <button 
               onClick={onAddNew}
               className="border-2 border-dashed border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-brand-400 hover:bg-brand-50/20 transition-all group min-h-[280px]"
             >
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                 <Plus className="w-8 h-8 text-stone-400 group-hover:text-brand-600" />
               </div>
               <div className="text-center">
                 <h3 className="font-bold text-stone-600 group-hover:text-brand-700 text-lg">Add New Brand</h3>
                 <p className="text-xs text-stone-400 mt-1">Connect a new workspace</p>
               </div>
             </button>
          ) : (
            <div className="border border-stone-100 bg-stone-50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 min-h-[280px] opacity-75">
               <div className="text-center">
                 <h3 className="font-bold text-stone-400">Limit Reached</h3>
                 <p className="text-xs text-stone-400 mt-1">Upgrade to Premium to add more brands.</p>
                 <button className="mt-4 px-4 py-2 bg-stone-800 text-white text-xs font-bold rounded-full hover:bg-stone-900">
                   Upgrade Plan
                 </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BrandsView;
