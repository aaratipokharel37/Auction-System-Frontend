import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAuctions,
  adminDeleteAuction,
  adminApproveAuction,
  adminRejectAuction,
} from "@/queries/auction";
import { getApprovalState, approvalShortLabel } from "@/lib/auction-approval";
import { toast } from "sonner";

const FILTERS = ["All", "Live", "Upcoming", "Ended"];

function getStatus(startTime, endTime) {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "ended";
}

function formatCountdown(endTime, startTime) {
  const now = Date.now();
  const status = getStatus(startTime, endTime);
  if (status === "ended") return "Ended";
  const target =
    status === "upcoming"
      ? new Date(startTime).getTime()
      : new Date(endTime).getTime();
  const diff = target - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 23) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m`;
}

function formatCurrency(n) {
  return "NPR " + Number(n).toLocaleString('en-NP');
}

const StatusBadge = ({ status }) => {
  const map = {
    live: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    upcoming: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    ended: "bg-zinc-700/40 text-zinc-500 border-zinc-700/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${map[status]}`}
    >
      {status === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ModerationBadge = ({ state }) => {
  const map = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${map[state] ?? map.approved}`}
    >
      {state === "pending" && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
      {approvalShortLabel(state)}
    </span>
  );
};

const StatCard = ({ icon, label, value, change, changeType }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-3 text-yellow-400">
      {icon}
    </div>
    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p
      className="text-2xl font-bold text-white"
      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}
    >
      {value}
    </p>
    <p className={`text-[11px] mt-1 font-medium ${changeType === "up" ? "text-emerald-400" : "text-zinc-500"}`}>
      {change}
    </p>
  </div>
);

// Delete Confirmation Modal
const DeleteModal = ({ auction, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onCancel}>
    <div
      className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm mx-4 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      style={{ animation: "modalIn .2s cubic-bezier(.34,1.56,.64,1)" }}
    >
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
      <div className="p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="text-white font-semibold text-center mb-1">Delete Auction</h3>
        <p className="text-zinc-500 text-sm text-center mb-1">
          Are you sure you want to delete
        </p>
        <p className="text-yellow-400 text-sm font-semibold text-center mb-5">
          "{auction?.title}"?
        </p>
        <p className="text-zinc-600 text-xs text-center mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : "Delete"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Detail Modal
const AuctionModal = ({
  auction,
  onClose,
  onDelete,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}) => {
  if (!auction) return null;
  const status = getStatus(auction.startTime, auction.endTime);
  const modState = getApprovalState(auction);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn .2s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {/* Modal Header */}
        <div className="bg-zinc-800/60 border-b border-zinc-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={auction.image?.url}
              alt={auction.title}
              className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
            />
            <div>
              <h3 className="font-semibold text-white">{auction.title}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                #{auction._id?.slice(-6).toUpperCase()} · {auction.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >✕</button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-zinc-400 bg-zinc-800/40 rounded-xl p-3 border border-zinc-700/50">
            {auction.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["Current Bid", auction.currentBid > 0 ? formatCurrency(auction.currentBid) : "No bids", "text-yellow-400"],
              ["Starting Bid", formatCurrency(auction.startingBid), "text-zinc-300"],
              ["Total Bids", auction.bids?.length ?? 0, "text-zinc-300"],
              ["Condition", auction.condition, "text-zinc-300"],
            ].map(([label, val, cls]) => (
              <div key={label} className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/50">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-sm font-semibold ${cls}`}>{val}</p>
              </div>
            ))}
          </div>

          <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/50 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Moderation</p>
              <ModerationBadge state={modState} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Schedule</p>
              <StatusBadge status={status} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                {status === "ended" ? "Ended" : status === "upcoming" ? "Starts In" : "Ends In"}
              </p>
              <p className={`text-sm font-semibold ${status === "ended" ? "text-zinc-500" : status === "live" ? "text-emerald-400" : "text-yellow-400"}`}>
                {formatCountdown(auction.endTime, auction.startTime)}
              </p>
            </div>
          </div>

          {/* Top Bidders */}
          {auction.bids?.length > 0 && (
            <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/50">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Top Bidders</p>
              <div className="space-y-2">
                {[...auction.bids]
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .map((bid, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={bid.profileImage} alt={bid.userName} className="w-6 h-6 rounded-full object-cover border border-zinc-700" />
                        <span className="text-xs text-zinc-300">{bid.userName}</span>
                      </div>
                      <span className="text-xs font-semibold text-yellow-400">{formatCurrency(bid.amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            {modState === "pending" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(auction._id)}
                  disabled={isApproving || isRejecting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  {isApproving ? "Approving…" : "Approve listing"}
                </button>
                <button
                  type="button"
                  onClick={() => onReject(auction._id)}
                  disabled={isApproving || isRejecting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {isRejecting ? "Rejecting…" : "Reject"}
                </button>
              </div>
            )}
            <button
              onClick={() => { onDelete(auction); onClose(); }}
              className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors"
            >
              Delete Auction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Auctions() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [, setTick] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["all-auctions"],
    queryFn: getAllAuctions,
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id) => adminDeleteAuction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["public-auctions"] });
      setDeleteTarget(null);
    },
    onError: (err) => {
      console.error("Delete failed:", err);
      setDeleteTarget(null);
    },
  });

  const { mutate: approveAuction, isPending: isApproving } = useMutation({
    mutationFn: adminApproveAuction,
    onSuccess: (data) => {
      toast.success(data?.message || "Listing approved");
      queryClient.invalidateQueries({ queryKey: ["all-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["public-auctions"] });
      setSelected(null);
    },
    onError: (err) => toast.error(err?.message || "Could not approve listing"),
  });

  const { mutate: rejectAuction, isPending: isRejecting } = useMutation({
    mutationFn: adminRejectAuction,
    onSuccess: (data) => {
      toast.success(data?.message || "Listing rejected");
      queryClient.invalidateQueries({ queryKey: ["all-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["public-auctions"] });
      setSelected(null);
    },
    onError: (err) => toast.error(err?.message || "Could not reject listing"),
  });

  const confirmReject = (id) => {
    if (
      !confirm(
        "Reject this listing? It will remain hidden from the public catalog until you delete it or the seller resubmits."
      )
    ) {
      return;
    }
    rejectAuction(id);
  };

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const auctions = data?.items ?? [];

  const filtered = auctions.filter((a) => {
    const status = getStatus(a.startTime, a.endTime);
    const matchFilter = filter === "All" || status === filter.toLowerCase();
    const matchSearch =
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase()) ||
      a._id?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: auctions.length,
    pendingApproval: auctions.filter((a) => getApprovalState(a) === "pending").length,
    live: auctions.filter((a) => getStatus(a.startTime, a.endTime) === "live").length,
    bids: auctions.reduce((s, a) => s + (a.bids?.length ?? 0), 0),
    revenue: auctions
      .filter((a) => getStatus(a.startTime, a.endTime) === "ended")
      .reduce((s, a) => s + (a.currentBid ?? 0), 0),
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Loading auctions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-400 text-sm mb-2">Failed to fetch auctions.</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["all-auctions"] })}
          className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl text-sm font-semibold hover:bg-yellow-400/20 transition-colors"
        >Retry</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .row-hover:hover td { background: rgba(250,204,21,0.03); }
      `}</style>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 10H3m11 4H3m11 4H3M17 3l4 4-4 4"/></svg>}
          label="Total Auctions" value={stats.total}
          change={stats.pendingApproval > 0 ? `${stats.pendingApproval} awaiting approval` : "All time"}
          changeType="neutral"
        />
        <StatCard
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          label="Live Now" value={stats.live} change="Active auctions" changeType="up"
        />
        <StatCard
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>}
          label="Total Bids" value={stats.bids.toLocaleString('en-NP')} change="Across all auctions" changeType="up"
        />
        <StatCard
          icon={<span className="text-sm font-bold">NPR</span>}
          label="Revenue" value={"NPR " + stats.revenue.toLocaleString('en-NP')} change="From ended auctions" changeType="up"
        />
      </div>

      {/* Table Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-white">All Auctions</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {filtered.length} of {auctions.length} auctions
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap items-center justify-end gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2">
                <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search auctions..."
                  className="bg-transparent text-xs text-white placeholder-zinc-600 outline-none w-36"
                />
              </div>
              {/* Schedule filters */}
              <div className="flex items-center gap-1 bg-zinc-800 rounded-xl p-1 border border-zinc-700">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filter === f
                        ? "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >{f}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Item", "Category", "Condition", "Moderation", "Current Bid", "Bids", "Ends In", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-zinc-600 text-sm">
                    No auctions found
                  </td>
                </tr>
              ) : (
                filtered.map((auction) => {
                  const status = getStatus(auction.startTime, auction.endTime);
                  const modState = getApprovalState(auction);
                  return (
                    <tr key={auction._id} className="row-hover border-b border-zinc-800/60 last:border-0 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={auction.image?.url}
                            alt={auction.title}
                            className="w-9 h-9 rounded-lg object-cover border border-zinc-700 flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-medium text-white">{auction.title}</p>
                            <p className="text-[11px] text-zinc-600">#{auction._id?.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{auction.category}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                          auction.condition === "New"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-orange-500/10 text-orange-400"
                        }`}>
                          {auction.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4"><ModerationBadge state={modState} /></td>
                      <td className="px-6 py-4 text-sm font-semibold text-yellow-400">
                        {auction.currentBid > 0
                          ? formatCurrency(auction.currentBid)
                          : <span className="text-zinc-600 font-normal">No bids</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{auction.bids?.length ?? 0}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          status === "ended" ? "text-zinc-600"
                          : status === "live" ? "text-emerald-400"
                          : "text-yellow-400"
                        }`}>
                          {formatCountdown(auction.endTime, auction.startTime)}
                        </span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setSelected(auction)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              status === "live"
                                ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
                                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                            }`}
                          >View</button>
                          {modState === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => approveAuction(auction._id)}
                                disabled={isApproving || isRejecting}
                                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50"
                              >Approve</button>
                              <button
                                type="button"
                                onClick={() => confirmReject(auction._id)}
                                disabled={isApproving || isRejecting}
                                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                              >Reject</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-xs text-zinc-600">Showing {filtered.length} results</p>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <AuctionModal
          auction={selected}
          onClose={() => setSelected(null)}
          onDelete={(auction) => setDeleteTarget(auction)}
          onApprove={(id) => approveAuction(id)}
          onReject={(id) => confirmReject(id)}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteModal
          auction={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}