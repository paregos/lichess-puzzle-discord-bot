import axios from "axios";
import * as fs from "fs";

const lilaPort = process.env.LILA_PORT || "6175"; // 6175 default lila-gif port

type BoardGifStructure = {
  lichessPuzzleId: number;
  puzzleStep: number;
  fen: string;
  lastMove: string;
};

export async function maybeGenerateGif({
  lichessPuzzleId,
  puzzleStep,
  fen,
  lastMove,
}: BoardGifStructure) {
  const baseUrl = "http://localhost:" + lilaPort;
  const queryString = "/image.gif?fen=" + fen + "&lastMove=" + lastMove;
  const url = baseUrl + queryString;
  const fileName =
    "./src/board_gifs/" + lichessPuzzleId + "_" + puzzleStep + ".gif";

  // Check if the gif already exists
  if (fs.existsSync(fileName)) {
    console.log(
      "Board gif for puzzle: " +
        lichessPuzzleId +
        " step: " +
        puzzleStep +
        " already exists."
    );
    return;
  }

  // Otherwise talk to the lila server to generate it
  console.log(
    "Generating board gif for puzzle: " +
      lichessPuzzleId +
      " step: " +
      puzzleStep
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
