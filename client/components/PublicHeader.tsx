import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

export default function PublicHeader() {
  const router = useRouter();

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");

    if (user) {
      setSession(JSON.parse(user));
    } else if (admin) {
      setSession(JSON.parse(admin));
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Inkwell<span className="text-indigo-600">.</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-700 hover:text-indigo-600">
            Blog
          </Link>
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 sm:flex">
                <img
                  src={session.avatar || "https://ui-avatars.com/api/?name=AD"}
                  alt={session.name}
                  className="h-7 w-7 rounded-full"
                />
                <span className="text-gray-800">{session.name}</span>
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("userToken");

                  localStorage.removeItem("admin");
                  localStorage.removeItem("adminToken");

                  setSession(null);
                  router.push("/");
                }}
                className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
              >
                <FaUserCircle /> Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
