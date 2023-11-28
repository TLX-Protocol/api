import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";

import registrationHandler from "./registration";
import wrapHandler, { getUserAddress, validateParams } from "./utils";
import { userExists } from "./db";
import { APIError, SignedParams } from "./types";

admin.initializeApp();

export const register = onRequest(wrapHandler(registrationHandler));

export const inviteCodes = onRequest(
  wrapHandler(async (request) => {
    const { signature } = validateParams<SignedParams>(request.query, "signature");

    const user = getUserAddress(signature);
    if (!(await userExists(user))) {
      throw new APIError("Address not registered");
    }

    const db = admin.database();
    const snapshot = await db.ref("invites").orderByChild("creator").equalTo(user).get();
    return snapshot.val();
  })
);

export const hasRegistered = onRequest(
  wrapHandler(async (request) => {
    const { signature } = validateParams<SignedParams>(request.query, "signature");

    const user = getUserAddress(signature);
    return { hasRegistered: await userExists(user) };
  })
);

export const inviteCodeUsed = onRequest(
  wrapHandler(async (request) => {
    const { inviteCode } = validateParams<{ inviteCode: string }>(request.query, "inviteCode");
    const db = admin.database();
    const codeSnapshot = await db.ref("invites").child(inviteCode).get();
    if (!codeSnapshot.exists()) {
      throw new APIError("Invalid invite code");
    }
    return codeSnapshot.val().used;
  })
);
