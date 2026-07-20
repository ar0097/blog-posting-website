"use client";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "@/api/authApi";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

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
          Sign in to Blogger
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Sign in with your Google account to like posts and comment.
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const data = await googleLogin(
                    credentialResponse.credential!,
                  );

                  localStorage.setItem("userToken", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));

                  router.push("/");
                } catch (error) {
                  console.log(error);
                }
              }}
              onError={() => {
                console.log("Google Login Failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
