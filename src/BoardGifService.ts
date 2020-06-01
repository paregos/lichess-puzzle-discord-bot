import axios from "axios";
import * as fs from "fs";
import * as Discord from "discord.js";

const lilaPort = process.env.LILA_PORT || "6175"; // 6175 default lila-gif port
const lilaHost = process.env.LILA_HOST || "localhost"; // 6175 default lila-gif port

type BoardGifStructure = {
  puzzle: number;
  puzzleStep: number;
  fen: string;
  lastMove: string;
};

export async function maybeGenerateGif({
  puzzle,
  puzzleStep,
  fen,
  lastMove,
}: BoardGifStructure) {
  const baseUrl = `http://${lilaHost}:${lilaPort}`;
  const queryString = `/image.gif?fen=${fen}&lastMove=${lastMove}`;
  const url = baseUrl + queryString;

  const fileName = getPuzzlePath(puzzle, puzzleStep);

  // Check if the gif already exists
  if (fs.existsSync(fileName)) {
    console.log(
      "Board gif for puzzle: " +
        puzzle +
        " step: " +
        puzzleStep +
        " already exists."
    );
    return;
  }

  // Otherwise talk to the lila server to generate it
  console.log(
    "Generating board gif for puzzle: " + puzzle + " step: " + puzzleStep
  );
  return axios({
    method: "get",
    url: url,
    responseType: "stream",
  })
    .then((res) => {
      res.data
        .pipe(fs.createWriteStream(fileName))
        .on("close", () => console.log("done"));
    })
    .catch((err) => console.log(err));
}

export async function sendBoardGifToChannel(
  channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
  puzzle: number,
  step: number
) {
  const puzzlePath = getPuzzlePath(puzzle, step);
  return await channel.send(
    `Lichess puzzle: ${puzzle}, step: ${step} https://www.lichess.org/training/${puzzle}`,
    {
      files: [puzzlePath],
    }
  );
}

function getPuzzlePath(puzzle: number, step: number): string {
  return `./src/board_gifs/${puzzle}_${step}.gif`;
}
