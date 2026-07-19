"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaCode,
  FaHeading,
  FaQuoteRight,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState(value);

  useEffect(() => {
    if (showCode) {
      setCode(value);
      return;
    }

    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value, showCode]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const html = e.clipboardData.getData("text/html");
    if (html) {
      e.preventDefault();
      const clean = html
        .replace(/<meta[^>]*>/gi, "")
        .replace(/<b(\s+id="docs-internal-guid-[^"]*")?>/gi, "<span>")
        .replace(/<\/b>/gi, "</span>")
        .replace(/ style="[^"]*"/gi, "");
      document.execCommand("insertHTML", false, clean);
      if (ref.current) onChange(ref.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt("Image URL:");
    if (url) exec("insertImage", url);
  };

  const insertLink = () => {
    const url = prompt("Link URL:");
    if (url) exec("createLink", url);
  };

  const toggleCode = () => {
    if (!showCode) {
      const html = ref.current?.innerHTML || "";
      setCode(html);
      setShowCode(true);
    } else {
      onChange(code);
      setShowCode(false);

      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.innerHTML = code;
        }
      });
    }
  };

  const Btn = ({ onClick, title, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded p-2 text-gray-700 hover:bg-gray-200"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-gray-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <Btn onClick={() => exec("bold")} title="Bold">
          <FaBold />
        </Btn>
        <Btn onClick={() => exec("italic")} title="Italic">
          <FaItalic />
        </Btn>
        <Btn onClick={() => exec("underline")} title="Underline">
          <FaUnderline />
        </Btn>
        <span className="mx-1 h-6 w-px bg-gray-300" />
        <Btn onClick={() => exec("formatBlock", "<h2>")} title="Heading 2">
          <span className="flex items-center gap-1">
            <FaHeading />
            <span className="text-xs">2</span>
          </span>
        </Btn>
        <Btn onClick={() => exec("formatBlock", "<h3>")} title="Heading 3">
          <span className="flex items-center gap-1">
            <FaHeading />
            <span className="text-xs">3</span>
          </span>
        </Btn>
        <Btn onClick={() => exec("formatBlock", "<p>")} title="Paragraph">
          P
        </Btn>
        <Btn onClick={() => exec("formatBlock", "<blockquote>")} title="Quote">
          <FaQuoteRight />
        </Btn>
        <span className="mx-1 h-6 w-px bg-gray-300" />
        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet List">
          <FaListUl />
        </Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered List">
          <FaListOl />
        </Btn>
        <span className="mx-1 h-6 w-px bg-gray-300" />
        <Btn onClick={insertLink} title="Insert Link">
          <FaLink />
        </Btn>
        <Btn onClick={insertImage} title="Insert Image">
          <FaImage />
        </Btn>
        <span className="mx-1 h-6 w-px bg-gray-300" />
        <Btn onClick={() => exec("undo")} title="Undo">
          <FaUndo />
        </Btn>
        <Btn onClick={() => exec("redo")} title="Redo">
          <FaRedo />
        </Btn>
        <div className="ml-auto">
          <button
            type="button"
            onClick={toggleCode}
            title="View HTML source"
            className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium ${showCode ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaCode /> View Code
          </button>
        </div>
      </div>
      {showCode ? (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-[400px] w-full resize-y bg-gray-900 p-4 font-mono text-sm text-green-200 focus:outline-none"
          spellCheck={false}
        />
      ) : (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            if (ref.current) {
              onChange(ref.current.innerHTML);
            }
          }}
          onBlur={() => {
            if (ref.current) {
              onChange(ref.current.innerHTML);
            }
          }}
          onPaste={handlePaste}
          className="prose-editor min-h-[400px] max-w-none p-4 focus:outline-none"
        />
      )}
    </div>
  );
}
