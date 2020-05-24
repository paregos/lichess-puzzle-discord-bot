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

export async function setupDatabase() {
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

export type ChannelRecord = {
  _id: number;
  discord_channel_id: string;
  type: string;
  current_puzzle_step: number | null;
};

export async function findChannel(
  discord_channel_id: string
): Promise<ChannelRecord> {
  const sql = "SELECT * FROM channel where discord_channel_id = ?";
  const params = [discord_channel_id];

  const row = await tryGet(sql, params);
  return row;
}

export async function createChannel(
  discord_channel_id: string,
  type: string,
  current_puzzle_step: number | null
) {
  const sql = `INSERT INTO channel(
    discord_channel_id,
    type,
    current_puzzle_step
    ) VALUES (?, ?, ?)`;

  var params = [discord_channel_id, type, current_puzzle_step];
  return tryRun(sql, params);
}

export async function updateChannel(
  channel: number,
  current_puzzle_step: number
) {
  const sql = `UPDATE channel set current_puzzle_step = ? where _id = ?`;

  var params = [current_puzzle_step, channel];
  return tryRun(sql, params);
}

// Puzzle

type PuzzleRecord = {
  _id: number;
  ingested: boolean;
};

export async function findPuzzle(puzzle: number): Promise<PuzzleRecord> {
  const sql = "SELECT * FROM puzzle where _id = ?";
  const params = [puzzle];

  const row = await tryGet(sql, params);
  return row;
}

export async function createPuzzle(puzzle: number) {
  const sql = "INSERT INTO puzzle(_id, ingested) VALUES (?,?)";
  const params = [puzzle, false];

  const row = await tryRun(sql, params);
  return row;
}

export async function updatePuzzle(puzzle: number, ingested: boolean) {
  const sql = "UPDATE puzzle SET ingested = ? where _id = ?";
  const params = [ingested, puzzle];

  const row = await tryRun(sql, params);
  return row;
}

//PuzzleStep

export type PuzzleStepRecord = {
  _id: number;
  puzzle: number;
  step: number;
  fen: string;
  previous_move: string;
  correct_next_move: string;
};

export async function createPuzzleStep(
  puzzle: number,
  step: number,
  fen: string,
  previous_move: string,
  correct_next_move: string
) {
  const sql =
    "INSERT INTO puzzle_step(puzzle, step, fen, previous_move, correct_next_move) VALUES (?, ?, ?, ?, ?)";
  const params = [puzzle, step, fen, previous_move, correct_next_move];

  const row = await tryRun(sql, params);
  return row;
}

export async function findPuzzleStep(
  puzzle: number,
  step: number
): Promise<PuzzleStepRecord> {
  const sql = "SELECT * FROM puzzle_step where puzzle = ? and step = ?";
  const params = [puzzle, step];

  const row = await tryGet(sql, params);
  return row;
}

export async function findPuzzleStepById(
  puzzle_step: number | null
): Promise<PuzzleStepRecord> {
  if (puzzle_step == null) {
    throw new Error("Puzzle step cannot be null");
  }

  const sql = "SELECT * FROM puzzle_step where _id = ?";
  const params = [puzzle_step];

  const row = await tryGet(sql, params);
  return row;
}
