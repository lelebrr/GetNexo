import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import "crypto-js";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
process.env.ENCRYPTION_KEY || "encryption-key-123";
const users = [
  {
    id: 1,
    email: "admin@getnexo.com.br",
    password: "$2a$10$hashedpassword",
    // Will hash on init
    role: "admin",
    name: "Admin User",
    permissions: ["all"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 2,
    email: "reseller@example.com",
    password: "$2a$10$hashedpassword",
    role: "reseller",
    name: "Reseller User",
    permissions: ["products.view", "products.create", "products.edit", "coupons.view", "coupons.create", "coupons.edit", "reports.view", "dashboard.view", "conversations.view", "conversations.manage"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
const magicLinks = /* @__PURE__ */ new Map();
const initUsers = async () => {
  for (const user of users) {
    if (!user.password.startsWith("$2a$")) {
      user.password = await bcrypt.hash("password123", 10);
    }
  }
};
initUsers();
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USER_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";
const authenticateUser = async (email, password) => {
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  if (user.password === "$2a$10$hashedpassword") {
    user.password = await bcrypt.hash("password123", 10);
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    permissions: user.permissions
  };
};
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, permissions: user.permissions },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
const findUserByEmail = (email) => {
  return users.find((u) => u.email === email);
};
const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    id: users.length + 1,
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    role: "user",
    permissions: ["dashboard.view", "site.view"],
    company: userData.company,
    whatsapp: userData.whatsapp,
    cpf_cnpj: userData.cpf_cnpj,
    website: userData.website,
    platform: userData.platform,
    segment: userData.segment,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  users.push(newUser);
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    permissions: newUser.permissions
  };
};
const hasPermission = (userPermissions, permission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes("all")) return true;
  return userPermissions.includes(permission);
};
const generateState = () => {
  return crypto.randomBytes(32).toString("hex");
};
const getGoogleAuthUrl = (state, redirectUri = "/api/auth/google/callback") => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL || "http://localhost:4321"}${redirectUri}`,
    response_type: "code",
    scope: "openid email profile",
    state
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
};
const exchangeGoogleCode = async (code, redirectUri = "/api/auth/google/callback") => {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.BASE_URL || "http://localhost:4321"}${redirectUri}`
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error);
  const userResponse = await fetch(GOOGLE_USER_URL, {
    headers: {
      "Authorization": `Bearer ${data.access_token}`
    }
  });
  const user = await userResponse.json();
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.picture,
    provider: "google"
  };
};
const getGitHubAuthUrl = (state, redirectUri = "/api/auth/github/callback") => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL || "http://localhost:4321"}${redirectUri}`,
    scope: "user:email",
    state
  });
  return `${GITHUB_AUTH_URL}?${params}`;
};
const exchangeGitHubCode = async (code, redirectUri = "/api/auth/github/callback") => {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.BASE_URL || "http://localhost:4321"}${redirectUri}`
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error);
  const userResponse = await fetch(GITHUB_USER_URL, {
    headers: {
      "Authorization": `Bearer ${data.access_token}`,
      "User-Agent": "GetNexo-App"
    }
  });
  const user = await userResponse.json();
  let email = user.email;
  if (!email) {
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        "Authorization": `Bearer ${data.access_token}`,
        "User-Agent": "GetNexo-App"
      }
    });
    const emails = await emailResponse.json();
    email = emails.find((e) => e.primary)?.email;
  }
  return {
    id: user.id,
    email,
    name: user.name,
    avatar: user.avatar_url,
    provider: "github"
  };
};
const generateMagicLink = async (email) => {
  const user = findUserByEmail(email);
  if (!user) {
    const newUser = await createUser({
      email,
      password: crypto.randomBytes(16).toString("hex"),
      name: email.split("@")[0]
    });
    delete newUser.password;
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
  magicLinks.set(token, {
    email,
    expiresAt,
    used: false
  });
  const baseUrl = process.env.BASE_URL || "http://localhost:4321";
  const magicLink = `${baseUrl}/api/auth/magic-link?token=${token}`;
  return { success: true, message: "Link mágico enviado" };
};
const verifyMagicLink = (token) => {
  const linkData = magicLinks.get(token);
  if (!linkData) return null;
  if (linkData.used || linkData.expiresAt < /* @__PURE__ */ new Date()) {
    magicLinks.delete(token);
    return null;
  }
  linkData.used = true;
  const user = findUserByEmail(linkData.email);
  return user;
};
const sendWhatsAppMagicLink = async (phone) => {
  const user = users.find((u) => u.phone === phone);
  if (!user) {
    const newUser = {
      id: users.length + 1,
      phone,
      email: `${phone}@whatsapp.getnexo.com`,
      // temporary email
      role: "customer",
      name: `Cliente ${phone}`,
      permissions: ["customer.view"],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    users.push(newUser);
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
  magicLinks.set(token, {
    phone,
    expiresAt,
    used: false
  });
  const baseUrl = process.env.BASE_URL || "http://localhost:4321";
  const magicLink = `${baseUrl}/api/auth/whatsapp-link?token=${token}`;
  return { success: true, message: "Link WhatsApp enviado" };
};
export {
  generateState as a,
  getGitHubAuthUrl as b,
  exchangeGoogleCode as c,
  getGoogleAuthUrl as d,
  exchangeGitHubCode as e,
  generateMagicLink as f,
  generateToken as g,
  findUserByEmail as h,
  createUser as i,
  hasPermission as j,
  authenticateUser as k,
  verifyMagicLink as l,
  sendWhatsAppMagicLink as s,
  verifyToken as v
};
