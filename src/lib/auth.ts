const AUTH_SECRET = process.env.AUTH_SECRET || "default-secret-change-me";
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 天

// 解析账号配置
export function getAccounts(): Array<{ username: string; password: string }> {
  const accountsStr = process.env.AUTH_ACCOUNTS || "admin:123456";
  return accountsStr.split(",").map((account) => {
    const [username, password] = account.trim().split(":");
    return { username, password };
  });
}

// 验证账号密码
export function validateCredentials(
  username: string,
  password: string
): boolean {
  const accounts = getAccounts();
  return accounts.some(
    (a) => a.username === username && a.password === password
  );
}

// Web Crypto API - 导入 HMAC key
async function getKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// 生成签名 (Web Crypto API, 兼容 Edge Runtime)
async function sign(data: string): Promise<string> {
  const key = await getKey(AUTH_SECRET);
  const encoder = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Base64 编码/解码 (兼容 Edge Runtime)
function base64Encode(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64Decode(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// 生成 token
export async function generateToken(username: string): Promise<string> {
  const expires = Date.now() + TOKEN_EXPIRY;
  const payload = `${username}:${expires}`;
  const signature = await sign(payload);
  return `${base64Encode(payload)}.${signature}`;
}

// 验证 token
export async function verifyToken(
  token: string
): Promise<{ valid: boolean; username?: string }> {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return { valid: false };

    const payload = base64Decode(encodedPayload);
    const expectedSignature = await sign(payload);

    if (signature !== expectedSignature) return { valid: false };

    const [username, expiresStr] = payload.split(":");
    const expires = parseInt(expiresStr);

    if (Date.now() > expires) return { valid: false };

    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}
