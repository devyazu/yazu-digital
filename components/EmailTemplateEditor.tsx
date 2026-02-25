/**
 * Drag-and-drop e-posta şablon editörü (GrapesJS + newsletter preset).
 * Ref ile getHtml() ve getInlinedHtml() sunar; Kaydet'te inlined HTML kullanılabilir.
 */
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import grapesjs from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsPresetNewsletter from 'grapesjs-preset-newsletter';
import 'grapesjs/dist/css/grapes.min.css';

export interface EmailTemplateEditorRef {
  getHtml: () => string;
  /** E-posta istemcileri için CSS inlined HTML (newsletter preset komutu) */
  getInlinedHtml: () => string;
}

interface EmailTemplateEditorProps {
  initialHtml: string;
  /** Şablon değişince editörü yeniden mount etmek için (key olarak kullanılır) */
  templateKey?: string;
  className?: string;
  /** Tam ekran modunda tüm yüksekliği kullan */
  fullHeight?: boolean;
}

const EmailTemplateEditor = forwardRef<EmailTemplateEditorRef, EmailTemplateEditorProps>(
  function EmailTemplateEditor({ initialHtml, templateKey, className, fullHeight }, ref) {
    const editorInstance = useRef<ReturnType<typeof grapesjs.init> | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        getHtml: () => editorInstance.current?.getHtml() ?? '',
        getInlinedHtml: () => {
          const ed = editorInstance.current;
          if (!ed) return '';
          const cmd = ed.Commands.get('gjs-get-inlined-html');
          if (cmd) {
            const res = cmd.run(ed);
            if (typeof res === 'string') return res;
          }
          return ed.getHtml() ?? '';
        },
      }),
      []
    );

    return (
      <div className={className} style={fullHeight ? { minHeight: 0, height: '100%' } : { minHeight: 420 }}>
        <GjsEditor
          key={templateKey ?? 'default'}
          grapesjs={grapesjs}
          grapesjsCss=""
          options={{
            height: fullHeight ? '100%' : '400px',
            storageManager: false,
            autorender: true,
            fromElement: false,
          }}
          plugins={[gjsBlocksBasic, gjsPresetNewsletter]}
          onEditor={(editor) => {
            editorInstance.current = editor;
            if (initialHtml?.trim()) {
              try {
                editor.setComponents(initialHtml.trim());
              } catch (e) {
                console.warn('EmailTemplateEditor setComponents:', e);
              }
            }
          }}
        />
      </div>
    );
  }
);

export default EmailTemplateEditor;
