import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";

import wrapHandler from "./utils";

admin.initializeApp();

export const example = onRequest(
  wrapHandler(async () => {
    return { message: "Hello, world!" };
  })
);
