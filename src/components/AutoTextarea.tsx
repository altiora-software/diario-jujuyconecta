// src/components/AutoTextarea.tsx
'use client';

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = React.ComponentProps<typeof Textarea> & {
  minRows?: number;
};

export default function AutoTextarea({ minRows = 1, ...props }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => { resize(); }, [props.value]);

  return (
    <Textarea
      ref={ref}
      rows={minRows}
      onInput={(e) => { props.onInput?.(e as any); resize(); }}
      {...props}
      className={`resize-none ${props.className ?? ""}`}
    />
  );
}
