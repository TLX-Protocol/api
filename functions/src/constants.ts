import { OauthCredentials, ServiceType } from "./types";

export interface Secrets {
  twitterClientID: string;
  twitterClientSecret: string;
  discordClientID: string;
  discordClientSecret: string;
}

export const redirectURI = "https://tlx.fi/register";

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
  "I agree to the TLX Terms of Service (https://tlx.fi/terms-of-service)" +
  " and TLX Privacy Policy (https://tlx.fi/privacy-policiy)." +
  " I acknowledge that TLX integrates with third-party applications, which may come with risks";

export const codeValidChars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const codeLength = 4;
export const invitesPerUser = 5;

export const partnerCodes = ["kirbycrypto", "raccooncrypto", "yungmatt"];
