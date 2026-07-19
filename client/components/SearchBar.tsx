import { useState, type FormEvent } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({
  initial = "",
  onSubmit,
  placeholder = "Search blogs and press Enter…",
}: {
  initial?: string;
  onSubmit: (q: string) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState(initial);
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit(q.trim());
      }}
      className="relative w-full"
    >
      <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={q}
        onChange={(e) => {
          const value = e.target.value;
          setQ(value);

          if (value.trim() === "") {
            onSubmit?.("");
          }
        }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </form>
  );
}
