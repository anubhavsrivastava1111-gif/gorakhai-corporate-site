import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { createLowlight, common } from "lowlight";

import EditorToolbar from "./EditorToolbar";
import ImageInsertModal from "./ImageInsertModal";
import "./tiptap.css";

const lowlight = createLowlight(common);

/**
 * TipTapEditor
 *
 * Props:
 *   content  — HTML string (initial value)
 *   onChange — (html: string) => void — called on every edit
 *   placeholder — string (optional)
 *   minHeight — string (optional, default "400px")
 */
export default function TipTapEditor({
  content = "",
  onChange,
  placeholder = "Start writing your post… Use the toolbar above to format content.",
  minHeight = "400px",
}) {
  const [showImageModal, setShowImageModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // replaced by CodeBlockLowlight
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "ProseMirror",
        style: `min-height: ${minHeight}`,
        "data-testid": "tiptap-editor-canvas",
      },
    },
  });

  // Sync external content changes (e.g. loading from API)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    try {
      if (content !== editor.getHTML()) {
        editor.commands.setContent(content, false);
      }
    } catch (e) {
      // getHTML can throw on initial mount if schema nodes are still initializing
      editor.commands.setContent(content, false);
    }
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInsertImage = (src, alt) => {
    editor?.chain().focus().setImage({ src, alt }).run();
    setShowImageModal(false);
  };

  const wordCount = editor?.storage.characterCount?.words() ?? 0;
  const charCount = editor?.storage.characterCount?.characters() ?? 0;

  return (
    <div
      className="border border-slate-800 rounded-xl overflow-hidden bg-[#0a0b0f]"
      data-testid="tiptap-editor"
    >
      <EditorToolbar editor={editor} onInsertImage={() => setShowImageModal(true)} />

      <div className="overflow-y-auto" style={{ maxHeight: "600px" }}>
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/60 bg-[#0c0f17]">
        <span className="text-xs text-slate-700">
          {wordCount} {wordCount === 1 ? "word" : "words"} · {charCount} characters
        </span>
        <span className="text-xs text-slate-700">HTML</span>
      </div>

      {showImageModal && (
        <ImageInsertModal
          onInsert={handleInsertImage}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
}
