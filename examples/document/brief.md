# Shared brief

Illustrative scenario. Dates, limits, and team responsibilities are fictional.

Prepare a rollout review for the new customer onboarding flow. Explain the
decision, ownership, activation workflow, launch gates, risks, and next steps
so the operations team can review it.

Use these facts:

- Pilot: 20 invited accounts on 2 November 2026, using the current billing integration.
- Scope: no existing-account migration and no new payment method.
- Validate each incoming request. Invalid requests return an error with a reason.
- For valid requests, attempt payment. Unconfirmed payment returns an error with
  a reason. Provision only after confirmed payment, then send the receipt.
- Operations owns validation and triage; Billing reconciles payment status;
  Platform owns provisioning and rollback; Support owns receipt resend and communication.
- Readiness check: 28 October. Joint Operations and Billing sign-off: 30 October.
  Pilot: 2 November. Review: 5 November. Both teams must approve before invitations.
- Stop new invitations if a payment/provisioning mismatch appears. Reconcile it
  before resuming. Do not automatically refund or delete existing accounts.
- A failed receipt delivery leaves the account active. Support resends it;
  do not charge or provision again. Use the request ID to prevent duplicate processing.
- Report request, confirmed-payment, provisioned-account, and receipt counts
  daily at 13:00 UTC. Do not claim cohort conversion unless the records are linked.
- Next steps: Operations checks invalid-request cases by 28 October; Billing
  tests unconfirmed payments by 28 October; Platform rehearses rollback by
  30 October; Support prepares receipt recovery by 30 October.
- Open decisions: whether to expand beyond the pilot after review, and who
  covers payment reconciliation outside normal support hours.

Compare the [plain reply](before.md) and [structured document](after.md).
