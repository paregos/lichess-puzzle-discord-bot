import axios from "axios";
import * as fs from "fs";

const lilaPort = process.env.LILA_PORT || "6175"; // 6175 default lila-gif port

type BoardGifStructure = {
  puzzleId: string;
  fen: string;
  lastMove: string;
};

export async function maybeGenerateGif({
  puzzleId,
  fen,
  lastMove,
}: BoardGifStructure) {
  const baseUrl = "http://localhost:" + lilaPort;
  const queryString = "/image.gif?fen=" + fen + "&lastMove=" + lastMove;
  const url = baseUrl + queryString;
  const fileName = "./src/board_gifs/1.gif";

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
