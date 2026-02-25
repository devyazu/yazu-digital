/**
 * E-posta şablon editörü (basit HTML + EmailBuilder.js uyumlu).
 * - İçerik HTML textarea ile düzenlenir; body_json varsa korunur (ileride EmailBuilder editör eklenebilir).
 * - Ref: getHtml(), getJson(), getInlinedHtml() — AdminView ve API ile uyumlu.
 */
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';

export interface EmailTemplateEditorRef {
  getHtml: () => string;
  getJson: () => string;
  getInlinedHtml: () => string;
}

interface EmailTemplateEditorProps {
  /** Başlangıç HTML (body_html). */
  initialHtml?: string;
  /** Mevcut body_json; sadece HTML düzenleniyorsa aynen korunur. */
  initialJson?: string | null;
  templateKey?: string;
  className?: string;
  fullHeight?: boolean;
}

const EmailTemplateEditor = forwardRef<EmailTemplateEditorRef, EmailTemplateEditorProps>(
  function EmailTemplateEditor({ initialHtml = '', initialJson, templateKey, className, fullHeight }, ref) {
    const [html, setHtml] = useState(initialHtml);
    useEffect(() => {
      setHtml(initialHtml);
    }, [templateKey, initialHtml]);

    useImperativeHandle(
      ref,
      () => ({
        getHtml: () => html,
        getJson: () => initialJson ?? '',
        getInlinedHtml: () => html,
      }),
      [html, initialJson]
    );

    return (
      <div
        className={className}
        style={fullHeight ? { minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' } : { minHeight: 420 }}
      >
        <div className="flex-1 min-h-0 flex flex-col gap-2 p-4">
          <label className="text-xs font-bold text-stone-500">İçerik (HTML)</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<p>Merhaba {{user_email}}</p> ..."
            className="flex-1 min-h-[200px] w-full font-mono text-sm border border-stone-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
      </div>
    );
  }
);

export default EmailTemplateEditor;
