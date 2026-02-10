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

interface MarkdownEditorProps {
  text: string;
  /** true: 편집 가능, false: 읽기 전용 뷰어 (기본값: true) */
  editable?: boolean;
  /** 에디터 높이 (기본값: "400px") */
  height?: string;
  /** 최소 높이 */
  minHeight?: string;
}

export function MarkdownEditor({
  text,
  editable = true,
  height = "400px",
  minHeight,
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReturnType<typeof Editor.factory> | null>(null);
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

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []); // editor는 마운트 시 한 번만 초기화

  useEffect(() => {
    if (editorRef.current && !editable && text !== undefined) {
      editorRef.current.setMarkdown(text);
    }
  }, [text, editable]);

  return (
    <div
      ref={containerRef}
      className={`min-w-0 overflow-x-hidden rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 ${isDark ? "toastui-editor-dark" : ""}`}
    />
  );
}
