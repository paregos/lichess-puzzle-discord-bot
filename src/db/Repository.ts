import * as sqlite3 from "sqlite3";
import { setupDbSchema } from "./init_db";

sqlite3.verbose();

const db = new sqlite3.Database("./sqlite.db", err => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to the sqlite database");
  }
});

export function setupDatabase() {
  setupDbSchema(db);
}

export function closeDatabase() {
  db.close(err => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log("Close the database connection");
    }
  });
}

export function createChannel() {}
