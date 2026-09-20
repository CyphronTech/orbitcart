// Cookie / storage consent.
//
// The site only needs one optional category:
//   security - Google reCAPTCHA (via Firebase App Check) that protects the
//              contact form from spam. It is never loaded unless allowed.
// There is no analytics, advertising or social tracking to consent to.
//
// The choice itself is stored in localStorage (strictly necessary: it only
// remembers your answer) and expires after 12 months so we ask again.

const STORAGE_KEY = "cyphron_consent_v1";
const CONSENT_VERSION = 1;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const listeners = new Set();
let memoryConsent = null;

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return memoryConsent;
  }
}

export function readConsent() {
  const value = readStored();

  if (!value || value.version !== CONSENT_VERSION || typeof value.security !== "boolean") {
    return null;
  }

  if (typeof value.timestamp !== "number" || Date.now() - value.timestamp > MAX_AGE_MS) {
    return null;
  }

  return value;
}

export function saveConsent({ security }) {
  const value = { version: CONSENT_VERSION, security: Boolean(security), timestamp: Date.now() };
  memoryConsent = value;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }

  listeners.forEach((listener) => listener());
  return value;
}

export function subscribeConsent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Lets any "Cookie settings" link reopen the banner.
export const CONSENT_OPEN_EVENT = "cyphron:open-consent";

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
