import { Request } from "firebase-functions";
import { Response } from "express";

export class APIError extends Error {}

export type HTTPHandler = (request: Request, response: Response) => void | Promise<void>;
export type FunctionHandler<T> = (request: Request) => Promise<T>;
