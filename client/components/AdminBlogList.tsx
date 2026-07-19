"use client";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Link from "next/link";
import { deleteBlog, getBlogs } from "@/api/blogApi";
import { Blog } from "@/types/types";

type SortMode = "newest" | "oldest" | "az";

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortMode>("newest");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data.blogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [query, category, sort]);

  const filteredBlogs = useMemo(() => {
    let filtered = [...blogs];

    if (query.trim()) {
      const search = query.toLowerCase();

      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search) ||
          blog.slug.toLowerCase().includes(search),
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((blog) => blog.category === category);
    }

    if (sort === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sort === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sort === "az") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [blogs, query, category, sort]);

  const pageCount = Math.ceil(filteredBlogs.length / perPage);

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return filteredBlogs.slice(start, end);
  }, [filteredBlogs, page, perPage]);

  console.log("pagin", paginatedBlogs);

  const categories = useMemo(() => {
    return [...new Set(blogs.map((blog) => blog.category))];
  }, [blogs]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      await deleteBlog(id);

      // Option 1 (Recommended)
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));

      // OR Option 2
      // fetchBlogs();
    } catch (error) {
      console.error(error);
      alert("Failed to delete blog");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-sm text-gray-500">Manage all blog posts.</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <FaPlus /> New blog
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <SearchBar
            onSubmit={(q) => {
              setQuery(q);
              //   setPage(1);
            }}
            placeholder="Search & press Enter…"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            // setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A – Z</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Likes</th>
              <th className="px-4 py-3">Comments</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedBlogs.map((b) => (
              <tr className="hover:bg-gray-50" key={b._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {b.thumbnail && (
                      <img
                        src={b.thumbnail}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{b.title}</div>
                      <div className="text-xs text-gray-500">/{b.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{b.category}</td>
                <td className="px-4 py-3 text-gray-700">{b.views}</td>
                <td className="px-4 py-3 text-gray-700">{b.likes.length}</td>
                <td className="px-4 py-3 text-gray-700">{b.comments.length}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/blog/${b.slug}`}
                      className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                      title="View"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/blogs/${b.slug}/edit`}
                      className="rounded-md p-2 text-indigo-600 hover:bg-indigo-50"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="rounded-md p-2 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedBlogs.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No blogs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Per page:</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="ml-2 text-gray-500">
            Showing {"items.length"} of {"filtered.length"}
          </span>
        </div>
        {/* <Pagination page={0} pageCount={5} onChange={5} /> */}
      </div>
    </div>
  );
}
