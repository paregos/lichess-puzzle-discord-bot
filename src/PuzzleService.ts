import axios from "axios";
import * as Discord from "discord.js";
import { maybeGenerateGif, sendBoardGifToChannel } from "./BoardGifService";
import { getChannel, setChannelCurrentPuzzleStep } from "./ChannelService";

import {
  findPuzzle,
  createPuzzle,
  updatePuzzle,
  createPuzzleStep,
  findPuzzleStep,
  findPuzzleStepById,
} from "./db/Repository";

export async function replyWithPuzzle(message: Discord.Message) {
  // Get the current puzzle the channel is on
  var channel = await getChannel(message.channel.id.toString());

  // Ensure that channel has a puzzle_step assigned to it
  if (channel.current_puzzle_step != null) {
    console.log("Channel is already on puzzle");
  } else {
    console.log("Channel has no puzzle");
    await createPuzzleForChannel(channel._id);
    channel = await getChannel(message.channel.id.toString());
  }

  // Get the channel puzzle step
  var puzzleStep = await findPuzzleStepById(channel.current_puzzle_step);
  console.log(puzzleStep);

  // Send the message
  return await sendBoardGifToChannel(
    message.channel,
    puzzleStep.puzzle,
    puzzleStep.step
  );
}

export async function createPuzzleForChannel(channel: number) {
  // Gets the new puzzle id
  const puzzleId = findNewPuzzleIdForChannel();
  // Check if we need to ingest the puzzle
  var puzzle = await findPuzzle(puzzleId);

  // If puzzle exists assign it to the channel and return
  if (puzzle != null && puzzle.ingested) {
    console.log("Puzzle already exists in the database");
  } else {
    console.log("We need to ingest puzzle");
    await ingestPuzzle(puzzleId);
    puzzle = await findPuzzle(puzzleId);
  }

  return await assignInitialPuzzleStepToChannel(channel, puzzle._id);
}

export async function assignInitialPuzzleStepToChannel(
  channel: number,
  puzzle: number
) {
  // Get the initial puzzle step for the passed in puzzle
  const puzzleStep = await findPuzzleStep(puzzle, 0);
  console.log(
    "Assign puzzle step: " + puzzleStep._id + "to channel: " + channel
  );
  return await assignPuzzleStepToChannel(channel, puzzleStep._id);
}

//TODO
export async function assignNextStepOfPuzzleToChannel() {}

export async function assignPuzzleStepToChannel(
  channel: number,
  puzzleStep: number
) {
  return await setChannelCurrentPuzzleStep(channel, puzzleStep);
}

// Will find a puzzle id that the channel hasn't already solved
export function findNewPuzzleIdForChannel(): number {
  return 90002;
}

export async function ingestPuzzle(puzzleId: number) {
  // Get request to lichess puzzle to get the puzzle information
  const url = "https://lichess.org/training/" + puzzleId;
  console.log("Querying lichess for puzzle: " + puzzleId);
  return axios({
    method: "get",
    url: url,
    responseType: "json",
    headers: {
      Accept: "application/vnd.lichess.v5+json",
    },
  })
    .then(async (res) => {
      // Create and get the puzzle
      console.log("Creating lichess puzzle record for puzzleId: " + puzzleId);
      await createPuzzle(puzzleId);

      // Cast the response into a string
      var rawData = res.data + "";
      // Cut Everything before the first json blob off
      var rawData = rawData.split("lichess.puzzle =")[1];
      // Cut Everything after the last json blob off
      var rawData = rawData.split("</script>")[0];
      var lichessPuzzleJson = JSON.parse(rawData).data;

      var correctAnswerArray = extractCorrectMoves(
        lichessPuzzleJson.puzzle.lines
      );

      var initialStateFen = lichessPuzzleJson.game.treeParts.fen;
      var initialLastMove = lichessPuzzleJson.game.treeParts.uci;

      var currentStep = 0;

      // Create the initial puzzle state
      await createPuzzleStepAndGif(
        puzzleId,
        currentStep,
        initialStateFen,
        initialLastMove,
        correctAnswerArray[currentStep]
      );

      var puzzleBranches = lichessPuzzleJson.puzzle.branch;

      // Iterate over the branches and create puzzleSteps
      var nextState = puzzleBranches;
      while (nextState != null && nextState.fen != null) {
        var lastMove = correctAnswerArray[currentStep];

        currentStep++;

        var stepFen = nextState.fen;
        var stepCorrectMove = correctAnswerArray[currentStep];
        await createPuzzleStepAndGif(
          puzzleId,
          currentStep,
          stepFen,
          lastMove,
          stepCorrectMove
        );
        nextState = nextState.children[0];
      }

      console.log("Going to update puzzle to set it to be ingested");
      // Once we've created all the individual steps we have ingested the puzzle
      await updatePuzzle(puzzleId, true);
    })
    .catch((err) => console.log(err));
}

// Transforms a JSON blob of correct moves e.g  { "g2a8": { "d7d8": { "a8d8": "win" } } }
// Into an array of strings with "win" always being the last element in the array
function extractCorrectMoves(correctMoves: any): string[] {
  let correctMoveList: string[] = [];

  let currentMove = correctMoves;

  while (currentMove != "win") {
    Object.keys(currentMove).forEach((k) => {
      correctMoveList.push(k);
      currentMove = currentMove[k];
    });
  }
  correctMoveList.push("win");
  return correctMoveList;
}

// Create a db record and gif of a puzzle step
async function createPuzzleStepAndGif(
  puzzle: number,
  puzzleStep: number,
  fen: string,
  lastMove: string,
  correctMove: string
) {
  await maybeGenerateGif({ puzzle, puzzleStep, fen, lastMove });
  await createPuzzleStep(puzzle, puzzleStep, fen, lastMove, correctMove);
}
