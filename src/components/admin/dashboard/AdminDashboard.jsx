import { useState } from "react";
import Auctions from "../auctions/Auctions";
import {
  Gavel,
  CreditCard,
  TrendingUp,
  LogOut,
  User,
  Mail,
  Shield,
  ChevronRight,
} from "lucide-react";
import PaymentProofList from "../paymentproofs/PaymentProofList";
import MonthlyIncome from "../monthlyincome/MonthlyIncome";
import { useMe } from "@/queries/admin/me";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const sidebarItems = [
  { id: "auctions", label: "Auctions", icon: Gavel },
  { id: "payment-proof", label: "Payment Proof", icon: CreditCard },
  { id: "monthly-income", label: "Monthly Income", icon: TrendingUp },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("auctions");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: user } = useMe();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate({ to: "/login" });
    } catch {
      toast.error("Unable to logout");
    }
  };

  const activeLabel = sidebarItems.find((i) => i.id === active)?.label;

  const avatarInitials = user?.userName
    ? user.userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="flex h-screen bg-zinc-950 text-white overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
        .sidebar-item { transition: all 0.18s ease; }
        .sidebar-item:hover { background: rgba(250,204,21,0.08); }
        .sidebar-item.active { background: rgba(250,204,21,0.12); border-left: 3px solid #facc15; }
        .glow { box-shadow: 0 0 30px rgba(250,204,21,0.12); }
        .avatar-ring { box-shadow: 0 0 0 2px #facc15, 0 0 16px rgba(250,204,21,0.3); }
        .popover-enter { animation: popIn 0.18s cubic-bezier(.34,1.56,.64,1); }
        @keyframes popIn { from { opacity:0; transform: translateY(8px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }
        .badge { background: linear-gradient(135deg, #facc15, #f59e0b); }
      `}</style>

      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-zinc-900 border-r border-zinc-800 relative z-10">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg badge flex items-center justify-center">
              <Gavel size={16} className="text-zinc-900" />
            </div>
            <span
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
              className="text-xl text-white"
            >
              EliteAuction
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-1 font-medium">Admin Control Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
            Management
          </p>
          {sidebarItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                active === id
                  ? "active text-yellow-400"
                  : "text-zinc-400 hover:text-white border-l-3"
              }`}
            >
              <Icon size={17} className={active === id ? "text-yellow-400" : "text-zinc-500"} />
              {label}
              {active === id && (
                <ChevronRight size={13} className="ml-auto text-yellow-500 opacity-70" />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-zinc-800 relative">
          <button
            onClick={() => setPopoverOpen((v) => !v)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer group"
          >
            {user?.profileImage?.url ? (
              <img
                src={user.profileImage.url}
                alt={user.userName}
                className={`w-9 h-9 rounded-full object-cover flex-shrink-0 ${popoverOpen ? "avatar-ring" : ""}`}
              />
            ) : (
              <div className={`w-9 h-9 rounded-full badge flex items-center justify-center text-zinc-900 font-bold text-sm flex-shrink-0 ${popoverOpen ? "avatar-ring" : ""}`}>
                {avatarInitials}
              </div>
            )}
            <div className="text-left min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.userName ?? "Loading..."}</p>
              <p className="text-[11px] text-yellow-500 font-medium">{user?.role ?? "—"}</p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 my-0.5" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            </div>
          </button>

          {/* Popover */}
          {popoverOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setPopoverOpen(false)} />
              <div className="popover-enter absolute bottom-20 left-3 right-3 z-30 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 border-b border-zinc-700">
                  <div className="flex items-center gap-3">
                    {user?.profileImage?.url ? (
                      <img src={user.profileImage.url} alt={user.userName}
                        className="w-12 h-12 rounded-full object-cover avatar-ring" />
                    ) : (
                      <div className="w-12 h-12 rounded-full badge flex items-center justify-center text-zinc-900 font-bold text-base avatar-ring">
                        {avatarInitials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-sm">{user?.userName ?? "—"}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold badge text-zinc-900 px-2 py-0.5 rounded-full mt-0.5">
                        <Shield size={9} />
                        {user?.role ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info rows */}
                <div className="p-3 space-y-1">
                  <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
                    <Mail size={13} className="text-zinc-500 flex-shrink-0" />
                    <span className="text-xs text-zinc-400 truncate">{user?.email ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
                    <User size={13} className="text-zinc-500 flex-shrink-0" />
                    <span className="text-xs text-zinc-400">Member since {joinedDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-3 pb-3 space-y-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
              className="text-2xl text-white leading-none"
            >
              {activeLabel}
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-zinc-950">
          {active === "auctions" && <Auctions />}
          {active === "payment-proof" && <PaymentProofList />}
          {active === "monthly-income" && <MonthlyIncome />}
        </div>
      </main>
    </div>
  );
}