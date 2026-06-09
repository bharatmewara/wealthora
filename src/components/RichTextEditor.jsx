import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Highlight } from '@tiptap/extension-highlight';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import ColorPickerPopover from '../admin/components/ColorPickerPopover';

import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, SquareTerminal, Link2, Image as ImageIcon,
  Undo, Redo, Highlighter, CheckSquare, Youtube as YoutubeIcon,
  Table as TableIcon, Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Minus
} from 'lucide-react';

const btn = (active) =>
  `flex items-center justify-center rounded p-1.5 text-sm font-medium transition ${
    active
      ? 'bg-sky-100 text-sky-700'
      : 'bg-transparent text-slate-600 hover:bg-slate-100'
  }`;

function ToolbarButton({ onClick, active, title, icon: Icon, children }) {
  return (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }} className={btn(active)} title={title}>
      {Icon ? <Icon size={16} /> : children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px self-center bg-slate-200" />;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write your amazing content here...' }) {
  const [colorHex, setColorHex] = useState('#000000');

  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-sky-600 underline cursor-pointer' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, HTMLAttributes: { class: 'rounded-xl mx-auto border border-slate-200 shadow-sm' } }),
      Placeholder.configure({ placeholder }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Youtube.configure({ inline: false, HTMLAttributes: { class: 'w-full aspect-video rounded-xl shadow-sm' } }),
      Table.configure({ resizable: true, HTMLAttributes: { class: 'w-full text-left border-collapse border border-slate-300' } }),
      TableRow,
      TableHeader.configure({ HTMLAttributes: { class: 'border border-slate-300 bg-slate-50 p-2 font-bold' } }),
      TableCell.configure({ HTMLAttributes: { class: 'border border-slate-300 p-2' } }),
      Subscript,
      Superscript,
      TextStyle,
      Color,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL', editor.getAttributes('link').href || 'https://');
    if (url === null) return;
    if (url === '') editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    // Trigger hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      // Clear input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const addYoutube = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const handleColorChange = (hex) => {
    setColorHex(hex);
    editor.chain().focus().setColor(hex).run();
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {/* Primary Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2">
        {/* Paragraph / Headings */}
        <select
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1'
            : editor.isActive('heading', { level: 2 }) ? 'h2'
            : editor.isActive('heading', { level: 3 }) ? 'h3'
            : editor.isActive('heading', { level: 4 }) ? 'h4'
            : 'p'
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: Number(v[1]) }).run();
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none focus:border-sky-500"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <Divider />

        {/* Inline formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold" icon={Bold} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic" icon={Italic} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline" icon={UnderlineIcon} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough" icon={Strikethrough} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight" icon={Highlighter} />
        
        {/* Text Color Picker */}
        <div className="ml-1 mr-1 flex items-center justify-center">
          <ColorPickerPopover color={colorHex} onChange={handleColorChange} title="Text Color" />
        </div>

        <Divider />

        {/* Script styles */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Subscript" icon={SubscriptIcon} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Superscript" icon={SuperscriptIcon} />

        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left" icon={AlignLeft} />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center" icon={AlignCenter} />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right" icon={AlignRight} />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify" icon={AlignJustify} />
      </div>

      {/* Secondary Toolbar (Blocks, Lists, Media) */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 px-2 py-1.5">
        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list" icon={List} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list" icon={ListOrdered} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task list" icon={CheckSquare} />

        <Divider />

        {/* Block elements */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote" icon={Quote} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code" icon={Code} />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block" icon={SquareTerminal} />
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal rule" icon={Minus} />

        <Divider />

        {/* Tables */}
        <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} active={editor.isActive('table')} title="Insert Table" icon={TableIcon} />
        
        <Divider />

        {/* Links & Media */}
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Insert link" icon={Link2} />
        <ToolbarButton onClick={addImage} active={editor.isActive('image')} title="Insert image" icon={ImageIcon} />
        <ToolbarButton onClick={addYoutube} active={editor.isActive('youtube')} title="Insert YouTube" icon={YoutubeIcon} />

        <div className="ml-auto flex items-center gap-1">
          {/* Undo / Redo */}
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo" icon={Undo} />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo" icon={Redo} />
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-slate prose-sky max-w-none px-6 py-5 text-sm focus-within:outline-none min-h-[300px] 
            [&_.ProseMirror]:outline-none 
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400 
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] 
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none 
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left 
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0
            [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:p-0
            [&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:gap-2 [&_li[data-type=taskItem]]:items-start
            [&_li[data-type=taskItem]>label]:mt-1 [&_li[data-type=taskItem]>label>input]:cursor-pointer
            [&_li[data-type=taskItem][data-checked=true]>div]:line-through [&_li[data-type=taskItem][data-checked=true]>div]:text-slate-400
            [&_table]:border-collapse [&_table]:w-full [&_table]:m-0
            [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_td]:relative
            [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_th]:bg-slate-50 [&_th]:font-bold [&_th]:relative
          "
        />
      </div>
    </div>
  );
}
