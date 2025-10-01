import type { Metadata } from "next";

import { AdminDashboard } from "./dashboard";
import { ROOT_DOMAIN } from "@/config/app.config";
import { getAllSubdomains } from "@/services/subdomains";

export const metadata: Metadata = {
  title: `Admin Dashboard | ${ROOT_DOMAIN}`,
  description: `Manage subdomains for ${ROOT_DOMAIN}`,
};

export default async function AdminPage() {
  // TODO: You can add authentication here with your preferred auth provider
  const tenants = await getAllSubdomains();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <AdminDashboard tenants={tenants} />
    </div>
  );
}
