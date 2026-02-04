declare module "@toast-ui/editor" {
  interface EditorOptions {
    el: HTMLElement;
    initialValue?: string;
    viewer?: boolean;
    height?: string;
    minHeight?: string;
    initialEditType?: "markdown" | "wysiwyg";
    previewStyle?: "vertical" | "tab";
  }

  interface EditorInstance {
    setMarkdown(markdown: string): void;
    getMarkdown(): string;
    destroy(): void;
  }

  export default class Editor {
    static factory(options: EditorOptions): EditorInstance;
  }
}
