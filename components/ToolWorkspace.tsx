import React, { useState, useEffect, useRef } from 'react';
import { Tool, Brand } from '../types';
import { Copy, RefreshCw, Zap, Sparkles, Save, ArrowLeft, Database, Paperclip, Image as ImageIcon, X, FileText, Info } from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { saveToChatArchive } from '../services/chatArchive';
import { useAuth } from '../context/AuthContext';

interface ToolWorkspaceProps {
  tool: Tool;
  brand: Brand;
  onBack: () => void;
}

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, brand, onBack }) => {
  const { user: authUser } = useAuth();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Brand Context State (Default ON)
  const [isBrandContextActive, setIsBrandContextActive] = useState(true);

  // File Upload State
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput('');
    setOutput('');
    setError('');
    setIsLoading(false);
    setIsSaved(false);
    setAttachedFiles([]);
    setIsBrandContextActive(true); // Always default to true for brand consistency
  }, [tool]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    setIsLoading(true);
    setError('');
    setIsSaved(false);
    
    try {
      // Construct prompt with context if enabled
      let finalPrompt = input;
      let finalSystemInstruction = tool.systemPrompt;

      if (isBrandContextActive) {
        finalPrompt = `[SYSTEM CONTEXT: Operating for brand "${brand.name}". 
        Website: ${brand.website}. 
        Connected Data Sources: ${brand.integrations.filter(i => i.isConnected).map(i => i.name).join(', ')}.]
        
        USER REQUEST: ${input}`;
        
        finalSystemInstruction += " You are an internal growth consultant for this brand. Use the assumed data context (e.g. past performance, tone of voice) to provide specific, tailored advice.";
      }

      if (attachedFiles.length > 0) {
        finalPrompt += `\n\n[Attached Files: ${attachedFiles.map(f => f.name).join(', ')} - Note: File analysis simulation]`;
      }

      const result = await generateContent(finalPrompt, finalSystemInstruction);
      setOutput(result);
      if (authUser) {
        saveToChatArchive({
          userId: authUser.id,
          toolId: tool.id,
          toolName: tool.name,
          input,
          output: result,
          brandId: brand.id,
        }).catch(() => {});
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!output || !authUser) return;
    const { error } = await saveToChatArchive({
      userId: authUser.id,
      toolId: tool.id,
      toolName: tool.name,
      input,
      output,
      brandId: brand.id,
    });
    if (!error) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <main className="flex-1 h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-[#FAFAF9]">
      
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-stone-800">{tool.name}</h2>
            <div className="flex items-center gap-2">
               {isBrandContextActive ? (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                   <Database className="w-3 h-3" /> Brand Data Active
                 </span>
               ) : (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                   <Database className="w-3 h-3" /> Data Disabled
                 </span>
               )}
            </div>
          </div>
        </div>

        {/* Brand Context Toggle (Disable Switch) */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-stone-500 hidden sm:inline">
            {isBrandContextActive ? `Using ${brand.name} Assets` : 'Generic Mode'}
          </span>
          <button 
            onClick={() => setIsBrandContextActive(!isBrandContextActive)}
            className={`
              relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none
              ${isBrandContextActive ? 'bg-green-500' : 'bg-stone-300'}
            `}
            title={isBrandContextActive ? "Disable Brand Data" : "Enable Brand Data"}
          >
            <span 
              className={`
                block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out mt-1 ml-1
                ${isBrandContextActive ? 'translate-x-5' : 'translate-x-0'}
              `} 
            />
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Enhanced Input Area */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
            
            <div className="bg-stone-50/50 px-4 py-3 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-700 text-sm font-bold">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Prompt Editor</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Description from CSV - inserted here */}
              <p className="text-sm text-stone-700 font-medium leading-relaxed">
                {tool.description}
              </p>

              {/* How it works info */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex gap-3 items-start">
                 <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                 <p className="text-sm text-stone-600 leading-relaxed">
                   <span className="font-bold text-blue-700 block mb-0.5">How it works:</span>
                   {tool.instruction}
                 </p>
              </div>

              {/* File Previews */}
              {attachedFiles.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-stone-100 pl-3 pr-2 py-1.5 rounded-lg border border-stone-200 text-xs group">
                      {file.type.startsWith('image/') ? <ImageIcon className="w-3 h-3 text-stone-500" /> : <FileText className="w-3 h-3 text-stone-500" />}
                      <span className="max-w-[150px] truncate font-medium text-stone-700">{file.name}</span>
                      <button onClick={() => removeFile(idx)} className="p-0.5 hover:bg-stone-200 rounded-full text-stone-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your input here based on the instructions above..."
                className="w-full h-32 text-stone-800 placeholder-stone-300 border border-stone-200 rounded-lg p-3 focus:ring-2 focus:ring-brand-100 focus:border-brand-300 outline-none resize-none text-base leading-relaxed"
              />
            </div>

            {/* Input Toolbar */}
            <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-stone-500 hover:bg-stone-200 hover:text-stone-700 rounded-lg transition-colors flex items-center gap-2"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Attach</span>
                </button>
                <div className="h-4 w-px bg-stone-300 mx-1"></div>
                <span className="text-xs text-stone-400">
                  {input.length} chars
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400 hidden sm:inline mr-2">Ctrl + Enter to run</span>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
                  className={`
                    flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm shadow-sm transition-all
                    ${isLoading || (!input.trim() && attachedFiles.length === 0)
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                      : 'bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02] active:scale-95'}
                  `}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-brand-400" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
             <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm text-center">
               {error}
             </div>
          )}

          {(output || isLoading) && (
            <div className={`bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-500 ${isLoading ? 'opacity-70 animate-pulse' : 'opacity-100'}`}>
              <div className="bg-stone-50 px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-700 text-sm font-medium">
                  <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded flex items-center justify-center text-white">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="font-bold">AI Output</span>
                </div>
                
                {output && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${isSaved ? 'text-green-600 bg-green-50' : 'text-stone-500 hover:bg-stone-200'}`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button 
                      onClick={handleCopy}
                      className="p-1.5 hover:bg-stone-200 text-stone-500 rounded transition-colors text-xs flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </button>
                  </div>
                )}
              </div>
              <div className="p-8 min-h-[160px] prose prose-stone max-w-none">
                {isLoading && !output ? (
                   <div className="space-y-4">
                     <div className="h-4 bg-stone-100 rounded w-3/4 animate-pulse"></div>
                     <div className="h-4 bg-stone-100 rounded w-full animate-pulse"></div>
                     <div className="h-4 bg-stone-100 rounded w-5/6 animate-pulse"></div>
                     <div className="h-32 bg-stone-50 rounded-lg w-full animate-pulse mt-4"></div>
                   </div>
                ) : (
                  <div className="whitespace-pre-wrap text-stone-800 leading-relaxed text-[15px]">
                    {output}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default ToolWorkspace;
