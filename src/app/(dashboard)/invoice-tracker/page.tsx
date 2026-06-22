import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatKES } from "@/lib/utils";
import InvoiceTrackerClient from "./client";

export const dynamic = "force-dynamic";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default async function InvoiceTrackerPage() {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: businessUser } = await supabase
    .from("business_users")
    .select("business_id")
    .eq("user_id", user.id)
    .single();
  if (!businessUser) redirect("/signin");

  const businessId = businessUser.business_id;

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const allInvoices = invoices || [];

  const invoiceIds = allInvoices.map(i => i.id);
  const { data: payments } = invoiceIds.length > 0
    ? await supabase
        .from("payments")
        .select("*")
        .in("invoice_id", invoiceIds)
        .eq("status", "successful")
        .order("paid_at", { ascending: true })
    : { data: [] };

  const allPayments = payments || [];

  /* ─── KPI ─── */

  const totalInvoices = allInvoices.length;
  const invoicesCleared = allInvoices.filter(i => i.status === "paid").length;
  const pendingInvoicesCount = allInvoices.filter(i => ["sent","partially_paid","overdue"].includes(i.status)).length;
  const outstandingBalances = allInvoices
    .filter(i => ["sent","partially_paid","overdue"].includes(i.status))
    .reduce((sum, i) => sum + Number(i.balance_due || 0), 0);

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const thisMonthInvoices = allInvoices.filter(i => {
    const d = new Date(i.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const lastMonthInvoices = allInvoices.filter(i => {
    const d = new Date(i.created_at);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  }).length;
  const invoiceChange = lastMonthInvoices > 0
    ? (((thisMonthInvoices - lastMonthInvoices) / lastMonthInvoices) * 100).toFixed(1)
    : "0";

  const thisMonthCleared = allInvoices.filter(i => {
    if (i.status !== "paid") return false;
    const d = new Date(i.updated_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const lastMonthCleared = allInvoices.filter(i => {
    if (i.status !== "paid") return false;
    const d = new Date(i.updated_at);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  }).length;
  const clearedChange = lastMonthCleared > 0
    ? (((thisMonthCleared - lastMonthCleared) / lastMonthCleared) * 100).toFixed(1)
    : "0";
  const clearedRate = totalInvoices > 0 ? ((invoicesCleared / totalInvoices) * 100).toFixed(1) : "0";

  const thisMonthPending = allInvoices.filter(i => {
    if (!["sent","partially_paid","overdue"].includes(i.status)) return false;
    const d = new Date(i.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const lastMonthPending = allInvoices.filter(i => {
    if (!["sent","partially_paid","overdue"].includes(i.status)) return false;
    const d = new Date(i.created_at);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  }).length;
  const pendingChange = lastMonthPending > 0
    ? (((thisMonthPending - lastMonthPending) / lastMonthPending) * 100).toFixed(1)
    : "0";

  const thisMonthOutstanding = allInvoices
    .filter(i => {
      if (!["sent","partially_paid","overdue"].includes(i.status)) return false;
      const d = new Date(i.created_at);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, i) => sum + Number(i.balance_due || 0), 0);
  const lastMonthOutstanding = allInvoices
    .filter(i => {
      if (!["sent","partially_paid","overdue"].includes(i.status)) return false;
      const d = new Date(i.created_at);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, i) => sum + Number(i.balance_due || 0), 0);
  const outstandingChange = lastMonthOutstanding > 0
    ? (((thisMonthOutstanding - lastMonthOutstanding) / lastMonthOutstanding) * 100).toFixed(1)
    : "0";

  const kpi = [
    {
      label: "Total Invoices", value: totalInvoices.toString(),
      change: invoiceChange, sub: `vs last month (${thisMonthInvoices} this month)`,
      cardBg: "bg-rose-50", cardBorder: "border-rose-200/40", accent: "text-rose-500",
    },
    {
      label: "Invoices cleared", value: invoicesCleared.toString(),
      change: clearedChange, sub: `${clearedRate}% cleared rate`,
      cardBg: "bg-violet-50", cardBorder: "border-violet-200/40", accent: "text-violet-500",
    },
    {
      label: "Pending invoices", value: pendingInvoicesCount.toString(),
      change: pendingChange, sub: "Awaiting action",
      cardBg: "bg-emerald-50", cardBorder: "border-emerald-200/40", accent: "text-emerald-500",
    },
    {
      label: "Outstanding balances", value: formatKES(outstandingBalances),
      change: outstandingChange, sub: "Total unpaid",
      cardBg: "bg-amber-50", cardBorder: "border-amber-200/40", accent: "text-amber-500",
    },
  ];

  /* ─── Pie Chart ─── */

  const sentCount = allInvoices.filter(i => i.status === "sent").length;
  const paidCount = allInvoices.filter(i => i.status === "paid").length;
  const overdueCount = allInvoices.filter(i => i.status === "overdue").length;
  const partialCount = allInvoices.filter(i => i.status === "partially_paid").length;
  const pieTotal = sentCount + paidCount + overdueCount + partialCount || 1;

  const pieData = [
    { name: "Sent", value: Math.round((sentCount / pieTotal) * 100), color: "#3B82F6" },
    { name: "Paid", value: Math.round((paidCount / pieTotal) * 100), color: "#10B981" },
    { name: "Overdue", value: Math.round((overdueCount / pieTotal) * 100), color: "#F59E0B" },
    { name: "Partially Paid", value: Math.round((partialCount / pieTotal) * 100), color: "#8B5CF6" },
  ];

  /* ─── Pending Table ─── */

  const pendingRows = allInvoices
    .filter(i => ["sent","partially_paid","overdue"].includes(i.status))
    .slice(0, 15)
    .map(i => ({
      id: i.invoice_number,
      date: i.created_at,
      total: Number(i.total),
      amount_paid: Number(i.amount_paid),
      client: (i as any).clients?.name || "—",
      status: i.status,
    }));

  /* ─── Line Chart (monthly payments) ─── */

  const monthlyPayments = MONTHS.map((month, idx) => {
    const total = allPayments
      .filter(p => {
        const d = new Date(p.paid_at);
        return d.getMonth() === idx && d.getFullYear() === thisYear;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return { month, amount: total };
  });

  const totalPaymentsThisYear = monthlyPayments.reduce((s, m) => s + m.amount, 0);
  const lastYearMonthPayments = MONTHS.map((_, idx) => {
    return allPayments
      .filter(p => {
        const d = new Date(p.paid_at);
        return d.getMonth() === idx && d.getFullYear() === thisYear - 1;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }).reduce((s, m) => s + m, 0);
  const paymentChangeText = lastYearMonthPayments > 0
    ? `+${((totalPaymentsThisYear / lastYearMonthPayments - 1) * 100).toFixed(1)}% vs last year`
    : "";

  /* ─── Bar Chart (monthly invoice status) ─── */

  const monthlyInvoiceStatus = MONTHS.map((month, idx) => {
    const monthInvoices = allInvoices.filter(i => {
      const d = new Date(i.created_at);
      return d.getMonth() === idx && d.getFullYear() === thisYear;
    });
    return {
      month,
      sent: monthInvoices.filter(i => i.status === "sent").length,
      paid: monthInvoices.filter(i => i.status === "paid").length,
      overdue: monthInvoices.filter(i => i.status === "overdue").length,
    };
  });

  /* ─── Gallery ─── */

  const galleryInvoices = allInvoices.slice(0, 15).map(i => ({
    id: i.invoice_number,
    date: i.created_at,
    client: (i as any).clients?.name || "—",
    amount: Number(i.total),
  }));

  return (
    <InvoiceTrackerClient
      kpi={kpi}
      pieData={pieData}
      pendingRows={pendingRows}
      monthlyPayments={monthlyPayments}
      paymentChangeText={paymentChangeText}
      monthlyInvoiceStatus={monthlyInvoiceStatus}
      galleryInvoices={galleryInvoices}
    />
  );
}
