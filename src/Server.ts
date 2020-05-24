import * as Discord from "discord.js";
import { maybeGenerateGif } from "./BoardGifService";
import { maybeCreateChannel } from "./ChannelService";
import { replyWithPuzzle } from "./PuzzleService";
import { setupDatabase, closeDatabase } from "./db/Repository";

setupDatabase();

const client = new Discord.Client();
const token = process.env.DISCORD_LICHESS_TOKEN;

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", async (message) => {
  if (message.author == client.user) {
    return;
  }

  // Make sure the channel exists
  await maybeCreateChannel(message.channel);

  if (message.content === "!help" || message.content === "help") {
    const messageEmbed = new Discord.MessageEmbed()
      .setTitle("Bot Commands")
      .setThumbnail("https://i.imgur.com/wSTFkRM.png")
      .addFields(
        {
          name: "!help | help",
          value: "Displays the list of commands you are seeing here",
        },
        {
          name: "!puzzle | puzzle",
          value:
            "Gets a new puzzle for the current channel. If the channel is already working on a puzzle this command returns the current step of the puzzle the channel is on.",
        },
        {
          name: "!move [x] | move [x], e.g !move a4a5",
          value:
            "Submits a move against the current puzzle step of the channel. Moves are in the format of a4e5 etc",
        }
      )
      .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");
    message.channel.send(messageEmbed);
  } else if (message.content === "!puzzle" || message.content === "puzzle") {
    replyWithPuzzle(message);
  }
});

client.login(token);

process.on("SIGTERM", function () {
  closeDatabase();
});
