import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_SESSION_KEY = "orbitcart.auth.session";
const REGISTERED_ACCOUNTS_KEY = "orbitcart.auth.registered";

const DEMO_ACCOUNT = {
  email: "maya@nrwholesale.co",
  password: "orbit-demo",
  displayName: "Maya Rao",
};

export type AuthUser = {
  displayName?: string;
  email: string;
  idToken: string;
  localId: string;
  refreshToken: string;
};

type RegisteredAccount = {
  email: string;
  password: string;
};

export function observeAuthState(callback: (user: AuthUser | null) => void) {
  let isSubscribed = true;

  AsyncStorage.getItem(AUTH_SESSION_KEY)
    .then((value) => {
      if (!isSubscribed) return;
      callback(value ? (JSON.parse(value) as AuthUser) : null);
    })
    .catch(() => {
      if (isSubscribed) callback(null);
    });

  return () => {
    isSubscribed = false;
  };
}

export async function signInWithEmail(email: string, password: string) {
  const trimmedEmail = email.trim();

  if (trimmedEmail.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase() && password === DEMO_ACCOUNT.password) {
    return saveSession(toAuthUser(DEMO_ACCOUNT.email, DEMO_ACCOUNT.displayName));
  }

  const registered = await getRegisteredAccounts();
  const match = registered.find((account) => account.email.toLowerCase() === trimmedEmail.toLowerCase());

  if (!match) {
    throw new Error("EMAIL_NOT_FOUND");
  }

  if (match.password !== password) {
    throw new Error("INVALID_PASSWORD");
  }

  return saveSession(toAuthUser(match.email));
}

export async function createDemoAccount(email: string, password: string) {
  const trimmedEmail = email.trim();

  if (password.length < 6) {
    throw new Error("WEAK_PASSWORD : Password should be at least 6 characters");
  }

  const registered = await getRegisteredAccounts();
  const exists =
    trimmedEmail.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase() ||
    registered.some((account) => account.email.toLowerCase() === trimmedEmail.toLowerCase());

  if (exists) {
    throw new Error("EMAIL_EXISTS");
  }

  await AsyncStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify([...registered, { email: trimmedEmail, password }]));

  return saveSession(toAuthUser(trimmedEmail, "Maya Rao"));
}

export async function signOutCurrentUser() {
  await AsyncStorage.removeItem(AUTH_SESSION_KEY);
}

function toAuthUser(email: string, displayName?: string): AuthUser {
  return {
    displayName,
    email,
    idToken: `demo-token-${Date.now()}`,
    localId: `demo-${email}`,
    refreshToken: `demo-refresh-${Date.now()}`,
  };
}

async function saveSession(user: AuthUser) {
  await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
  return user;
}

async function getRegisteredAccounts(): Promise<RegisteredAccount[]> {
  const value = await AsyncStorage.getItem(REGISTERED_ACCOUNTS_KEY);
  return value ? (JSON.parse(value) as RegisteredAccount[]) : [];
}

export function getAuthErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : "";

  if (code === "INVALID_LOGIN_CREDENTIALS" || code === "INVALID_PASSWORD" || code === "EMAIL_NOT_FOUND") {
    return "The email or password is not correct.";
  }

  if (code === "EMAIL_EXISTS") {
    return "An account already exists. Use Sign in instead.";
  }

  if (code === "WEAK_PASSWORD : Password should be at least 6 characters") {
    return "Use a password with at least 6 characters.";
  }

  return "Could not complete authentication. Try again.";
}
