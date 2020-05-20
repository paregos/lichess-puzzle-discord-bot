var sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./sqlite.db", err => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log("Connected to the sqlite database");
    }
})

db.run('CREATE TABLE channel(_id INTEGER PRIMARY KEY ASC, channel_id TEXT, type TEXT, created_at INTEGER, last_modified_at INTEGER)');
