import fetch, { Response } from "node-fetch";
import { redirectURI, getCredentials, oauthURLs } from "./constants";
import { Guild, ServiceType, TokenResponse, TwitterUserResponse, User } from "./types";

async function processResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as T;
}

function getAuthorization(service: ServiceType) {
  const { clientID, clientSecret } = getCredentials(service);
  const encodedCredentials = Buffer.from(`${clientID}:${clientSecret}`).toString("base64");
  const paddingLength = (4 - (encodedCredentials.length % 4)) % 4;
  return encodedCredentials + "=".repeat(paddingLength);
}

async function getAccessToken(service: ServiceType, code: string): Promise<string> {
  const params = new URLSearchParams({ code, grant_type: "authorization_code", redirect_uri: redirectURI });
  if (service === ServiceType.Twitter) {
    params.set("code_verifier", "challenge");
  }

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${getAuthorization(service)}`,
  };
  const response = await fetch(oauthURLs[service], { method: "POST", body: params.toString(), headers });
  const data = await processResponse<TokenResponse>(response);
  return data.access_token;
}

class Service {
  private readonly accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  protected async get<T>(url: string): Promise<T> {
    const headers = { Authorization: `Bearer ${this.accessToken}` };
    return processResponse(await fetch(url, { headers }));
  }
}

export class TwitterService extends Service {
  static async fromCode(code: string): Promise<TwitterService> {
    return new TwitterService(await getAccessToken(ServiceType.Twitter, code));
  }

  async getUsername(): Promise<string> {
    const data = await this.get<TwitterUserResponse>("https://api.twitter.com/2/users/me");
    return data.data.username;
  }
}

export class DiscordService extends Service {
  static async fromCode(code: string): Promise<DiscordService> {
    return new DiscordService(await getAccessToken(ServiceType.Discord, code));
  }

  async getUsername(): Promise<string> {
    const { username } = await this.get<User>("https://discord.com/api/users/@me");
    return username;
  }

  async getGuilds(): Promise<Guild[]> {
    return this.get<Guild[]>("https://discord.com/api/users/@me/guilds");
  }
}
