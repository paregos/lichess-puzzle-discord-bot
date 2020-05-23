import axios from "axios";
import * as Discord from "discord.js";
import { getChannel } from "./ChannelService";

import { findPuzzle } from "./db/Repository";

export async function replyWithPuzzle(message: Discord.Message) {
  // Get the channel
  const channel = await getChannel(message.channel.id.toString());
  // Get the current puzzle the channel is on
  if (channel.puzzle_progress != null) {
    console.log("Channel is already on puzzle");
  } else {
    console.log("Channel has no puzzle");
    await createPuzzleForChannel();
  }
  //const currentPuzzle = await
  // If null create a new puzzle for the channel
  // If not null get the step of the puzzle they are on
  // Talk to boardGifService to maybe generate the gif
  // Send the message
}

export async function createPuzzleForChannel() {
  // Gets the new puzzle id
  const lichessPuzzleId = findNewPuzzleIdForChannel();
  // Check if we need to ingest the puzzle
  const puzzle = await findPuzzle(lichessPuzzleId);

  // If puzzle exists assign it to the channel and return
  if (puzzle != null) {
    console.log("Puzzle already exists in the database");
  } else {
    console.log("We need to ingest puzzle");
    await ingestPuzzle(lichessPuzzleId);
    // We need to ingest the puzzle
  }
}

// Will find a puzzle id that the channel hasn't already solved
export function findNewPuzzleIdForChannel(): number {
  return 1;
}

export async function ingestPuzzle(lichessPuzzleId: number) {
  // Get request to lichess puzzle to get the puzzle information
  const url = "https://lichess.org/training/" + lichessPuzzleId;
  console.log("Querying lichess for puzzle: " + lichessPuzzleId);
  axios({
    method: "get",
    url: url,
    responseType: "stream",
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.log(err));
}
