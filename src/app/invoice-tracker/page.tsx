"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass,
  Bell,
  UserCircle,
  ChartBar,
  ChartLine,
  TextT,
  GridFour,
  SquaresFour,
  ImageSquare,
  Plus,
  CaretDown,
  ArrowRight,
  FileText,
  Robot,
  Clock,
  CalendarDots,
  CurrencyCircleDollar,
  Users,
  BuildingOffice,
  Money,
  ArrowUpRight,
  ArrowDownRight,
} from "@phosphor-icons/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";

/* ─────────── Data ─────────── */

const kpiData = [
  {
    label: "Total Invoices",
    value: "1,024",
    change: "+12.4%",
    trend: "up",
    sub: "vs previous month",
    shade: "bg-blue-50",
  },
  {
    label: "Invoices cleared",
    value: "847",
    change: "+8.7%",
    trend: "up",
    sub: "82.7% cleared rate",
    shade: "bg-blue-50/60",
  },
  {
    label: "Pending invoices",
    value: "124",
    change: "—",
    trend: "neutral",
    sub: "awaiting action",
    shade: "bg-blue-50/40",
  },
  {
    label: "Outstanding balances",
    value: "KES 847K",
    change: "-3.2%",
    trend: "down",
    sub: "total unpaid",
    shade: "bg-blue-50/30",
  },
];

const pieData = [
  { name: "Sent", value: 40, color: "#3B82F6" },
  { name: "Paid", value: 30, color: "#60A5FA" },
  { name: "Overdue", value: 20, color: "#93C5FD" },
  { name: "Partially Paid", value: 10, color: "#BFDBFE" },
];

const tableData = [
  { id: "INV-1011", date: "12 May 2026", total: "KES 24,500", paid: "KES 24,500", client: "Sarah Kamau", status: "paid" },
  { id: "INV-1012", date: "14 May 2026", total: "KES 12,000", paid: "KES 6,000", client: "John Mwangi", status: "partial" },
  { id: "INV-1013", date: "16 May 2026", total: "KES 8,750", paid: "KES 0", client: "Grace Akinyi", status: "pending" },
  { id: "INV-1014", date: "18 May 2026", total: "KES 45,200", paid: "KES 45,200", client: "Peter Ochieng", status: "paid" },
  { id: "INV-1015", date: "20 May 2026", total: "KES 3,600", paid: "KES 3,600", client: "Faith Wanjiku", status: "paid" },
];

const lineChartData = [
  { month: "Jan", amount: 180000 },
  { month: "Feb", amount: 220000 },
  { month: "Mar", amount: 190000 },
  { month: "Apr", amount: 310000 },
  { month: "May", amount: 275000 },
  { month: "Jun", amount: 350000 },
];

const barChartData = [
  { month: "Jan", sent: 28, paid: 18, overdue: 6 },
  { month: "Feb", sent: 35, paid: 22, overdue: 5 },
  { month: "Mar", sent: 30, paid: 20, overdue: 8 },
  { month: "Apr", sent: 42, paid: 30, overdue: 4 },
  { month: "May", sent: 38, paid: 26, overdue: 7 },
  { month: "Jun", sent: 45, paid: 34, overdue: 3 },
];

const galleryData = Array.from({ length: 15 }, (_, i) => ({
  id: `INV-${1000 + i}`,
  date: new Date(2026, 2 + (i % 4), 5 + i).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  client: ["Sarah Kamau", "John Mwangi", "Grace Akinyi", "Peter Ochieng", "Faith Wanjiku"][i % 5],
  amount: [24500, 12000, 8750, 45200, 3600][i % 5],
}));

const recentClients = [
  { name: "Sarah Kamau", company: "Kamau Designs", invoices: 12, revenue: "KES 142,000" },
  { name: "John Mwangi", company: "Mwangi Tech", invoices: 8, revenue: "KES 89,500" },
  { name: "Grace Akinyi", company: "Akinyi Studio", invoices: 5, revenue: "KES 43,200" },
  { name: "Peter Ochieng", company: "Ochieng Ventures", invoices: 15, revenue: "KES 312,000" },
  { name: "Faith Wanjiku", company: "Wanjiku Creative", invoices: 3, revenue: "KES 22,800" },
];

/* ─────────── Animation Variants ─────────── */

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease, delay: i * 0.08 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ─────────── Grain Overlay ─────────── */

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}

/* ─────────── Double-Bezel Wrapper ─────────── */

function BezelCard({
  children,
  className = "",
  outerClass = "",
  innerClass = "",
}: {
  children: React.ReactNode;
  className?: string;
  outerClass?: string;
  innerClass?: string;
}) {
  return (
    <div className={`p-[1px] rounded-[20px] bg-zinc-100/80 ${outerClass}`}>
      <div
        className={`rounded-[19px] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] ${className} ${innerClass}`}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────── Top Navigation ─────────── */

function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-[#1D4ED8] text-white shadow-[0_1px_0_rgba(255,255,255,0.08)]">
      <div className="mx-auto flex h-16 items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <CurrencyCircleDollar size={20} weight="bold" className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Invoice Tracker</span>
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              weight="light"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-200"
            />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-56 rounded-full bg-white/12 py-2 pl-10 pr-4 text-sm text-white placeholder-blue-200/70 outline-none ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:w-72 focus:bg-white/15 focus:ring-white/25"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-200 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <Bell size={18} weight="light" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-200 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <UserCircle size={18} weight="light" />
          </button>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-200 sm:hidden">
          <MagnifyingGlass size={18} weight="light" />
        </button>
      </div>
    </header>
  );
}

/* ─────────── Sub-Header ─────────── */

function SubHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (t: string) => void;
}) {
  const tabs = [
    { id: "clients", label: "Clients" },
    { id: "invoices", label: "Invoices" },
  ];

  return (
    <div className="sticky top-16 z-40 border-b border-zinc-200/50 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                activeTab === t.id
                  ? "bg-white text-[#1D4ED8] shadow-[0_1px_3px_rgba(29,78,216,0.08)]"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-zinc-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30">
            <FileText size={15} weight="light" />
            <span>Log</span>
          </button>
          <button className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-zinc-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30">
            <Robot size={15} weight="light" />
            <span>Automation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Tool Sidebar ─────────── */

const tools = [
  { id: "kpi", icon: ChartBar, label: "KPI" },
  { id: "chart", icon: ChartLine, label: "Chart" },
  { id: "text", icon: TextT, label: "Text" },
  { id: "grid", icon: GridFour, label: "Grid" },
];

function ToolSidebar({ activeTool, onToolChange }: { activeTool: string; onToolChange: (t: string) => void }) {
  return (
    <div className="hidden w-16 flex-col items-center gap-2 pt-2 lg:flex">
      <BezelCard className="flex flex-col items-center gap-1.5 py-3 px-1.5">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onToolChange(t.id)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                isActive
                  ? "bg-blue-50 text-[#1D4ED8]"
                  : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
              }`}
            >
              <Icon size={18} weight={isActive ? "regular" : "light"} />
              {t.label}
            </button>
          );
        })}
      </BezelCard>
    </div>
  );
}

/* ─────────── KPI Cards ─────────── */

function KPISection() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4"
    >
      {kpiData.map((kpi, i) => (
        <motion.div key={kpi.label} variants={fadeUp} custom={i}>
          <BezelCard outerClass={kpi.shade}>
            <div className="flex flex-col gap-2 p-5">
              <p className="text-xs font-medium tracking-wide text-zinc-500">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-zinc-900 [font-variant-numeric:tabular-nums]">
                  {kpi.value}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold ${
                    kpi.trend === "up"
                      ? "text-blue-600"
                      : kpi.trend === "down"
                      ? "text-amber-600"
                      : "text-zinc-400"
                  }`}
                >
                  {kpi.trend === "up" ? <ArrowUpRight size={11} weight="bold" /> : kpi.trend === "down" ? <ArrowDownRight size={11} weight="bold" /> : null}
                  {kpi.change}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">{kpi.sub}</p>
            </div>
          </BezelCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────── Pie Chart Block ─────────── */

function PieChartBlock() {
  return (
    <BezelCard className="h-full">
      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-sm font-semibold text-zinc-800 text-balance">Invoice Stages</h3>
        <div className="flex items-center gap-4">
          <div className="h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e4e4e7",
                    boxShadow: "0 4px 20px rgba(29,78,216,0.08)",
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {pieData.map((e) => (
              <div key={e.name} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="text-xs text-zinc-600">{e.name}</span>
                <span className="ml-auto text-xs font-semibold text-zinc-800 [font-variant-numeric:tabular-nums]">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BezelCard>
  );
}

/* ─────────── Pending Invoices Table ─────────── */

const statusStyles: Record<string, string> = {
  paid: "bg-blue-100 text-blue-700",
  partial: "bg-amber-50 text-amber-700",
  pending: "bg-zinc-100 text-zinc-500",
};

function PendingTable() {
  return (
    <BezelCard className="h-full">
      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-sm font-semibold text-zinc-800 text-balance">Pending Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400">
                <th className="pb-2.5 pr-3 font-medium [font-variant-numeric:tabular-nums]">#</th>
                <th className="pb-2.5 pr-3 font-medium [font-variant-numeric:tabular-nums]">Invoice ID</th>
                <th className="pb-2.5 pr-3 font-medium">Issue Date</th>
                <th className="pb-2.5 pr-3 font-medium [font-variant-numeric:tabular-nums]">Total</th>
                <th className="pb-2.5 pr-3 font-medium [font-variant-numeric:tabular-nums]">Paid</th>
                <th className="pb-2.5 pr-3 font-medium">Client</th>
                <th className="pb-2.5 pr-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-50 transition-colors duration-300 hover:bg-zinc-50/50"
                >
                  <td className="py-2.5 pr-3 text-zinc-400 [font-variant-numeric:tabular-nums]">{i + 1}</td>
                  <td className="py-2.5 pr-3 font-medium text-zinc-800 [font-variant-numeric:tabular-nums]">{row.id}</td>
                  <td className="py-2.5 pr-3 text-zinc-500">{row.date}</td>
                  <td className="py-2.5 pr-3 text-zinc-700 [font-variant-numeric:tabular-nums]">{row.total}</td>
                  <td className="py-2.5 pr-3 text-zinc-700 [font-variant-numeric:tabular-nums]">{row.paid}</td>
                  <td className="py-2.5 pr-3 text-zinc-600">{row.client}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BezelCard>
  );
}

/* ─────────── Trends Section ─────────── */

function LineChartBlock() {
  return (
    <BezelCard>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800 text-balance">Payments Received</h3>
          <span className="rounded-md bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600">
            +22.4% vs last month
          </span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineChartData}>
              <defs>
                <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e4e4e7",
                  boxShadow: "0 4px 20px rgba(29,78,216,0.08)",
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#blueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BezelCard>
  );
}

function BarChartBlock() {
  return (
    <BezelCard>
      <div className="flex flex-col gap-4 p-5">
        <h3 className="text-sm font-semibold text-zinc-800 text-balance">Invoice Status</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} barGap={4}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e4e4e7",
                  boxShadow: "0 4px 20px rgba(29,78,216,0.08)",
                  fontSize: 13,
                }}
                cursor={{ fill: "rgba(29,78,216,0.03)" }}
              />
              <Bar dataKey="sent" fill="#3B82F6" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="paid" fill="#60A5FA" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="overdue" fill="#93C5FD" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-blue-500" />
            Sent
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-blue-400" />
            Paid
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-blue-300" />
            Overdue
          </div>
        </div>
      </div>
    </BezelCard>
  );
}

/* ─────────── Analytics View ─────────── */

function AnalyticsView() {
  const [activeTool, setActiveTool] = useState("kpi");

  return (
    <div className="flex gap-5">
      <ToolSidebar activeTool={activeTool} onToolChange={setActiveTool} />
      <motion.div
        key="analytics"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-1 flex-col gap-5"
      >
        <KPISection />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <PieChartBlock />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <PendingTable />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <LineChartBlock />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <BarChartBlock />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── Gallery View ─────────── */

function GalleryView() {
  const [galleryTab, setGalleryTab] = useState("gallery");

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col gap-6"
    >
      {/* Toolbar */}
      <BezelCard>
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
            {[
              { id: "views", label: "Views", icon: SquaresFour },
              { id: "gallery", label: "Invoice gallery", icon: ImageSquare },
            ].map((v) => {
              const Icon = v.icon;
              const isActive = galleryTab === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setGalleryTab(v.id)}
                  className={`flex items-center gap-1.5 rounded-[7px] px-3.5 py-1.5 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                    isActive
                      ? "bg-white text-zinc-800 shadow-[0_1px_2px_rgba(29,78,216,0.06)]"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  <Icon size={13} weight={isActive ? "regular" : "light"} />
                  {v.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {["Sort", "Filter", "Color"].map((action) => (
              <button
                key={action}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              >
                {action}
                <CaretDown size={10} weight="bold" />
              </button>
            ))}

            <div className="flex items-center">
              {[
                { color: "#3B82F6", name: "Blue" },
                { color: "#60A5FA", name: "Light Blue" },
                { color: "#93C5FD", name: "Sky" },
                { color: "#1D4ED8", name: "Navy" },
              ].map((a, i) => (
                <div
                  key={a.color}
                  className="-ml-1.5 h-7 w-7 rounded-lg border-2 border-white transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: a.color, zIndex: 4 - i }}
                  title={a.name}
                />
              ))}
            </div>

            <button className="group relative flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1E40AF] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
              <Plus size={14} weight="bold" />
              <span>Add Record</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowRight size={10} weight="bold" />
              </span>
            </button>
          </div>
        </div>
      </BezelCard>

      {/* Card Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        {galleryData.map((inv, i) => (
          <motion.div key={inv.id} variants={fadeUp} custom={i}>
            <BezelCard>
              <div className="flex flex-col">
                {/* Upper — Invoice Preview */}
                <div className="flex flex-col gap-1.5 border-b border-zinc-100 px-5 pb-4 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-16 rounded bg-zinc-200" />
                    <div className="h-2 w-10 rounded bg-blue-100" />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    <div className="h-1.5 rounded bg-zinc-100" />
                    <div className="h-1.5 rounded bg-zinc-100" />
                    <div className="h-1.5 rounded bg-zinc-100" />
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="h-1.5 rounded bg-zinc-50" />
                    <div className="h-1.5 rounded bg-zinc-50" />
                    <div className="h-1.5 rounded bg-zinc-100" />
                    <div className="h-1.5 rounded bg-zinc-50" />
                  </div>
                  <div className="mt-1 h-8 w-3/4 rounded-md bg-blue-50/50" />
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-1.5 rounded bg-zinc-100" />
                    <div className="h-1.5 rounded bg-zinc-100" />
                  </div>
                  <div className="mt-0.5 flex justify-end">
                    <div className="h-3 w-16 rounded-md bg-blue-100/60" />
                  </div>
                </div>

                {/* Lower — Meta */}
                <div className="flex flex-col gap-1 px-5 pb-5 pt-3.5">
                  <p className="text-sm font-bold tracking-tight text-zinc-800 [font-variant-numeric:tabular-nums]">
                    {inv.id}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <CalendarDots size={11} weight="light" />
                    {inv.date}
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-zinc-500">{inv.client}</p>
                </div>
              </div>
            </BezelCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─────────── Clients View ─────────── */

function ClientsView() {
  return (
    <motion.div
      key="clients"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-800 text-balance">Clients</h2>
        <button className="flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1E40AF] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Plus size={14} weight="bold" />
          Add Client
          <span className="flex h-4 w-4 items-center justify-center rounded-md bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
            <ArrowRight size={9} weight="bold" />
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BezelCard>
          <div className="flex flex-col gap-4 p-5">
            <h3 className="text-sm font-semibold text-zinc-800 text-balance">Recent Clients</h3>
            <div className="flex flex-col gap-2">
              {recentClients.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors duration-300 hover:bg-zinc-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-[#1D4ED8]">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-zinc-800">{c.name}</span>
                    <span className="text-[11px] text-zinc-400">{c.company}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-700 [font-variant-numeric:tabular-nums]">
                      {c.revenue}
                    </span>
                    <span className="ml-2 text-[10px] text-zinc-400">{c.invoices} inv.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BezelCard>

        <BezelCard>
          <div className="flex flex-col gap-4 p-5">
            <h3 className="text-sm font-semibold text-zinc-800 text-balance">Client Activity</h3>
            <div className="flex flex-col gap-3">
              {[
                { action: "Invoice INV-1014 paid", client: "Peter Ochieng", time: "2 hours ago", type: "payment" },
                { action: "New invoice created", client: "Grace Akinyi", time: "5 hours ago", type: "create" },
                { action: "Invoice INV-1012 partially paid", client: "John Mwangi", time: "1 day ago", type: "payment" },
                { action: "Client profile updated", client: "Faith Wanjiku", time: "2 days ago", type: "update" },
                { action: "Invoice INV-1011 marked sent", client: "Sarah Kamau", time: "3 days ago", type: "status" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-2.5 transition-colors duration-300 hover:bg-zinc-50">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${
                      a.type === "payment"
                        ? "bg-blue-50 text-blue-600"
                        : a.type === "create"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {a.type === "payment" ? <Money size={14} weight="light" /> : a.type === "create" ? <Plus size={14} weight="light" /> : <Clock size={14} weight="light" />}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-xs font-medium text-zinc-700">{a.action}</span>
                    <span className="text-[11px] text-zinc-400">{a.client} · {a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BezelCard>
      </div>
    </motion.div>
  );
}

/* ─────────── Main Page ─────────── */

export default function InvoiceTrackerPage() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [viewMode, setViewMode] = useState<"analytics" | "gallery">("analytics");

  return (
    <div className="min-h-[100dvh] bg-[#F4F4F5] font-sans antialiased">
      <GrainOverlay />
      <TopNav />
      <SubHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-[1440px] px-4 py-8 lg:px-10 lg:py-10">
        {activeTab === "clients" ? (
          <ClientsView />
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => setViewMode("analytics")}
                className={`relative rounded-lg px-5 py-2 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  viewMode === "analytics"
                    ? "bg-[#1D4ED8] text-white shadow-[0_2px_8px_rgba(29,78,216,0.25)]"
                    : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-800"
                }`}
              >
                Analytical Report
              </button>
              <button
                onClick={() => setViewMode("gallery")}
                className={`relative rounded-lg px-5 py-2 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  viewMode === "gallery"
                    ? "bg-[#1D4ED8] text-white shadow-[0_2px_8px_rgba(29,78,216,0.25)]"
                    : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-800"
                }`}
              >
                Invoice Gallery
              </button>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "analytics" ? <AnalyticsView /> : <GalleryView />}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}
