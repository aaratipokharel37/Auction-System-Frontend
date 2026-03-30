import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPaymentProofs,
  getPaymentProofDetail,
  updatePaymentProofStatus,
  deletePaymentProof,
} from "@/queries/admin/paymentproofs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ["Pending", "Approved", "Rejected", "Settled"];

const STATUS_MAP = {
  Pending:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  Settled:  "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

function formatCurrency(n) {
  return "NPR " + Number(n || 0).toLocaleString("en-NP", { minimumFractionDigits: 2 });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${STATUS_MAP[status] ?? STATUS_MAP.Pending}`}>
    {status === "Pending" && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />}
    {status}
  </span>
);

const StatCard = ({ icon, label, value }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-3 text-yellow-400">
      {icon}
    </div>
    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}>
      {value}
    </p>
  </div>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────

const DeleteModal = ({ proof, onConfirm, onCancel, isDeleting }) => (
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
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="text-white font-semibold text-center mb-1">Delete Payment Proof</h3>
        <p className="text-zinc-500 text-sm text-center mb-1">Are you sure you want to delete proof</p>
        <p className="text-yellow-400 text-sm font-semibold text-center mb-5">
          #{String(proof?._id).slice(-8).toUpperCase()}?
        </p>
        <p className="text-zinc-600 text-xs text-center mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <><div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />Deleting...</>
            ) : "Delete"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Detail / Edit Dialog (shadcn) ─────────────────────────────────────────────

const DetailDialog = ({ open, onOpenChange, proof, onDelete, onSave, isSaving }) => {
  const [editAmount, setEditAmount] = useState(String(proof?.amount ?? ""));
  const [editStatus, setEditStatus] = useState(proof?.status ?? "Pending");

  if (!proof) return null;

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Payment Proof</DialogTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              #{String(proof._id).slice(-8).toUpperCase()} · {proof.userId?.userName || "Unknown"}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Proof image */}
          {proof?.proof?.url && (
            <div className="rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
              <img src={proof.proof.url} alt="proof" className="w-full max-h-48 object-contain" />
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Amount Paid", formatCurrency(proof.amount), "text-yellow-400"],
              ["Current Status", null, ""],
              ...(proof.comment ? [["Comment", proof.comment, "text-zinc-300"]] : []),
            ].map(([label, val, cls], i) => (
              <div
                key={i}
                className={`bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/50 ${
                  label === "Comment" ? "col-span-2" : ""
                }`}
              >
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                {label === "Current Status" ? (
                  <StatusBadge status={proof.status} />
                ) : (
                  <p className={`text-sm font-semibold ${cls}`}>{val}</p>
                )}
              </div>
            ))}
          </div>

          {/* Edit fields - only when pending */}
          {proof.status === "Pending" ? (
            <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/50 space-y-3">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Update Proof</p>

              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Amount</label>
                <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden focus-within:border-yellow-400/50 transition-colors">
                  <span className="px-3 text-yellow-400 font-bold text-sm border-r border-zinc-700">NPR</span>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {["Approved", "Rejected", "Settled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        editStatus === s
                          ? STATUS_MAP[s]
                          : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">
              This proof has been {proof.status.toLowerCase()} and can no longer be updated.
            </p>
          )}

          {/* Actions */}
          <DialogFooter className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => {
                onDelete(proof);
                handleClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors"
            >
              Delete
            </button>
            {proof.status === "Pending" && (
              <button
                onClick={() => onSave({ id: proof._id, status: editStatus, amount: Number(editAmount) })}
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-zinc-900 text-sm font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(250,204,21,0.25)]"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PaymentProofList() {
  const queryClient = useQueryClient();
  const [selected, setSelected]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const { data, isLoading, error } = useQuery({
    queryKey: ["payment-proofs"],
    queryFn: getAllPaymentProofs,
  });

  console.log(data);

  const { mutate: fetchDetail, isPending: isDetailLoading } = useMutation({
    mutationFn: (id) => getPaymentProofDetail(id),
    onSuccess: (data) => setSelected(data.paymentProofDetail),
  });

  const { mutate: handleSave, isPending: isSaving } = useMutation({
    mutationFn: updatePaymentProofStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-proofs"] });
      setSelected(null);
    },
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deletePaymentProof(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-proofs"] });
      setDeleteTarget(null);
    },
  });

  const proofs = data?.paymentProofs ?? [];

  const filtered = proofs.filter((p) =>
    filterStatus === "All" ? true : p.status === filterStatus
  );

  const stats = {
    total:        proofs.length,
    pending:      proofs.filter((p) => p.status === "Pending").length,
    approved:     proofs.filter((p) => p.status === "Approved").length,
    total_amount: proofs.reduce((a, p) => a + (Number(p.amount) || 0), 0),
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Loading payment proofs...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-400 text-sm mb-2">Failed to fetch payment proofs.</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["payment-proofs"] })}
          className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl text-sm font-semibold hover:bg-yellow-400/20 transition-colors"
        >Retry</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>}
          label="Total Proofs" value={stats.total}
        />
        <StatCard
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          label="Pending" value={stats.pending}
        />
        <StatCard
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          label="Approved" value={stats.approved}
        />
        <StatCard
          icon={<span className="text-sm font-bold">NPR</span>}
          label="Total Amount" value={"NPR " + stats.total_amount.toLocaleString('en-NP')}
        />
      </div>

      {/* Main Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-white">All Payment Proofs</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{filtered.length} of {proofs.length} submissions</p>
          </div>
          {/* Filter pills */}
          <div className="flex items-center gap-1 bg-zinc-800 rounded-xl p-1 border border-zinc-700">
            {["All", ...STATUSES].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === f
                    ? "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                </svg>
              </div>
              <p className="text-zinc-500 text-sm">No payment proofs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((proof) => (
                <div
                  key={proof._id}
                  className="group bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-600 transition-all duration-200"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-zinc-600 bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700">
                      #{String(proof._id).slice(-8).toUpperCase()}
                    </span>
                    <StatusBadge status={proof.status} />
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Amount</p>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}>
                      {formatCurrency(proof.amount)}
                    </p>
                  </div>

                  {/* User + date */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-xs font-black text-yellow-400 shrink-0">
                      {(proof.userId?.userName || "U").toString().charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200 font-medium truncate">
                        {proof.userId?.userName || "Unknown"}
                      </p>
                      <p className="text-[11px] text-zinc-600 font-mono">
                        {proof.createdAt
                          ? new Date(proof.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1 border-t border-zinc-700/50">
                    <button
                      onClick={() => fetchDetail(proof._id)}
                      disabled={isDetailLoading}
                      className="flex-1 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => setDeleteTarget(proof)}
                      className="flex-1 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-semibold hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6m4-6v6"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-xs text-zinc-600">Showing {filtered.length} results</p>
        </div>
      </div>

      {/* Detail Dialog */}
      {selected && (
        <DetailDialog
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
          proof={selected}
          onDelete={(proof) => setDeleteTarget(proof)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          proof={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}