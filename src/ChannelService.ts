import * as Discord from "discord.js";

import { findChannel, createChannel } from "./db/Repository";

export async function maybeCreateChannel(discordChannel: Discord.Channel) {
  var discordChannelId = discordChannel.id.toString();

  var channelRow = await findChannel(discordChannelId);
  if (channelRow != null) {
    console.log("Channel " + discordChannelId + " found");
    return channelRow;
  }

  console.log("Channel " + discordChannelId + " not found.... creating");
  channelRow = await createChannel({
    discord_channel_id: discordChannelId,
    type: discordChannel.type.toString(),
    puzzle_progress: null,
  });

  console.log(channelRow.type);
}
