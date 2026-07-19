"use client";
import { useEffect, useMemo, useState } from "react";
import { FaSave, FaEye } from "react-icons/fa";
import RichEditor from "./RichEditor";
import { CreateBlogPayload } from "@/types/types";
import { createBlog, updateBlog } from "@/api/blogApi";

const emptyBlog: CreateBlogPayload = {
  title: "",
  slug: "",
  description: "",

  content: [],

  thumbnail: "",
  banner: "",

  seoTitle: "",
  seoDescription: "",

  canonical: "",
  schemaMarkup: "",

  tags: [],

  category: "",

  author: {
    name: "",
    bio: "",
    avatar: "",
  },
};

export default function BlogForm({ initial }: any) {
  const [blog, setBlog] = useState<CreateBlogPayload>(initial ?? emptyBlog);
  const [editorHtml, setEditorHtml] = useState("");
  const [customSlug, setCustomSlug] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sections = htmlToContentArray(editorHtml);

    setBlog((prev: any) => ({
      ...prev,
      content: sections,
    }));
  }, [editorHtml]);

  useEffect(() => {
    if (!initial) return;

    setBlog(initial);

    setTagsInput(initial.tags.join(", "));

    const html = initial.content
      .map((item: any) => {
        const heading = item.heading ? `<h2>${item.heading}</h2>` : "";

        return heading + item.content;
      })
      .join("");

    setEditorHtml(html);
  }, [initial]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const setField = (field: keyof CreateBlogPayload, value: any) => {
    setBlog((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === "title" && !customSlug) {
        updated.slug = slugify(value);
      }

      return updated;
    });
  };

  const setAuthorField = (field: "name" | "bio" | "avatar", value: string) => {
    setBlog((prev) => ({
      ...prev,

      author: {
        ...prev.author,

        [field]: value,
      },
    }));
  };

  const htmlToContentArray = (html: string) => {
    const parser = new DOMParser();

    const doc = parser.parseFromString(html, "text/html");

    const sections = [];

    let current = {
      heading: "",
      content: "",
    };

    Array.from(doc.body.children).forEach((el) => {
      if (el.tagName === "H2") {
        if (current.content.trim()) {
          sections.push(current);
        }

        current = {
          heading: el.textContent || "",
          content: "",
        };
      } else {
        current.content += el.outerHTML;
      }
    });

    if (current.content.trim()) {
      sections.push(current);
    }

    return sections;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!blog.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!editorHtml.trim()) {
      setError("Content is required.");
      return;
    }

    try {
      setLoading(true);

      const payload: CreateBlogPayload = {
        ...blog,
        tags: tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        content: htmlToContentArray(editorHtml) as any,
      };

      if (initial?._id) {
        await updateBlog(initial._id, payload);
        alert("Blog Updated Successfully");
      } else {
        await createBlog(payload);
        alert("Blog Created Successfully");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {initial ? "Edit blog" : "New blog"}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            <FaEye /> {preview ? "Editor" : "Preview"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <FaSave /> {loading ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Field label="Title">
            <input
              value={blog.title}
              onChange={(e) => setField("title", e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="URL slug">
            <div className="flex items-center gap-3">
              <input
                value={blog.slug}
                onChange={(e) => setField("slug", slugify(e.target.value))}
                disabled={!customSlug}
                className={
                  inputCls + (customSlug ? "" : " bg-gray-50 text-gray-500")
                }
              />

              <label className="flex shrink-0 items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={customSlug}
                  onChange={(e) => setCustomSlug(e.target.checked)}
                />
                Custom slug
              </label>
            </div>
          </Field>

          <Field label="Short description">
            <textarea
              value={blog.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>

          <Field label="Content">
            {preview ? (
              <div
                className="prose-content min-h-[400px] rounded-lg border border-gray-200 bg-white p-6"
                dangerouslySetInnerHTML={{
                  __html: editorHtml,
                }}
              />
            ) : (
              <RichEditor value={editorHtml} onChange={setEditorHtml} />
            )}
            {blog.content.length > 0 && (
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Auto Table of Contents ({blog.content.length} H2s)
                </div>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                  {blog.content
                    .filter((item) => item.heading)
                    .map((item) => (
                      <li key={item.heading}>{item.heading}</li>
                    ))}
                </ul>
              </div>
            )}
          </Field>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Media
            </h3>
            <Field label="Thumbnail URL">
              <input
                value={blog.thumbnail}
                onChange={(e) => setField("thumbnail", e.target.value)}
                className={inputCls}
              />
            </Field>
            {blog.thumbnail && (
              <img
                src={blog.thumbnail}
                alt=""
                className="mt-2 aspect-video w-full rounded-md object-cover"
              />
            )}
            <Field label="Banner URL">
              <input
                value={blog.banner}
                onChange={(e) => setField("banner", e.target.value)}
                className={inputCls}
              />
            </Field>
            {blog.banner && (
              <img
                src={blog.banner}
                alt=""
                className="mt-2 aspect-[3/1] w-full rounded-md object-cover"
              />
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Categorization
            </h3>
            <Field label="Category">
              <input
                type="text"
                value={blog.category}
                onChange={(e) => setField("category", e.target.value)}
                className={inputCls}
                placeholder="e.g. Development"
              />
            </Field>
            <Field label="Tags (comma separated)">
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className={inputCls}
                placeholder="react, tutorial"
              />
            </Field>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              SEO
            </h3>
            <Field label="SEO title">
              <input
                value={blog.seoTitle}
                onChange={(e) => setField("seoTitle", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="SEO description">
              <textarea
                value={blog.seoDescription}
                onChange={(e) => setField("seoDescription", e.target.value)}
                rows={2}
                className={inputCls}
              />
            </Field>
            <Field label="Canonical URL">
              <input
                value={blog.canonical}
                onChange={(e) => setField("canonical", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Schema markup (JSON-LD)">
              <textarea
                value={blog.schemaMarkup}
                onChange={(e) => setField("schemaMarkup", e.target.value)}
                rows={4}
                className={inputCls + " font-mono text-xs"}
              />
            </Field>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Author
            </h3>
            <Field label="Author name">
              <input
                value={blog.author.name}
                onChange={(e) => setAuthorField("name", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Author bio">
              <input
                value={blog.author.bio}
                onChange={(e) => setAuthorField("bio", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Author avatar URL">
              <input
                value={blog.author.avatar}
                onChange={(e) => setAuthorField("avatar", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}
