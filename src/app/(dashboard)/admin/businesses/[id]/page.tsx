import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatKES, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BusinessDetailPage({ params }: { params: { id: string } }) {
  const admin = createAdminClient();

  const { data: business } = await admin
    .from("businesses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!business) notFound();

  const { count: jobCount } = await admin
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("business_id", params.id);

  const { count: clientCount } = await admin
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("business_id", params.id);

  const { count: invoiceCount } = await admin
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("business_id", params.id);

  const { data: payments } = await admin
    .from("payments")
    .select("amount")
    .eq("status", "successful");

  const { data: users } = await admin
    .from("business_users")
    .select("user_id, role")
    .eq("business_id", params.id);

  const totalRevenue = payments?.reduce((s, p) => s + Number(p.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Admin
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">B</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">{business.name}</h1>
            <p className="text-sm text-zinc-500">{business.email} · {business.city} · Since {formatDate(business.created_at)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Jobs", value: (jobCount || 0).toString() },
            { label: "Clients", value: (clientCount || 0).toString() },
            { label: "Invoices", value: (invoiceCount || 0).toString() },
            { label: "Revenue", value: formatKES(totalRevenue) },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
              <p className="text-xs text-zinc-400 font-medium">{s.label}</p>
              <p className="text-xl font-semibold text-zinc-800 mt-1 [font-variant-numeric:tabular-nums]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Team Members ({users?.length || 0})</h2>
          {(!users || users.length === 0) ? (
            <p className="text-sm text-zinc-400">No team members</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.user_id} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                  <span className="text-sm text-zinc-700 font-mono truncate">{u.user_id}</span>
                  <span className="text-xs capitalize bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Admin
        </Link>
      </div>
    </div>
  );
}
