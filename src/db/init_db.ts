import * as sqlite3 from "sqlite3";

export function setupDbSchema(db: sqlite3.Database) {
  db.run(
    "CREATE TABLE IF NOT EXISTS channel(_id INTEGER PRIMARY KEY ASC, channel_id TEXT, type TEXT, created_at INTEGER, last_modified_at INTEGER)"
  );
}
