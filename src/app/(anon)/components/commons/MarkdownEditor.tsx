"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

function scheduleEditorBlur(editor: ReturnType<typeof Editor.factory> | null): void {
  if (!editor || !("blur" in editor) || typeof editor.blur !== "function") return;
  
  // 즉시 blur 시도 (requestAnimationFrame으로 다음 프레임에서 실행)
  requestAnimationFrame(() => {
    try {
      (editor as { blur: () => void }).blur();
    } catch {
      // 에디터가 아직 완전히 초기화되지 않은 경우 무시
    }
  });
  
  // 추가 안전장치: 다음 이벤트 루프에서도 blur (포커스가 이미 간 경우 대비)
  setTimeout(() => {
    try {
      (editor as { blur: () => void }).blur();
    } catch {
      // 무시
    }
  }, 0);
}

interface MarkdownEditorProps {
  text: string;
  /** true: 편집 모드, false: 읽기 전용 뷰어. 기본값 true. */
  editable?: boolean;
  /** 에디터 영역 높이. 기본값 "400px". */
  height?: string;
  /** 에디터 영역 최소 높이. */
  minHeight?: string;
  /** 에디터가 마운트·초기화된 후 호출됨 (스켈레톤 해제용) */
  onReady?: () => void;
}

export function MarkdownEditor({
  text,
  editable = true,
  height = "400px",
  minHeight,
  onReady,
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReturnType<typeof Editor.factory> | null>(null);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = Editor.factory({
      el: containerRef.current,
      initialValue: text,
      viewer: !editable,
      height,
      minHeight,
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
    });
    editorRef.current = editor;

    if (editable) scheduleEditorBlur(editor);

    onReadyRef.current?.();

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [text]); /* Editor 인스턴스는 마운트 시 한 번만 초기화. */

  return (
    <div
      ref={containerRef}
      className={`min-w-0 overflow-x-hidden rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 ${isDark ? "toastui-editor-dark" : ""}`}
    />
  );
}
