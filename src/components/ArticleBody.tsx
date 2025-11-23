'use client';

import DOMPurify from "dompurify";
import { marked } from "marked";

type Props = { content?: string | null };

export default function ArticleBody({ content }: Props) {
  if (!content) return null;
  const raw = content ?? "";
  const hasHTML = /<\/?[a-z][\s\S]*>/i.test(raw.trim());

  const parsed = hasHTML
    ? raw
    : (marked.parse(raw.replace(/\r\n/g, "\n"), { async: false }) as string);

  const clean = DOMPurify.sanitize(parsed, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel", "allow", "allowfullscreen", "frameborder"],
    ADD_TAGS: ["iframe", "video", "source"],
  });

  return (
    <div
      className="prose prose-slate max-w-none leading-relaxed prose-a:text-primary"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
