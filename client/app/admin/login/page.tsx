"use client";
import Link from "next/link";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/api/authApi";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email.trim() || !password.trim()) {
      return setError("Email and password are required");
    }

    try {
      setLoading(true);

      const data = await adminLogin(email.trim(), password);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      router.push("/admin");
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="mb-6 block text-center text-xl font-bold text-gray-900"
        >
          Blogger<span className="text-indigo-600">.</span>
        </Link>
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Admin sign in
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Enter your administrator credentials to continue.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@blog.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <FaLock /> {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
