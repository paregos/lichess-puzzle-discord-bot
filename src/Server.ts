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

  if (message.content === "!help") {
    message.channel.send("help todo");
  } else if (message.content === "!p") {
    await maybeGenerateGif({
      puzzleId: "1",
      fen: "3r1bk1/p2B1pp1/1pp5/3b2qp/P1pP3B/2P2P2/5QPP/4R1K1",
      lastMove: "a8d8",
    });
    message.channel.send("Daily Puzzle", { files: ["./src/board_gifs/1.gif"] });
  } else if (message.content === "!puzzle") {
    replyWithPuzzle(message);
  }
});

client.login(token);

process.on("SIGTERM", function () {
  closeDatabase();
});
