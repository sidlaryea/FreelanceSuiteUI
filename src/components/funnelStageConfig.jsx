export const FunnelStageEnum  = {
 0: "DraftStarted",
  1: "ProposalPreviewGenerated",
  2: "EmailCaptured",
  3: "EstimateViewed",
  4: "ConsultationRequested",
  5: "InvoiceAccepted",
  6: "PaymentInitiated",
  7: "ConvertedToProposal",
  8: "ProposalSent",
  9: "ProposalAccepted",
  10: "ProjectActive",
  11: "ProjectCompleted",
  12: "ClosedLost",
  13: "ProposalRejected",
};

export const funnelStageConfig = {
  DraftStarted: {
    label: "Draft",
    color: "amber",
    message: "Draft · editing in progress",
  },

  ProposalPreviewGenerated: {
    label: "Preview Ready",
    color: "blue",
    message: "Preview generated",
  },

  EmailCaptured: {
    label: "Lead Captured",
    color: "purple",
    message: "Client email captured",
  },

  EstimateViewed: {
    label: "Viewed",
    color: "blue",
    message: "Client has viewed estimate",
  },

  ConsultationRequested: {
    label: "Consultation",
    color: "indigo",
    message: "Consultation requested",
  },

  InvoiceAccepted: {
    label: "Invoice Accepted",
    color: "green",
    message: "Client accepted invoice",
  },

  PaymentInitiated: {
    label: "Payment Started",
    color: "yellow",
    message: "Payment in progress",
  },

  ConvertedToProposal: {
    label: "Converted",
    color: "cyan",
    message: "Converted to proposal",
  },

  ProposalSent: {
    label: "Sent",
    color: "yellow",
    message: "Proposal sent to client",
  },

  ProposalAccepted: {
    label: "Accepted",
    color: "green",
    message: "Proposal approved",
  },

  ProjectActive: {
    label: "In Progress",
    color: "blue",
    message: "Project is active",
  },

  ProjectCompleted: {
    label: "Completed",
    color: "green",
    message: "Project completed",
  },

  ClosedLost: {
    label: "Lost",
    color: "red",
    message: "Opportunity lost",
  },

  ProposalRejected: {
    label: "Rejected",
    color: "red",
    message: "Proposal rejected",
  },
};