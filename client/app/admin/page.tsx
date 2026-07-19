"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { getAdmin } from "@/api/authApi";

import {
  FaBars,
  FaChartLine,
  FaListAlt,
  FaPlus,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import AnalyticsPage from "@/components/AnalyticsPage";

export default function page() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        await getAdmin();
      } catch (error) {
        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
        return;
      }
    };

    checkAdmin();
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const items = [
    {
      href: "/admin",
      label: "Analytics",
      icon: FaChartLine,
      exact: true,
    },
    {
      href: "/admin/blogs",
      label: "Blogs",
      icon: FaListAlt,
    },
    {
      href: "/admin/blogs/new",
      label: "New Blog",
      icon: FaPlus,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: FaUsers,
    },
  ];

  const navLink = (item: (typeof items)[number], mobile = false) => {
    const active = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");

    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={mobile ? () => setMobileOpen(false) : undefined}
        className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
          active
            ? "bg-[#e0e3e6] font-medium text-[#0f172b]"
            : "text-[#020618] hover:bg-[#f9f3f4] hover:text-[#0f172b]"
        }`}
      >
        <Icon />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-[#e2e8f0] bg-[#fcf9fa] text-[#020618] md:flex">
        <div className="flex h-full flex-col p-4">
          <Link href="/" className="mb-8 text-lg font-bold text-[#020618]">
            Inkwell
            <span className="text-[#0f172b]">.</span>
            <span className="ml-1 text-xs font-normal text-[#62748e]">
              admin
            </span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto text-sm">
            {items.map((item) => navLink(item))}
          </nav>

          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              router.replace("/admin/login");
            }}
            className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#020618] transition-colors hover:bg-[#f9f3f4] hover:text-[#0f172b]"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <div className="hidden w-60 shrink-0 md:block" />

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e2e8f0] bg-white px-4 py-3 md:hidden">
          <Link href="/" className="text-lg font-bold text-[#020618]">
            Inkwell
            <span className="text-[#0f172b]">.</span>
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-[#020618] hover:bg-[#f9f3f4]"
          >
            <FaBars />
          </button>
        </div>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="fixed inset-y-0 left-0 z-50 w-60 border-r border-[#e2e8f0] bg-[#fcf9fa] text-[#020618] md:hidden">
              <div className="flex h-full flex-col p-4">
                <div className="mb-6 flex items-center justify-between">
                  <Link href="/" className="text-lg font-bold text-[#020618]">
                    Inkwell
                    <span className="text-[#0f172b]">.</span>
                  </Link>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md p-2 hover:bg-[#f9f3f4]"
                  >
                    <FaTimes />
                  </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto text-sm">
                  {items.map((item) => navLink(item, true))}
                </nav>

                <button
                  onClick={() => {
                    localStorage.removeItem("adminToken");
                    router.replace("/admin/login");
                  }}
                  className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[#f9f3f4]"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </aside>
          </>
        )}

        <div className="p-4 md:p-8">
          <AnalyticsPage />
        </div>
      </main>
    </div>
  );
}
