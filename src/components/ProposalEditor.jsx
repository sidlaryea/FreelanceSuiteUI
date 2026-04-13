import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

const Divider = () => (
  <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />
);

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors flex-shrink-0
        ${active
          ? "bg-blue-100 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
        }`}
    >
      {children}
    </button>
  );
}

const Icons = {
  bold: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 4h8a4 4 0 010 8H6z"/><path d="M6 12h9a4 4 0 010 8H6z"/>
    </svg>
  ),
  italic: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/>
      <line x1="15" y1="4" x2="9" y2="20"/>
    </svg>
  ),
  underline: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 3v7a6 6 0 0012 0V3"/><line x1="4" y1="21" x2="20" y2="21"/>
    </svg>
  ),
  strike: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <path d="M16 6C16 6 14.5 4 12 4C9.5 4 7 5.5 7 8C7 10.3 9 11.3 12 12C15 12.7 17 13.8 17 16C17 18.2 14.8 20 12 20C9.2 20 7 18 7 18"/>
    </svg>
  ),
  bulletList: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  orderedList: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
      <path d="M4 6h1V3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <path d="M3 9h2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 14h2v-1.5L3 14v.5h2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M3 19h2" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  blockquote: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  ),
  code: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  link: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  alignLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/>
    </svg>
  ),
  alignCenter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/>
    </svg>
  ),
  alignRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/>
    </svg>
  ),
  undo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 7v6h6"/><path d="M3 13A9 9 0 1021 12"/>
    </svg>
  ),
  redo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 7v6h-6"/><path d="M21 13A9 9 0 113 12"/>
    </svg>
  ),
};

export default function ProposalEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content || "<p>Start writing your proposal...</p>",
    editable: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  const handleLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── STICKY TOOLBAR ───────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-1">

        {/* Text style */}
        <select
          value={
            editor.isActive("heading", { level: 1 }) ? "h1"
            : editor.isActive("heading", { level: 2 }) ? "h2"
            : editor.isActive("heading", { level: 3 }) ? "h3"
            : "p"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: Number(val[1]) }).run();
          }}
          className="h-8 text-xs border border-slate-200 rounded-md px-2 bg-white text-slate-700 cursor-pointer hover:border-slate-300 transition-colors focus:outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <Divider />

        {/* Inline formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (⌘B)">
          {Icons.bold}
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (⌘I)">
          {Icons.italic}
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (⌘U)">
          {Icons.underline}
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          {Icons.strike}
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          {Icons.code}
        </ToolbarBtn>

        <Divider />

        {/* Lists & blocks */}
        <ToolbarBtn onClick={() => {
            console.log('Bullet list clicked', editor.isActive('bulletList'));
            editor.chain().focus().toggleBulletList().run();
          }} active={editor.isActive("bulletList")} title="Bullet list">
          {Icons.bulletList}
        </ToolbarBtn>

        <ToolbarBtn onClick={() => {
            console.log('Ordered list clicked', editor.isActive('orderedList'));
            editor.chain().focus().toggleOrderedList().run();
          }} active={editor.isActive("orderedList")} title="Numbered list">
          {Icons.orderedList}
        </ToolbarBtn>

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          {Icons.blockquote}
        </ToolbarBtn>
        <ToolbarBtn onClick={handleLink} active={editor.isActive("link")} title="Insert link">
          {Icons.link}
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
          {Icons.alignLeft}
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
          {Icons.alignCenter}
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
          {Icons.alignRight}
        </ToolbarBtn>

        {/* Push undo/redo to the right */}
        <div className="flex-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo (⌘Z)">
          {Icons.undo}
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo (⌘⇧Z)">
          {Icons.redo}
        </ToolbarBtn>
      </div>

      {/* ── EDITOR BODY ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-white px-10 py-8">
        <EditorContent
          editor={editor}
          className="
            min-h-[520px] outline-none
  prose prose-slate max-w-none

  prose-ul:list-disc prose-ul:pl-6
  prose-ol:list-decimal prose-ol:pl-6

  prose-li:pl-1
  prose-li:my-1

  prose-headings:font-semibold
  prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
  prose-p:leading-relaxed prose-p:text-slate-700
  prose-a:text-blue-600 prose-a:underline

  [&_.ProseMirror_ul]:list-disc
  [&_.ProseMirror_ol]:list-decimal
  [&_.ProseMirror_ul]:pl-6
  [&_.ProseMirror_ol]:pl-6

  [&_.ProseMirror]:outline-none
  [&_.ProseMirror]:min-h-[520px]

          "
        />
      </div>
    </div>
  );
}