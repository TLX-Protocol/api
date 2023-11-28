import { OauthCredentials, ServiceType } from "./types";

function getEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export const redirectURI = "https://tlx.fi/referrals";

const prefixes = {
  [ServiceType.Twitter]: "TWITTER_",
  [ServiceType.Discord]: "DISCORD_",
};

export function getCredentials(service: ServiceType): OauthCredentials {
  const prefix = prefixes[service];
  return {
    clientID: getEnv(`${prefix}CLIENT_ID`),
    clientSecret: getEnv(`${prefix}CLIENT_SECRET`),
  };
}

export const oauthURLs = {
  [ServiceType.Twitter]: "https://api.twitter.com/2/oauth2/token",
  [ServiceType.Discord]: "https://discord.com/api/oauth2/token",
};

export const tlxGuidID = "1142096814573621308";

export const messageToSign =
  "I authorize TLX to use my Twitter and Discord usernames for the purpose of verifying my identity.";

export const codeValidChars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const codeLength = 4;
export const invitesPerUser = 5;
