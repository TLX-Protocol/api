import { Request } from "firebase-functions";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";

import { DiscordService, TwitterService } from "./services";
import { APIError, RegistrationParams, Guild } from "./types";
import { Secrets, invitesPerUser, tlxGuidID } from "./constants";
import { generateAndSaveInviteCodes, useCode, userExists, usernameExists } from "./db";
import { getUserAddress, validateParams } from "./utils";

const requiredKeys = ["twitterCode", "discordCode", "signature", "inviteCode"];

async function getTwitterUsername(code: string, secrets: Secrets): Promise<string> {
  try {
    logger.info("Getting Twitter data");
    logger.info(`Code: ${code}`);
    const twitterService = await TwitterService.fromCode(code, secrets);
    return twitterService.getUsername();
  } catch (error) {
    throw new APIError(`Twitter authentication failed: ${error}`);
  }
}

async function getDiscordData(code: string, secrets: Secrets): Promise<{ username: string; guilds: Guild[] }> {
  try {
    logger.info("Getting Discord data");
    logger.info(`Code: ${code}`);
    const discordService = await DiscordService.fromCode(code, secrets);
    const username = await discordService.getUsername();
    const guilds = await discordService.getGuilds();
    return { username, guilds };
  } catch (error) {
    throw new APIError(`Discord authentication failed: ${error}`);
  }
}

export default async function registrationHandler(request: Request, secrets: Secrets) {
  const params = validateParams<RegistrationParams>(request.body, ...requiredKeys);
  const address = getUserAddress(params.signature);

  const db = admin.database();

  if (await userExists(address)) {
    throw new APIError("Address already used");
  }

  const codeSnapshot = await db.ref("invites").child(params.inviteCode).get();
  if (!codeSnapshot.exists()) {
    throw new APIError("Invalid invite code");
  }
  if (codeSnapshot.val().used) {
    throw new APIError("Code already used");
  }

  const twitterUsername = await getTwitterUsername(params.twitterCode, secrets);

  if (await usernameExists("twitterUsername", twitterUsername)) {
    throw new APIError("Twitter already used");
  }

  const { username: discordUsername, guilds } = await getDiscordData(params.discordCode, secrets);

  if (await usernameExists("discordUsername", discordUsername)) {
    throw new APIError("Discord already used");
  }

  if (!guilds.some((guild) => guild.id === tlxGuidID)) {
    throw new APIError("Not in the TLX Discord server");
  }

  const user = { twitterUsername, discordUsername };
  await db.ref("users").child(address).set(user);
  const codes = await generateAndSaveInviteCodes(address, invitesPerUser);
  await useCode(params.inviteCode, address);

  return { address, ...user, codes };
}
