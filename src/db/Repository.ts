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
const run = util.promisify<string, any, void>(db.run.bind(db));
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
    return row;
  } catch (e) {
    console.error("ERROR: ", e);
  }
}

async function tryRun(sql: string, params: any[]) {
  try {
    const row = run(sql, params);
    return row;
  } catch (e) {
    console.error("ERROR: ", e);
  }
}

type Channel = {
  discord_channel_id: string;
  type: string;
  puzzle_progress: number | null;
};

export async function findChannel(discord_channel_id: string) {
  const sql = "SELECT * FROM channel where discord_channel_id = ?";
  const params = [discord_channel_id];

  return await tryGet(sql, params);
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
  return await tryRun(sql, params);
}
