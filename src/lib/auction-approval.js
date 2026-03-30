/**
 * Auction moderation: items may carry `approvalStatus` or `isApproved` from the API.
 * Legacy documents without these fields are treated as approved so existing listings stay visible.
 */

export const APPROVAL_PENDING = "pending"
export const APPROVAL_APPROVED = "approved"
export const APPROVAL_REJECTED = "rejected"

/**
 * @param {object | undefined} auction
 * @returns {'pending' | 'approved' | 'rejected'}
 */
export function getApprovalState(auction) {
  if (!auction) return APPROVAL_APPROVED
  if (auction.approvalStatus != null && auction.approvalStatus !== "") {
    const s = String(auction.approvalStatus).toLowerCase()
    if (s === APPROVAL_PENDING || s === APPROVAL_REJECTED || s === APPROVAL_APPROVED) {
      return s
    }
  }
  if (typeof auction.isApproved === "boolean") {
    return auction.isApproved ? APPROVAL_APPROVED : APPROVAL_PENDING
  }
  return APPROVAL_APPROVED
}

/**
 * Whether this auction should appear on the public home / live listing.
 */
export function isAuctionPubliclyVisible(auction) {
  return getApprovalState(auction) === APPROVAL_APPROVED
}

export function approvalLabel(state) {
  switch (state) {
    case APPROVAL_PENDING:
      return "Pending approval"
    case APPROVAL_REJECTED:
      return "Rejected"
    default:
      return "Approved"
  }
}

export function approvalShortLabel(state) {
  switch (state) {
    case APPROVAL_PENDING:
      return "Pending"
    case APPROVAL_REJECTED:
      return "Rejected"
    default:
      return "Approved"
  }
}
