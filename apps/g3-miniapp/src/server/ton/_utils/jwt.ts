import { type CHAIN } from "@tonconnect/sdk";
import { SignJWT, decodeJwt, jwtVerify, type JWTPayload } from "jose";
import { env } from "../../../env";

/**
 * Secret key for the token.
 */
const JWT_SECRET_KEY = env.JWT_SECRET;

/**
 * Payload of the token.
 */
export type AuthToken = {
  userId: number;
  address: string;
  network: CHAIN;
};

export type PayloadToken = {
  payload: string;
};

/**
 * Create a token with the given payload.
 */
function buildCreateToken<T extends JWTPayload>(
  expirationTime: string,
): (payload: T) => Promise<string> {
  return async (payload: T) => {
    const encoder = new TextEncoder();
    const key = encoder.encode(JWT_SECRET_KEY);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(key);
  };
}

export const createAuthToken = buildCreateToken<AuthToken>("1Y");
export const createPayloadToken = buildCreateToken<PayloadToken>("5m");

/**
 * Verify the given token.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  const encoder = new TextEncoder();
  const key = encoder.encode(JWT_SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Decode the given token.
 */
function buildDecodeToken<T extends JWTPayload>(): (token: string) => T | null {
  return (token: string) => {
    try {
      return decodeJwt(token) as T;
    } catch (e) {
      return null;
    }
  };
}

export const decodeAuthToken = buildDecodeToken<AuthToken>();
export const decodePayloadToken = buildDecodeToken<PayloadToken>();
