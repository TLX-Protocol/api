import { OauthCredentials, ServiceType } from "./types";

export interface Secrets {
  twitterClientID: string;
  twitterClientSecret: string;
  discordClientID: string;
  discordClientSecret: string;
}

export const redirectURI = "https://tlx.fi/referrals";

export function getCredentials(service: ServiceType, secrets: Secrets): OauthCredentials {
  return {
    clientID: service === ServiceType.Twitter ? secrets.twitterClientID : secrets.discordClientID,
    clientSecret: service === ServiceType.Twitter ? secrets.twitterClientSecret : secrets.discordClientSecret,
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
