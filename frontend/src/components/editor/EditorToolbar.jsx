import { useState, useCallback } from "react";
import {
  Bold, Italic, Underline, Strikethrough, Highlighter,
  Heading1, Heading2, Heading3, Type,
  List, ListOrdered, Quote,
  Code, Code2, Link, Image, Table, Minus,
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo,
  ChevronDown,
} from "lucide-react";

function ToolBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
      disabled={disabled}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded transition-colors text-xs flex-shrink-0 ${
        active
          ? "bg-[#002FA7] text-white"
          : "text-slate-400 hover:text-white hover:bg-slate-700/60"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-700/80 mx-0.5 flex-shrink-0" />;
}

export default function EditorToolbar({ editor, onInsertImage }) {
  const [headingOpen, setHeadingOpen] = useState(false);

  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", prev || "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  const currentHeading = editor.isActive("heading", { level: 1 })
    ? "H1"
    : editor.isActive("heading", { level: 2 })
    ? "H2"
    : editor.isActive("heading", { level: 3 })
    ? "H3"
    : "P";

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-800 bg-[#0c0f17] rounded-t-xl overflow-x-auto">
      {/* Undo / Redo */}
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (⌘Z)">
        <Undo className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (⌘⇧Z)">
        <Redo className="w-3.5 h-3.5" />
      </ToolBtn>

      <Divider />

      {/* Heading picker */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setHeadingOpen((o) => !o); }}
          className="h-7 flex items-center gap-1 px-2 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          title="Text style"
        >
          <span className="font-medium w-5 text-center">{currentHeading}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
        {headingOpen && (
          <div className="absolute top-full left-0 mt-1 bg-[#1a1f2e] border border-slate-700 rounded-lg shadow-xl z-50 py-1 min-w-[140px]">
            {[
              { label: "Normal Text", icon: <Type className="w-3.5 h-3.5" />, action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
              { label: "Heading 1", icon: <Heading1 className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
              { label: "Heading 2", icon: <Heading2 className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
              { label: "Heading 3", icon: <Heading3 className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
            ].map(({ label, icon, action, active }) => (
              <button
                key={label}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); action(); setHeadingOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors ${
                  active ? "text-white bg-[#002FA7]/30" : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* Inline formatting */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (⌘B)">
        <Bold className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (⌘I)">
        <Italic className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (⌘U)">
        <Underline className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <Strikethrough className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
        <Highlighter className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
        <Code className="w-3.5 h-3.5" />
      </ToolBtn>

      <Divider />

      {/* Text alignment */}
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
        <AlignLeft className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
        <AlignCenter className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
        <AlignRight className="w-3.5 h-3.5" />
      </ToolBtn>

      <Divider />

      {/* Block elements */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
        <List className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <Quote className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
        <Code2 className="w-3.5 h-3.5" />
      </ToolBtn>

      <Divider />

      {/* Insert */}
      <ToolBtn onClick={setLink} active={editor.isActive("link")} title="Insert / edit link">
        <Link className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={onInsertImage} title="Insert image">
        <Image className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={insertTable} active={editor.isActive("table")} title="Insert table">
        <Table className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
        <Minus className="w-3.5 h-3.5" />
      </ToolBtn>

      {/* Table controls (visible only when cursor is inside a table) */}
      {editor.isActive("table") && (
        <>
          <Divider />
          <span className="text-xs text-slate-600 px-1">Table:</span>
          {[
            { label: "+Col →", action: () => editor.chain().focus().addColumnAfter().run() },
            { label: "+Row ↓", action: () => editor.chain().focus().addRowAfter().run() },
            { label: "−Col",   action: () => editor.chain().focus().deleteColumn().run() },
            { label: "−Row",   action: () => editor.chain().focus().deleteRow().run() },
            { label: "Del",    action: () => editor.chain().focus().deleteTable().run() },
          ].map(({ label, action }) => (
            <button
              key={label}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); action(); }}
              className="h-6 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700/60 rounded transition-colors"
            >
              {label}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
