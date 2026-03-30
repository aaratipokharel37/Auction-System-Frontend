import { useState } from "react";
import { useMonthlyRevenue } from "@/queries/admin/monthlyincome";
import { TrendingUp, TrendingDown, Gavel, Calendar, AlertCircle, RotateCcw } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Pure SVG Area Chart ───────────────────────────────────────────────────────
const AreaChart = ({ data, maxVal }) => {
  const W = 1200, H = 180, pad = 20;
  const points = data.map((val, i) => [
    pad + (i / (data.length - 1)) * (W - pad * 2),
    maxVal > 0 ? H - pad - (val / maxVal) * (H - pad * 2) : H - pad,
  ]);
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L ${points.at(-1)[0]} ${H} L ${points[0][0]} ${H} Z`;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#ag)" />
        <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], i) => data[i] > 0 && (
          <circle key={i} cx={x} cy={y} r="5" fill="#0ea5e9" stroke="#09090b" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        {MONTHS.map((m) => <span key={m} className="text-zinc-600 text-[10px]">{m}</span>)}
      </div>
    </div>
  );
};

// ── Pure CSS Bar Chart ────────────────────────────────────────────────────────
const BarChart = ({ data, maxVal }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex items-end gap-1 pt-2">
      {data.map((val, i) => {
        const h = maxVal > 0 ? Math.max((val / maxVal) * 160, val > 0 ? 4 : 0) : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 relative"
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {hovered === i && val > 0 && (
              <div className="absolute bottom-full mb-1 z-10 pointer-events-none bg-zinc-800
                border border-zinc-700 rounded px-2 py-1 text-xs text-white whitespace-nowrap shadow-lg">
                NPR {val.toLocaleString('en-NP')}
              </div>
            )}
            <div className="w-full flex flex-col justify-end" style={{ height: "160px" }}>
              <div
                className={`w-full rounded-t transition-colors duration-200 ${
                  val > 0 ? (hovered === i ? "bg-sky-400" : "bg-sky-500") : "bg-zinc-800"
                }`}
                style={{ height: `${h}px` }}
              />
            </div>
            <span className="text-zinc-600 text-[10px]">{MONTHS[i]}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MonthlyIncome = () => {
  const [chartType, setChartType] = useState("bar");
  const { data, isLoading, isError, error, refetch } = useMonthlyRevenue();

  const revenueArray = Array.isArray(data) && data.length === 12 ? data : Array(12).fill(0);
  const totalAnnual  = revenueArray.reduce((s, n) => s + n, 0);
  const activeMonths = revenueArray.filter((n) => n > 0).length;
  const maxIncome    = Math.max(...revenueArray, 0);

  const lastActiveIdx = revenueArray.reduceRight((f, v, i) => f === -1 && v > 0 ? i : f, -1);
  const currentIncome = lastActiveIdx !== -1 ? revenueArray[lastActiveIdx] : 0;
  const prevIncome    = lastActiveIdx > 0 ? revenueArray[lastActiveIdx - 1] : 0;
  const growth = prevIncome > 0
    ? (((currentIncome - prevIncome) / prevIncome) * 100).toFixed(1)
    : null;

  const kpis = [
    {
      label: lastActiveIdx !== -1 ? MONTHS[lastActiveIdx] : "This Month",
      value: `NPR ${currentIncome.toLocaleString('en-NP')}`,
      sub: growth !== null ? `${Number(growth) >= 0 ? "+" : ""}${growth}% vs prior month` : "First recorded month",
      icon: () => <span className="text-xs font-bold">NPR</span>, positive: growth === null || Number(growth) >= 0,
      iconColor: "text-sky-400", border: "border-sky-500/30",
    },
    {
      label: "Annual Revenue", value: `NPR ${totalAnnual.toLocaleString('en-NP')}`,
      sub: `${activeMonths} active month${activeMonths !== 1 ? "s" : ""}`,
      icon: TrendingUp, positive: true, iconColor: "text-emerald-400", border: "border-emerald-500/30",
    },
    {
      label: "Peak Month",
      value: maxIncome > 0 ? `NPR ${maxIncome.toLocaleString('en-NP')}` : "NPR 0",
      sub: maxIncome > 0 ? MONTHS[revenueArray.indexOf(maxIncome)] : "No data yet",
      icon: Gavel, positive: true, iconColor: "text-amber-400", border: "border-amber-500/30",
    },
    {
      label: "Monthly Avg",
      value: activeMonths > 0 ? `NPR ${Math.round(totalAnnual / activeMonths).toLocaleString('en-NP')}` : "NPR 0",
      sub: "Across active months",
      icon: Calendar, positive: true, iconColor: "text-violet-400", border: "border-violet-500/30",
    },
  ];

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto text-red-400" size={40} />
          <p className="text-zinc-400 text-sm">
            {error?.response?.data?.message ?? "Failed to load revenue data"}
          </p>
          <button onClick={() => refetch()}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700
              text-zinc-200 text-sm rounded-lg transition-colors">
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">

      {/* Header */}
      <div className="mb-8 flex items-start gap-3">
        <div className="mt-1 h-8 w-1 rounded-full bg-gradient-to-b from-sky-400 to-violet-500 shrink-0" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Monthly Revenue</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Super Admin · Commission Earnings</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
                <div className="h-8 w-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))
          : kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label}
                  className={`bg-zinc-900 border ${kpi.border} rounded-xl p-5 flex justify-between
                    items-start hover:scale-[1.02] transition-transform duration-200`}>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-bold text-zinc-50 tracking-tight">{kpi.value}</p>
                    <p className={`text-xs font-medium ${kpi.positive ? "text-emerald-400" : "text-red-400"}`}>
                      {kpi.sub}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-zinc-800 ${kpi.iconColor}`}>
                    <Icon size={18} />
                  </div>
                </div>
              );
            })}
      </div>

      {/* Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-zinc-300">Revenue Overview</h2>
          <div className="flex bg-zinc-800 border border-zinc-700 rounded-lg p-1 gap-1">
            {["bar", "area"].map((t) => (
              <button key={t} onClick={() => setChartType(t)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${
                  chartType === t
                    ? "bg-zinc-700 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-52 bg-zinc-800 rounded-lg animate-pulse" />
        ) : totalAnnual === 0 ? (
          <div className="h-52 flex items-center justify-center text-zinc-600 text-sm">
            No revenue recorded yet
          </div>
        ) : chartType === "bar" ? (
          <BarChart data={revenueArray} maxVal={maxIncome} />
        ) : (
          <AreaChart data={revenueArray} maxVal={maxIncome} />
        )}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-300">Monthly Breakdown</h2>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Month", "Revenue", "vs Prior Month", "% of Annual"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs text-zinc-500 uppercase tracking-widest font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((month, i) => {
                  const income  = revenueArray[i] ?? 0;
                  const prev    = revenueArray[i - 1] ?? 0;
                  const g       = prev > 0 ? (((income - prev) / prev) * 100).toFixed(1) : null;
                  const pct     = totalAnnual > 0 ? ((income / totalAnnual) * 100).toFixed(1) : "0.0";
                  const isEmpty = income === 0;
                  return (
                    <tr key={month}
                      className={`border-b border-zinc-800/60 transition-colors ${
                        isEmpty ? "opacity-40" : "hover:bg-zinc-800/50"
                      }`}>
                      <td className="px-6 py-3 text-sm font-medium text-zinc-300">{month}</td>
                      <td className={`px-6 py-3 text-sm font-bold ${isEmpty ? "text-zinc-600" : "text-zinc-50"}`}>
                        {isEmpty ? "—" : `NPR ${income.toLocaleString('en-NP')}`}
                      </td>
                      <td className="px-6 py-3">
                        {g !== null && !isEmpty ? (
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold
                            px-2 py-0.5 rounded border ${
                              Number(g) >= 0
                                ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
                                : "text-red-400 border-red-500/40 bg-red-500/10"
                            }`}>
                            {Number(g) >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {Number(g) >= 0 ? "+" : ""}{g}%
                          </span>
                        ) : (
                          <span className="text-zinc-700 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {isEmpty ? (
                          <span className="text-zinc-700 text-sm">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full"
                                style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-zinc-400 text-xs">{pct}%</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default MonthlyIncome;