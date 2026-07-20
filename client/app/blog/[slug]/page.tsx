"use client";
import { useEffect, useMemo, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaEye,
  FaComment,
  FaChevronRight,
  FaHome,
} from "react-icons/fa";
import PublicHeader from "@/components/PublicHeader";
import SearchBar from "@/components/SearchBar";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Blog } from "@/types/types";
import {
  getBlogBySlug,
  getBlogs,
  addComment,
  toggleLike,
  incrementView,
} from "@/api/blogApi";

export default function BlogDetail() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [query, setQuery] = useState("");

  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);

  const { slug } = useParams();

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  useEffect(() => {
    const account = user || admin;

    if (!blog || !account) return;

    const alreadyLiked = blog.likes.some((like: any) => {
      if (!like?.user) return false;
      return like.user.toString() === account._id.toString();
    });

    setLiked(alreadyLiked);
  }, [blog, user, admin]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBlog = async () => {
    if (!slug) return;

    const data = await getBlogBySlug(slug as string);
    console.log("BLOG =>", data.blog);
    console.log("LIKES =>", data.blog.likes);

    setBlog(data.blog);

    const key = `view-${data.blog._id}`;

    if (!sessionStorage.getItem(key)) {
      const res = await incrementView(data.blog._id);

      setBlog((prev) =>
        prev
          ? {
              ...prev,
              views: res.views,
            }
          : prev,
      );

      sessionStorage.setItem(key, "true");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const handleLike = async () => {
    const account = user || admin;

    if (!account) {
      router.push("/login");
      return;
    }

    if (!blog) return;

    try {
      const data = await toggleLike(blog._id);

      setLiked(data.liked);

      await fetchBlog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      const data = await addComment(blog!._id, commentText);

      setBlog((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: data.comments,
        };
      });

      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  const related = blogs
    .filter(
      (b) =>
        b._id !== blog?._id && b.tags.some((tag) => blog?.tags.includes(tag)),
    )
    .slice(0, 3);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Blog not found
          </h1>
          <Link
            href="/"
            className="mt-4 inline-block text-indigo-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {blog.banner && (
        <div className="w-full">
          <img
            src={blog.banner}
            alt=""
            className="h-64 w-full object-cover md:h-96"
          />
        </div>
      )}

      <article className="mx-auto max-w-3xl px-4 py-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-gray-500"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-indigo-600"
          >
            <FaHome /> Home
          </Link>
          <FaChevronRight className="opacity-60" />
          <Link href="/" className="hover:text-indigo-600">
            Blog
          </Link>
          <FaChevronRight className="opacity-60" />
          <span className="truncate text-gray-700">{blog.title}</span>
        </nav>

        <div className="mb-3 flex flex-wrap gap-2">
          {blog.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
            >
              #{t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
          {blog.title}
        </h1>
        <p className="mt-3 text-lg text-gray-600">{blog.description}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4">
          <div className="flex items-center gap-3">
            <img
              src={blog.author.avatar}
              alt=""
              className="h-10 w-10 rounded-full"
            />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {blog.author.name}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <FaEye /> {blog.views}
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${liked ? "bg-rose-50 text-rose-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {liked ? <FaHeart /> : <FaRegHeart />} {blog.likes.length}
            </button>
            <span className="flex items-center gap-1.5">
              <FaComment /> {blog.comments.length}
            </span>
          </div>
        </div>

        {blog.content.length > 0 && (
          <aside className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Table of contents
            </div>
            <ol className="space-y-1.5 text-sm">
              {blog.content.slice(1).map((t, i) => (
                <li key={t._id}>
                  <a
                    href={`#${t._id}`}
                    onClick={() => {
                      document.getElementById(t._id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    {i + 1}. {t.heading}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        )}

        <div className="mt-6">
          <div className="space-y-8">
            {blog.content.map((item) => (
              <div key={item._id} id={item._id}>
                {item.heading && (
                  <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    {item.heading}
                  </h2>
                )}

                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-indigo-600"
                  dangerouslySetInnerHTML={{
                    __html: item.content,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-start gap-4">
            <img
              src={blog.author.avatar}
              alt=""
              className="h-14 w-14 rounded-full"
            />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Written by {blog.author.name}
              </div>
              <p className="mt-1 text-sm text-gray-600">{blog.author.bio}</p>
            </div>
          </div>
        </section>

        <section id="comments" className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments ({blog.comments.length})
          </h2>
          {user || admin ? (
            <form className="mt-4" onSubmit={handleComment}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts…"
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Post comment
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-3 rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:underline"
              >
                Sign in
              </Link>{" "}
              to join the conversation.
            </p>
          )}

          <ul className="mt-6 space-y-4">
            {blog.comments
              .slice()
              .reverse()
              .map((c) => (
                <li key={c._id} className="flex gap-3">
                  <img
                    src={c.user.avatar}
                    alt={c.user.name}
                    className="h-9 w-9 rounded-full"
                  />
                  <div className="flex-1 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {c.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{c.comment}</p>
                  </div>
                </li>
              ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-gray-900">
              Related reading
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 rounded-2xl bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Browse more</h3>
          <div className="mt-3">
            <SearchBar initial={query} onSubmit={setQuery} />
          </div>
        </section>
      </article>
    </div>
  );
}
