import * as Discord from "discord.js";
import { sendBoardGifToChannel } from "./BoardGifService";
import { maybeCreateChannel } from "./ChannelService";
import {
  maybeCreateNewPuzzleForChannel,
  getChannelCurrentPuzzleStep,
  maybeSolvePuzzleStep,
} from "./PuzzleService";

export async function maybeRespondToMessage(
  client: Discord.Client,
  message: Discord.Message
) {
  if (message.author == client.user) {
    return;
  }

  // Make sure the channel exists
  await maybeCreateChannel(message.channel);

  // Handle the specific message
  if (message.content === "!help" || message.content === "help") {
    return await replyToHelpMessage(message);
  } else if (message.content === "!puzzle" || message.content === "puzzle") {
    return await replyToPuzzleMessage(message);
  } else if (
    message.content.startsWith("!move") ||
    message.content.startsWith("move")
  ) {
    return await replyToMoveMessage(message);
  }
}

async function replyToHelpMessage(message: Discord.Message) {
  const messageEmbed = new Discord.MessageEmbed()
    .setTitle("Bot Commands")
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
    );
  return await message.channel.send(messageEmbed);
}

async function replyToPuzzleMessage(message: Discord.Message) {
  console.log("yo");
  await maybeCreateNewPuzzleForChannel(message);
  const currentPuzzleStep = await getChannelCurrentPuzzleStep(message);

  // Send the message
  return await sendBoardGifToChannel(
    message.channel,
    currentPuzzleStep.puzzle,
    currentPuzzleStep.step
  );
}

async function replyToMoveMessage(message: Discord.Message) {
  console.log("Handling move message");
  try {
    var move = parseMove(message);
    console.log(`Valid move ${parseMove(message)}`);
    return await maybeSolvePuzzleStep(message, move);
  } catch (error) {
    //TODO dont allow people to !move when there is no current puzzle for channel
    console.log(error);
    message.channel.send(`Invalid move format, please refer to !help`);
  }
}

function parseMove(message: Discord.Message): string {
  var splitMoveString = message.content.split(" ");
  if (splitMoveString.length != 2 || !stringIsValidMove(splitMoveString[1])) {
    throw new Error(
      'Invalid move format please submit moves via "!move a1a2" or see !help'
    );
  } else {
    return splitMoveString[1];
  }
}

function stringIsValidMove(move: string) {
  return move.match(/([a-h][1-8][a-h][1-8])/);
}

export async function sendPuzzleCompleteMesssage(message: Discord.Message) {
  message.channel.send(
    "Congratulations you've solved the puzzle!! Get another puzzle via !puzzle"
  );
}
