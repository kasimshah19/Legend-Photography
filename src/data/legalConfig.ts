export const legalConfig = {
  businessName: "Legend Photography",
  lastUpdated: "2026-09-27",
  contactEmail: process.env.NEXT_PUBLIC_EMAIL ?? null,
  contactPhone: process.env.NEXT_PUBLIC_PHONE ?? null,
  businessAddress: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? null,
  
  // Policies - leave null if not defined by business
  bookingAdvance: null,
  paymentTerms: null,
  cancellationWindow: null,
  cancellationPolicy: null,
  refundPolicy: null,
  reschedulingPolicy: null,
  deliveryTimeline: null,
  governingLaw: null,
  jurisdiction: null,
};
