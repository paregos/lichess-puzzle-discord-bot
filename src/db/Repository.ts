import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database("./sqlite.db", err =>{
    if(err){
        console.log(err.message);
    } else {
        console.log("Connected to the sqlite database")
    }
}










//