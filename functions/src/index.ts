import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";

import wrapHandler from "./utils";
import { getCirculatingSupply, getMaxSupply, getTotalSupply } from "./supply";

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
    const maxSupply_ = await getMaxSupply();
    const totalSupply_ = await getTotalSupply();
    const circulatingSupply_ = await getCirculatingSupply();
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
