import { Request } from "firebase-functions";
import { Response } from "express";
export enum ServiceType {
  Twitter,
  Discord,
}

export type TokenResponse = {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
  refresh_token: string;
};

export type User = {
  id: string;
  username: string;
};

export type Guild = {
  id: string;
  username: string;
};

export type Code = {
  creator: string;
  used: boolean;
  createdAt: number;
  usedAt?: number;
  user?: string;
};

export type TwitterUserResponse = {
  data: User;
};

export type OauthCredentials = {
  clientID: string;
  clientSecret: string;
};

export class APIError extends Error {}

export type SignedParams = {
  signature: string;
};

export type RegistrationParams = SignedParams & {
  twitterCode: string;
  discordCode: string;
  inviteCode: string;
};

export type HTTPHandler = (request: Request, response: Response) => void | Promise<void>;
export type FunctionHandler<T> = (request: Request) => Promise<T>;
