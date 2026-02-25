/**
 * E-posta şablon editörü (Easy Email).
 * Ref ile getHtml() ve getJson() sunar; Kaydet'te HTML + JSON API'ye gönderilir.
 * Not: easy-email-extensions StandardLayout fullscreen açılışta hata verdiği için
 * şimdilik sadece EmailEditor kullanılıyor; blok listesi easy-email-editor içinde
 * soldaki panel (collapsed: false patch) ile açılabilir.
 */
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { BlockManager, BasicType, JsonToMjml } from 'easy-email-core';
import { EmailEditor, EmailEditorProvider } from 'easy-email-editor';
import mjml from 'mjml-browser';
import 'easy-email-editor/lib/style.css';

export interface EmailTemplateEditorRef {
  getHtml: () => string;
  getJson: () => string;
  getInlinedHtml: () => string;
}

interface EmailTemplateEditorProps {
  /** Başlangıç içeriği: HTML (legacy, yok sayılır) veya boş → varsayılan blok. */
  initialHtml?: string;
  /** Easy Email JSON (body_json). Varsa editör buna göre yüklenir. */
  initialJson?: string | null;
  /** Şablon değişince yeniden mount için key */
  templateKey?: string;
  className?: string;
  fullHeight?: boolean;
}

const defaultContent =
  (BlockManager.getBlockByType(BasicType.PAGE)?.create({}) as Record<string, unknown>) ?? {
    type: BasicType.PAGE,
    data: { value: {} },
    attributes: {},
    children: [],
  };

function getDefaultData() {
  return {
    subject: '',
    subTitle: '',
    content: defaultContent,
  };
}

function parseInitialData(initialJson: string | null | undefined) {
  if (!initialJson || typeof initialJson !== 'string') return getDefaultData();
  try {
    const parsed = JSON.parse(initialJson) as { subject?: string; subTitle?: string; content?: unknown };
    if (parsed && typeof parsed === 'object' && parsed.content) {
      return {
        subject: parsed.subject ?? '',
        subTitle: parsed.subTitle ?? '',
        content: parsed.content,
      };
    }
  } catch {
    // ignore
  }
  return getDefaultData();
}

const EmailTemplateEditor = forwardRef<EmailTemplateEditorRef, EmailTemplateEditorProps>(
  function EmailTemplateEditor({ initialJson, templateKey, className, fullHeight }, ref) {
    const valuesRef = useRef<{ content: unknown; subject: string; subTitle: string }>(getDefaultData());

    useImperativeHandle(
      ref,
      () => ({
        getHtml: () => {
          try {
            const mjmlStr = JsonToMjml({
              data: valuesRef.current.content as Parameters<typeof JsonToMjml>[0]['data'],
              mode: 'production',
            });
            const result = mjml(mjmlStr as string);
            return (result as { html?: string })?.html ?? '';
          } catch (e) {
            console.warn('EmailTemplateEditor getHtml:', e);
            return '';
          }
        },
        getJson: () => JSON.stringify(valuesRef.current),
        getInlinedHtml: () => {
          try {
            const mjmlStr = JsonToMjml({
              data: valuesRef.current.content as Parameters<typeof JsonToMjml>[0]['data'],
              mode: 'production',
            });
            const result = mjml(mjmlStr as string);
            return (result as { html?: string })?.html ?? '';
          } catch (e) {
            console.warn('EmailTemplateEditor getInlinedHtml:', e);
            return '';
          }
        },
      }),
      []
    );

    const initialData = parseInitialData(initialJson);

    return (
      <div className={className} style={fullHeight ? { minHeight: 0, height: '100%' } : { minHeight: 420 }}>
        <EmailEditorProvider
          key={templateKey ?? 'default'}
          data={initialData as Parameters<typeof EmailEditorProvider>[0]['data']}
          height={fullHeight ? '100%' : '400px'}
        >
          {({ values }) => {
            valuesRef.current = {
              content: values.content,
              subject: values.subject ?? '',
              subTitle: values.subTitle ?? '',
            };
            return <EmailEditor />;
          }}
        </EmailEditorProvider>
      </div>
    );
  }
);

export default EmailTemplateEditor;
