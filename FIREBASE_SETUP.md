# Firebase Contact Form Setup

This site writes contact form submissions to Cloud Firestore using the Firebase Web SDK.

The site is now a static React 18 app. Run `npm install` once and `npm run build` after content changes (it regenerates the HTML pages). Test it through an HTTP server or Firebase Hosting; opening `index.html` with `file://` will block module scripts and Firebase imports in modern browsers.

## Required Firebase values

Send only the Firebase Web App config from Firebase Console:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

Do not send service-account JSON, private keys, Admin SDK credentials, OAuth client secrets, or reCAPTCHA secret keys. Those do not belong in a public static website.

## Configure the project

1. Enable Cloud Firestore in Firebase Console.
2. Copy the Web App config into `assets/firebase-config.js` inside `window.cyphronContactFirebase.firebaseConfig`.
3. Set `contactFormSettings.enabled` to `true`.
4. Keep `collectionName` as `contactSubmissions` unless you also update `firestore.rules`.
5. Paste or deploy `firestore.rules` in Firebase Console before going live.
6. For production abuse protection, register a reCAPTCHA v3 key, add the public site key to `contactFormSettings.appCheck.siteKey`, then set `contactFormSettings.appCheck.enabled` to `true`. The site intentionally refuses Firestore writes and falls back to an email draft until App Check is configured.
7. Restrict the Firebase Web API key in Google Cloud Console to the production domain and local development domains you use.
8. Keep the Hosting CSP in `firebase.json` aligned with the Firebase and reCAPTCHA sources before deployment. React is served from this site, so it needs no external source.

## Stored fields

Each contact submission (`contactSubmissions`) stores only what is needed to reply, plus proof of consent:

- `name`, `email`, `project`, `brief`
- `consent` (must be `true`; the tick box covers being 18 or older, reading the Privacy Policy and agreeing to the reply use) and `consentVersion` (the privacy policy version agreed to)
- `source`, `status`, `createdAt`

Each privacy request (`privacyRequests`) stores `name`, `email`, `requestType`, `details`, `source`, `status`, `createdAt`.

Firestore rules allow public create-only writes to those two collections and block all reads, updates, deletes, and unrelated collections from the client.

Deploy the rules and the site together: `firebase deploy --only firestore:rules,hosting`. Firebase Analytics is intentionally not loaded; if you add it, add a consent category first.

## Checking submissions

Submissions appear in Firebase Console under Firestore Database, not Realtime Database. Open the `contactSubmissions` collection to see new records.

The website only shows the success state after Firestore accepts the write. If Firestore is unavailable or the rules are not deployed, the form prepares a `mailto:` draft to `cyphrontechllp@gmail.com` with the submitted details.

To send automatic email notifications without relying on the visitor's email app, add a server-side integration such as the Firebase Trigger Email extension, a Cloud Function, or a CRM webhook endpoint. Do not put SMTP passwords, service-account keys, or CRM secrets in the static website.
