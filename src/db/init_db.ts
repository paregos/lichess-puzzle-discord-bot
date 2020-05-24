import * as sqlite3 from "sqlite3";

export function setupDbSchema(db: sqlite3.Database) {
  console.log("In init DB");

  const shouldDelete = false;

  db.run(
    `CREATE TABLE IF NOT EXISTS
      channel (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_channel_id TEXT,
      type TEXT,
      current_puzzle_step INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(current_puzzle_step) REFERENCES puzzle_step(_id))
      `,
    () => {
      if (shouldDelete) {
        db.run("DELETE FROM channel");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS
      puzzle (
      _id INTEGER PRIMARY KEY,
      ingested Boolean,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
      `,
    () => {
      if (shouldDelete) {
        db.run("DELETE FROM puzzle");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS " +
      puzzle_step (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      puzzle INTEGER,
      step INTEGER,
      fen TEXT,
      previous_move TEXT,
      correct_next_move TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(puzzle) REFERENCES puzzle(_id))
      `,
    () => {
      if (shouldDelete) {
        db.run("DELETE FROM puzzle_step");
      }
    }
  );
}
