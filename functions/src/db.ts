import admin from "firebase-admin";

import { createRandomString } from "./utils";
import { codeLength } from "./constants";

export async function usernameExists(key: string, username: string): Promise<boolean> {
  const db = admin.database();
  const snapshot = await db.ref("users").orderByChild(key).equalTo(username).get();
  return snapshot.exists();
}

export async function userExists(address: string): Promise<boolean> {
  const db = admin.database();
  const snapshot = await db.ref("users").child(address).get();
  return snapshot.exists();
}

export async function useCode(code: string, user: string): Promise<void> {
  const db = admin.database();
  await db.ref("invites").child(code).update({ used: true, usedAt: Date.now(), user });
}

async function generateInviteCode(): Promise<string> {
  const db = admin.database();
  let code: string;
  do {
    code = createRandomString(codeLength);
  } while ((await db.ref("invites").child(code).get()).exists());
  return code;
}

export async function generateAndSaveInviteCodes(user: string, count: number): Promise<string[]> {
  const db = admin.database();
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = await generateInviteCode();
    const codeMetadata = { creator: user, used: false, createdAt: Date.now(), code };
    codes.push(code);
    await db.ref("invites").child(code).set(codeMetadata);
  }
  return codes;
}
