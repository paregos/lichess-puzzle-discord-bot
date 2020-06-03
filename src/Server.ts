import * as Discord from "discord.js";
import { maybeRespondToMessage } from "./MessageService";
import { setupDatabase, closeDatabase } from "./db/Repository";

setupDatabase();

const client = new Discord.Client();
const token = process.env.DISCORD_LICHESS_TOKEN;

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", async (message) => {
  try {
    await maybeRespondToMessage(client, message);
  } catch (error) {
    console.log(error);
  }
});

client.login(token);

process.on("SIGTERM", function () {
  closeDatabase();
});
