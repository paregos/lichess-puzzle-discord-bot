import axios from "axios";
import * as Discord from "discord.js";
import { maybeGenerateGif } from "./BoardGifService";
import { getChannel } from "./ChannelService";

import { findPuzzle, createPuzzle, createPuzzleStep } from "./db/Repository";

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
  if (puzzle != null && puzzle.ingested) {
    console.log("Puzzle already exists in the database");
  } else {
    console.log("We need to ingest puzzle");
    await ingestPuzzle(lichessPuzzleId);
    // We need to ingest the puzzle
  }

  //TODO - assign puzzle to channel
}

// Will find a puzzle id that the channel hasn't already solved
export function findNewPuzzleIdForChannel(): number {
  return 90002;
}

export async function ingestPuzzle(lichessPuzzleId: number) {
  // Get request to lichess puzzle to get the puzzle information
  const url = "https://lichess.org/training/" + lichessPuzzleId;
  console.log("Querying lichess for puzzle: " + lichessPuzzleId);
  axios({
    method: "get",
    url: url,
    responseType: "json",
    headers: {
      Accept: "application/vnd.lichess.v5+json",
    },
  })
    .then(async (res) => {
      // Create and get the puzzle
      await createPuzzle(lichessPuzzleId);
      const puzzle = await findPuzzle(lichessPuzzleId);

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
        puzzle._id,
        lichessPuzzleId,
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
          puzzle._id,
          lichessPuzzleId,
          currentStep,
          stepFen,
          lastMove,
          stepCorrectMove
        );
        nextState = nextState.children[0];
      }

      // TOOD UPDATE PUZZLE TO BE INGESTED
    })
    .catch((err) => console.log(err));
}

// Transforms a string of correct moves e.g  { "g2a8": { "d7d8": { "a8d8": "win" } } }
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

// For a given x create a db record and gif
async function createPuzzleStepAndGif(
  puzzleId: number,
  lichessPuzzleId: number,
  puzzleStep: number,
  fen: string,
  lastMove: string,
  correctMove: string
) {
  await maybeGenerateGif({ lichessPuzzleId, puzzleStep, fen, lastMove });
  await createPuzzleStep({
    puzzle: puzzleId,
    step: puzzleStep,
    fen: fen,
    previous_move: lastMove,
    correct_next_move: correctMove,
  });
}
