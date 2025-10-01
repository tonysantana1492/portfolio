import Link from "next/link";

import { SubdomainForm } from "@/app/subdomain-form";
import { ROOT_DOMAIN } from "@/config/app.config";

export default async function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="absolute top-4 right-4">
        <Link
          href="/admin"
          className="text-gray-500 text-sm transition-colors hover:text-gray-700"
        >
          Admin
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-bold text-4xl text-gray-900 tracking-tight">
            {ROOT_DOMAIN}
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Create your own subdomain with a custom emoji
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <SubdomainForm />
        </div>
      </div>
    </div>
  );
}
