import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";

import wrapHandler from "./utils";
import { getCirculatingSupply, getMaxSupply, getTotalSupply } from "./supply";
import getVaa from "./hermes";

admin.initializeApp();

export const maxSupply = onRequest(
  wrapHandler(async () => {
    const maxSupply_ = await getMaxSupply();
    return { status: "success", data: { maxSupply: maxSupply_ } };
  })
);

export const totalSupply = onRequest(
  wrapHandler(async () => {
    const totalSupply_ = await getTotalSupply();
    return { status: "success", data: { totalSupply: totalSupply_ } };
  })
);

export const circulatingSupply = onRequest(
  wrapHandler(async () => {
    const circulatingSupply_ = await getCirculatingSupply();
    return { status: "success", data: { circulatingSupply: circulatingSupply_ } };
  })
);

export const supply = onRequest(
  wrapHandler(async () => {
    const [maxSupply_, totalSupply_, circulatingSupply_] = await Promise.all([
      getMaxSupply(),
      getTotalSupply(),
      getCirculatingSupply(),
    ]);
    return {
      status: "success",
      data: {
        maxSupply: maxSupply_,
        totalSupply: totalSupply_,
        circulatingSupply: circulatingSupply_,
      },
    };
  })
);

export const hermes = onRequest(
  wrapHandler(async (req) => {
    const feedId = req.query.id;
    if (!feedId) throw new Error("feedId is required");
    if (typeof feedId !== "string") throw new Error("Invalid feedId");
    const vaa = await getVaa(feedId);
    return { status: "success", data: { vaa } };
  })
);
