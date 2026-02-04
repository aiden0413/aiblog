"use client";

import { Component, createRef } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

interface MarkdownEditorProps {
  text: string;
  /** true: 편집 가능, false: 읽기 전용 뷰어 (기본값: true) */
  editable?: boolean;
  /** 에디터 높이 (기본값: "400px") */
  height?: string;
  /** 최소 높이 */
  minHeight?: string;
}

export class MarkdownEditor extends Component<MarkdownEditorProps> {
  private containerRef = createRef<HTMLDivElement>();
  private editor: ReturnType<typeof Editor.factory> | null = null;

  componentDidMount() {
    this.initEditor();
  }

  componentDidUpdate(prevProps: MarkdownEditorProps) {
    const { editable = true } = this.props;
    if (prevProps.text !== this.props.text && this.editor && !editable) {
      this.editor.setMarkdown(this.props.text);
    }
  }

  componentWillUnmount() {
    this.editor?.destroy();
    this.editor = null;
  }

  private initEditor() {
    if (!this.containerRef.current) return;

    const { text, editable = true, height = "400px", minHeight } = this.props;

    this.editor = Editor.factory({
      el: this.containerRef.current,
      initialValue: text,
      viewer: !editable,
      height,
      minHeight,
      initialEditType: "markdown",
      previewStyle: "vertical",
    });
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        className="rounded border border-zinc-200 bg-white p-4"
      />
    );
  }
}
