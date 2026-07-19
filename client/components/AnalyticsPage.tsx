"use client";
import { useEffect, useState } from "react";
import { getBlogs } from "@/api/blogApi";
import { Blog } from "@/types/types";
import Link from "next/link";
import {
  FaBookOpen,
  FaEye,
  FaHeart,
  FaComment,
  FaTrophy,
} from "react-icons/fa";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 text-xl">
          <Icon />
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-semibold text-gray-900">
            {value.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

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
  const totalViews = blogs.reduce((n, b) => n + b.views, 0);
  const totalLikes = blogs.reduce((n, b) => n + b.likes.length, 0);
  const totalComments = blogs.reduce((n, b) => n + b.comments.length, 0);
  const ranked = blogs.slice().sort((a, b) => b.views - a.views);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">
            Overview of your blog's performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={FaBookOpen} label="Total blogs" value={blogs.length} />
        <StatCard icon={FaEye} label="Total views" value={totalViews} />
        <StatCard icon={FaHeart} label="Total likes" value={totalLikes} />
        <StatCard
          icon={FaComment}
          label="Total comments"
          value={totalComments}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
          <FaTrophy className="text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Top blogs by views
          </h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {ranked.map((b, i) => (
            <li key={b._id} className="flex items-center gap-4 px-5 py-3">
              <span className="w-6 text-sm font-semibold text-gray-500">
                {i + 1}
              </span>
              {b.thumbnail && (
                <img
                  src={b.thumbnail}
                  alt=""
                  className="h-10 w-14 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/blog/${b.slug}`}
                  className="block truncate text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  {b.title}
                </Link>
                <div className="text-xs text-gray-500">{b.category}</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaEye /> {b.views}
                </span>
                <span className="flex items-center gap-1">
                  <FaHeart /> {b.likes.length}
                </span>
                <span className="flex items-center gap-1">
                  <FaComment /> {b.comments.length}
                </span>
              </div>
            </li>
          ))}
          {ranked.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-gray-500">
              No blogs yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
