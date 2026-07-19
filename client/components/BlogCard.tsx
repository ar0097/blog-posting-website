import Link from "next/link";
import { FaEye, FaHeart, FaComment } from "react-icons/fa";

export default function BlogCard({ blog }: any) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {blog.tags.slice(0, 3).map((t: any) => (
            <span
              key={t}
              className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
            >
              #{t}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-gray-900 group-hover:text-indigo-600">
          {blog.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">
          {blog.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FaEye /> {blog.views}
          </span>
          <span className="flex items-center gap-1">
            <FaHeart /> {blog.likes.length}
          </span>
          <span className="flex items-center gap-1">
            <FaComment /> {blog.comments.length}
          </span>
        </div>
      </div>
    </Link>
  );
}
