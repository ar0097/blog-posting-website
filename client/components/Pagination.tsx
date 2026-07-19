import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-md border border-gray-300 bg-white p-2 text-gray-600 disabled:opacity-40"
      >
        <FaChevronLeft />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`min-w-[36px] rounded-md border px-3 py-1.5 text-sm ${p === page ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="rounded-md border border-gray-300 bg-white p-2 text-gray-600 disabled:opacity-40"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
