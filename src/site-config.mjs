// Single source of truth for business details shown across the site
// (footer, contact section, legal pages).
//
// Anything left as an empty string is simply not rendered, so it is safe to
// fill these in later. Please complete the empty ones: Indian law expects a
// registered business to publish its legal name, registered address and a
// grievance officer, and the legal pages refer to them.

export const SITE = {
  brand: "CyphronTech",
  legalName: "Cyphrontech LLP",
  url: "https://cyphrontech.com",

  email: "cyphrontechllp@gmail.com",
  phone: "+918275257252",
  phoneDisplay: "+91 82752 57252",
  linkedin: "https://www.linkedin.com/company/cyphron-tech",
  linkedinDisplay: "linkedin.com/company/cyphron-tech",

  // --- Fill these in ---------------------------------------------------
  registeredAddress: "", // e.g. "Office no., Building, Street, City, State PIN, India"
  registrationNumber: "", // LLPIN, e.g. "AAA-0000"
  gstin: "", // GST number, if registered
  grievanceOfficer: {
    name: "", // person responsible for privacy/complaints
    email: "cyphrontechllp@gmail.com",
  },
  // ---------------------------------------------------------------------

  // Bump policyVersion whenever the Privacy Policy or Terms change in a way
  // that affects what visitors agreed to. It is stored with each submission.
  policyVersion: "2026-09-20",
  policiesUpdated: "20 September 2026",
  governingCountry: "India",
};

export const PRIVACY_REQUEST_TYPES = [
  "Get a copy of my data",
  "Correct my data",
  "Delete my data",
  "Withdraw my consent",
  "Complaint or other privacy question",
];
