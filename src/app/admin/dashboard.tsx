"use client";

import { useActionState } from "react";

import Link from "next/link";

import { Loader2, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROTOCOL, ROOT_DOMAIN } from "@/config/app.config";
import { deleteSubdomainAction } from "@/services/actions";

type Tenant = {
  subdomain: string;
  emoji: string;
  createdAt: number;
  profile?: {
    username: string;
    displayName: string;
    firstName: string;
    lastName: string;
  } | null;
};

type DeleteState = {
  error?: string;
  success?: string | boolean;
};

function DashboardHeader() {
  // TODO: You can add authentication here with your preferred auth provider

  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="font-bold text-3xl">Subdomain Management</h1>
      <div className="flex items-center gap-4">
        <Link
          href={`${PROTOCOL}://${ROOT_DOMAIN}`}
          className="text-gray-500 text-sm transition-colors hover:text-gray-700"
        >
          {ROOT_DOMAIN}
        </Link>
      </div>
    </div>
  );
}

function TenantGrid({
  tenants,
  action,
  isPending,
}: {
  tenants: Tenant[];
  action: (formData: FormData) => void;
  isPending: boolean;
}) {
  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No subdomains have been created yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <Card key={tenant.subdomain}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{tenant.subdomain}</CardTitle>
              <form action={action}>
                <input
                  type="hidden"
                  name="subdomain"
                  value={tenant.subdomain}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="submit"
                  disabled={isPending}
                  className="text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-4xl">{tenant.emoji}</div>
                <div className="text-gray-500 text-sm">
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </div>
              </div>

              {tenant.profile ? (
                <div className="flex items-center gap-2 rounded-md bg-green-50 p-2">
                  <User className="h-4 w-4 text-green-600" />
                  <div className="text-sm">
                    <div className="font-medium text-green-800">
                      {tenant.profile.displayName}
                    </div>
                    <div className="text-green-600 text-xs">
                      @{tenant.profile.username}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-2">
                  <User className="h-4 w-4 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    No profile associated
                  </div>
                </div>
              )}

              <div>
                <a
                  href={`${PROTOCOL}://${tenant.subdomain}.${ROOT_DOMAIN}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Visit subdomain →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AdminDashboard({ tenants }: { tenants: Tenant[] }) {
  const [state, action, isPending] = useActionState<DeleteState, FormData>(
    deleteSubdomainAction,
    {}
  );

  return (
    <div className="relative space-y-6 p-4 md:p-8">
      <DashboardHeader />
      <TenantGrid tenants={tenants} action={action} isPending={isPending} />

      {state.error && (
        <div className="fixed right-4 bottom-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 shadow-md">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="fixed right-4 bottom-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 shadow-md">
          {state.success}
        </div>
      )}
    </div>
  );
}
