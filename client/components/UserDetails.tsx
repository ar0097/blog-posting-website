"use client";
import { User } from "@/types/userTypes";
import { useRouter } from "next/navigation";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";

interface UserDetailProps {
  user: User;
}

export default function UserDetail({ user }: UserDetailProps) {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => router.push("/admin/users")}
        className="mb-6 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <FaChevronLeft /> Back to users
      </button>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-24 w-24 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium capitalize text-indigo-700">
              {user.provider}
            </div>
          </div>
        </div>
        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              User ID
            </dt>
            <dd className="mt-1 font-mono text-sm text-gray-900 break-all">
              {user.googleId}
            </dd>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Provider
            </dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {user.provider}
            </dd>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Registered
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(user.createdAt).toLocaleString()}
            </dd>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              Last login
            </dt>
          </div>
        </dl>
      </div>
    </div>
  );
}
