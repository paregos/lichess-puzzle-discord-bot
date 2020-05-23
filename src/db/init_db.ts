import * as sqlite3 from "sqlite3";

export function setupDbSchema(db: sqlite3.Database) {
  db.run(
    "CREATE TABLE IF NOT EXISTS " +
      `channel (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_channel_id TEXT,
      type TEXT,
      puzzle_progress INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(puzzle_progress) REFERENCES puzzle_progress(_id))
      `
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS " +
      `puzzle (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      lichess_puzzle_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
      `
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS " +
      `puzzle_progress (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      puzzle INTEGER,
      current_puzzle_step INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(puzzle) REFERENCES puzzle(_id),
      FOREIGN KEY(current_puzzle_step) REFERENCES puzzle_step(_id))
      `
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS " +
      `puzzle_step (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      puzzle INTEGER,
      step INTEGER,
      fen TEXT,
      previous_move TEXT,
      correct_next_move TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(puzzle) REFERENCES puzzle(_id))
      `
  );
}
