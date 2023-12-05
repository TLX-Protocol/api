import { ethers } from "ethers";
import { codeValidChars, messageToSign } from "./constants";
import { APIError, FunctionHandler, HTTPHandler } from "./types";
import * as cors from "cors";

const corsFunc = cors({ origin: true });

export function createRandomString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += codeValidChars.charAt(Math.floor(Math.random() * codeValidChars.length));
  }
  return result;
}

export function getUserAddress(signature: string): string {
  try {
    return ethers.verifyMessage(messageToSign, signature);
  } catch (error) {
    throw new APIError("Invalid signature");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateParams<T>(body: any, ...keys: string[]): T {
  for (const key of keys) {
    if (body[key] === undefined) throw new APIError(`Invalid params: ${key} is undefined`);
  }
  return body as T;
}

export default function wrapHandler<T>(handler: FunctionHandler<T>): HTTPHandler {
  return async function httpHandler(request, response) {
    corsFunc(request, response, async () => {
      try {
        const result = await handler(request);
        response.send(result);
      } catch (error) {
        if (error instanceof APIError) {
          response.status(400).send({ error: error.message });
        } else {
          response.status(500).send({ error: "Internal server error" });
        }
      }
    });
  };
}
