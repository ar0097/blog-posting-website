"use client";
import { useEffect, useMemo, useState } from "react";
import PublicHeader from "@/components/PublicHeader";
import SearchBar from "@/components/SearchBar";
import BlogCard from "@/components/BlogCard";
import { getBlogs } from "@/api/blogApi";
import { Blog } from "@/types/types";

type SortMode = "newest" | "oldest" | "az";

export default function page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");

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
  }, [blogs, query, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Ideas worth reading.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            Fresh perspectives on design, engineering, and product — from
            writers who ship.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar initial={query} onSubmit={setQuery} />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A – Z</option>
          </select>
        </div>

        {query && (
          <p className="mb-4 text-sm text-gray-600">
            {filteredBlogs.length} result{filteredBlogs.length === 1 ? "" : "s"}{" "}
            for “{query}”
          </p>
        )}

        {filteredBlogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((b) => (
              <BlogCard blog={b} key={b._id} />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-12 border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Inkwell. Built as a frontend assignment.
      </footer>
    </div>
  );
}
