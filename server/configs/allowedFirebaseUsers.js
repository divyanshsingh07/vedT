import firebaseAdmin from "./firebaseAdmin.js";

// In-memory snapshot of Firebase users present at server startup.
// This prevents brand-new Firebase accounts from being treated as allowed automatically.
const allowedEmailSet = new Set();

async function initializeAllowedFirebaseUsers() {
  try {
    if (!firebaseAdmin?.auth) {
      return;
    }
    if (typeof firebaseAdmin.auth !== 'function') {
      return;
    }
    const auth = firebaseAdmin.auth();
    if (!auth?.listUsers) {
      return;
    }

    let nextPageToken = undefined;
    do {
      const result = await auth.listUsers(1000, nextPageToken);
      (result.users || []).forEach((user) => {
        if (user?.email) {
          allowedEmailSet.add(user.email.trim().toLowerCase());
        }
      });
      nextPageToken = result.pageToken;
    } while (nextPageToken);
  } catch (err) {
    // Non-fatal; fallback checks will apply
    console.warn("[allowedFirebaseUsers] Initialization failed:", err?.message || err);
  }
}

// Kick off initialization (best-effort)
initializeAllowedFirebaseUsers();

export function isFirebaseEmailAllowed(email) {
  const e = (email || "").trim().toLowerCase();
  if (!e) return false;

  // Optional server-side explicit allowlist override
  const csv = (process.env.ALLOWED_USER_EMAILS || "").trim();
  if (csv) {
    const list = csv.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (list.includes(e)) return true;
    return false;
  }

  return allowedEmailSet.has(e);
}

export default {
  isFirebaseEmailAllowed
};


