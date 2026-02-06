"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

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
      initialEditType: "markdown",
      previewStyle: "vertical",
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
      className={`rounded border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 ${isDark ? "toastui-editor-dark" : ""}`}
    />
  );
}
