import React from 'react';
import { Tool } from '../types';
import { Lightbulb, Target, Sparkles } from 'lucide-react';

interface ExamplesPanelProps {
  tool: Tool;
}

const ExamplesPanel: React.FC<ExamplesPanelProps> = ({ tool }) => {
  return (
    <aside className="w-80 border-l border-stone-200 bg-white h-[calc(100vh-64px)] overflow-y-auto hidden xl:block shadow-[rgba(0,0,0,0.05)_0px_0px_10px_-5px_inset]">
      <div className="p-6">
        
        {/* Tool Objective Card */}
        <div className={`mb-8 p-4 rounded-xl border ${tool.type === 'hype' ? 'bg-purple-50 border-purple-100' : 'bg-green-50 border-green-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            {tool.type === 'hype' ? (
              <Sparkles className="w-4 h-4 text-purple-600" />
            ) : (
              <Target className="w-4 h-4 text-green-600" />
            )}
            <h3 className={`font-bold text-sm uppercase tracking-wide ${tool.type === 'hype' ? 'text-purple-700' : 'text-green-700'}`}>
              {tool.type === 'hype' ? 'Viral & Awareness' : 'Sales Performance'}
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {tool.type === 'hype' 
              ? "Use this tool to generate engagement, shares, and brand visibility (Top of Funnel)."
              : "Use this tool to drive conversions, lower CPA, and increase revenue (Bottom of Funnel)."
            }
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="bg-yellow-100 p-1.5 rounded-md">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-stone-800">Best Practices & Examples</h3>
        </div>

        <div className="space-y-6">
          {tool.examples.map((ex, idx) => (
            <div key={idx} className="group">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                 Scenario {idx + 1}: <span className="text-brand-600 normal-case">{ex.title}</span>
              </h4>
              
              <div className="space-y-3">
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">User Input</span>
                  <p className="text-xs text-stone-600 leading-relaxed font-mono bg-white p-2 rounded border border-stone-100/50">
                    {ex.input}
                  </p>
                </div>

                <div className="bg-brand-50/30 p-3 rounded-lg border border-brand-100/50">
                  <span className="text-[10px] text-brand-400 font-bold uppercase block mb-1">AI Output</span>
                  <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                    {ex.output}
                  </p>
                </div>
              </div>

              {idx < tool.examples.length - 1 && (
                <div className="h-px bg-stone-100 w-full my-6"></div>
              )}
            </div>
          ))}

          {tool.examples.length === 0 && (
            <div className="text-center py-10 text-stone-400 text-sm">
              No examples available for this tool yet.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ExamplesPanel;
