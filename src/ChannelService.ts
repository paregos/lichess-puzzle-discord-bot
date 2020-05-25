import * as Discord from "discord.js";
import type { ChannelRecord } from "./db/Repository";

import { findChannel, createChannel, updateChannel } from "./db/Repository";

export async function maybeCreateChannel(discordChannel: Discord.Channel) {
  var discordChannelId = discordChannel.id.toString();

  var channelRow = await findChannel(discordChannelId);
  if (channelRow != null) {
    console.log("Channel " + discordChannelId + " found");
    return channelRow;
  }

  console.log("Channel " + discordChannelId + " not found.... creating");
  return await createChannel(
    discordChannelId,
    discordChannel.type.toString(),
    null
  );
}

export async function getChannel(
  discordChannelId: string
): Promise<ChannelRecord> {
  return await findChannel(discordChannelId);
}

export async function setChannelCurrentPuzzleStep(
  channel: number,
  puzzleStep: number | null
) {
  console.log("Updating Channel puzzle step");
  return await updateChannel(channel, puzzleStep);
}
