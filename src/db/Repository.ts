import * as sqlite3 from "sqlite3";
import * as util from "util";
sqlite3.verbose();

import { setupDbSchema } from "./init_db";

const db = new sqlite3.Database("./sqlite.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to the sqlite database");
  }
});

const get = util.promisify<string, any, any>(db.get.bind(db));
const run = util.promisify<string, any, any>(db.run.bind(db));
const all = util.promisify<string, any, any[]>(db.all).bind(db);

export function setupDatabase() {
  setupDbSchema(db);
}

export function closeDatabase() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log("Close the database connection");
    }
  });
}

async function tryGet(sql: string, params: any[]) {
  try {
    const row = get(sql, params);
    return await row;
  } catch (e) {
    console.error("ERROR: ", e);
  }
}

function tryRun(sql: string, params: any[]) {
  try {
    const row = run(sql, params);
    return row;
  } catch (e) {
    console.error("ERROR: ", e);
  }
}

// Channel

export type Channel = {
  discord_channel_id: string;
  type: string;
  puzzle_progress: number | null;
};

export async function findChannel(
  discord_channel_id: string
): Promise<Channel> {
  const sql = "SELECT * FROM channel where discord_channel_id = ?";
  const params = [discord_channel_id];

  const row = await tryGet(sql, params);
  return row;
}

export async function createChannel({
  discord_channel_id,
  type,
  puzzle_progress,
}: Channel) {
  const sql = `INSERT INTO channel(
    discord_channel_id,
    type,
    puzzle_progress
    ) VALUES (?, ?, ?)`;

  var params = [discord_channel_id, type, puzzle_progress];
  console.log("Creating channel");
  return tryRun(sql, params);
}

// Puzzle Progress

type PuzzleProgress = {
  _id: number;
  discord_channel_id: string;
  type: string;
  puzzle_progress: number | null;
};

export async function findChannelPuzzleProgress(
  puzzle_progress: number
): Promise<PuzzleProgress> {
  const sql = "SELECT * FROM puzzle_progress where _id = ?";
  const params = [puzzle_progress];

  const row = await tryGet(sql, params);
  return row;
}

// Puzzle

type Puzzle = {
  _id: number;
  lichess_puzzle_id: number;
  ingested: boolean;
};

export async function findPuzzle(lichess_puzzle_id: number): Promise<Puzzle> {
  const sql = "SELECT * FROM puzzle where _id = ?";
  const params = [lichess_puzzle_id];

  const row = await tryGet(sql, params);
  return row;
}

export async function createPuzzle(lichess_puzzle_id: number) {
  const sql = "INSERT INTO puzzle(lichess_puzzle_id) VALUES (?)";
  const params = [lichess_puzzle_id, false];

  const row = await tryRun(sql, params);
  return row;
}

//PuzzleStep

export type PuzzleStep = {
  puzzle: number;
  step: number;
  fen: string;
  previous_move: string;
  correct_next_move: string;
};

export async function createPuzzleStep({
  puzzle,
  step,
  fen,
  previous_move,
  correct_next_move,
}: PuzzleStep) {
  const sql =
    "INSERT INTO puzzle_step(puzzle, step, fen, previous_move, correct_next_move) VALUES (?, ?, ?, ?, ?)";
  const params = [puzzle, step, fen, previous_move, correct_next_move];

  const row = await tryRun(sql, params);
  return row;
}
