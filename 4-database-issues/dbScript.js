#!/usr/bin/env node

"use strict";

const { promisify } = require("util");
const { join } = require("path");
const { readFileSync } = require("fs");
const { Database } = require("sqlite3");

const DB_PATH = join( __dirname, "my.db" );
const SCHEMA_PATH = join( __dirname, "mydb.sql" );
const myDB = new Database(DB_PATH)

const args = require("minimist")(process.argv.slice(2),{
	string: ["other",],
});

const SQL3 = {
  run(...args) {                         // insert, update, or delete record
    return new Promise(function c(resolve,reject){
      myDB.run(...args,function onResult(err){
        if (err) reject(err);
        else resolve(this);
      });
    });
  },
  get: promisify(myDB.get.bind(myDB)),   // get one record
  all: promisify(myDB.all.bind(myDB)),   // get multiple records
  exec: promisify(myDB.exec.bind(myDB)),
}

main().catch(console.error);

async function main() {

	if (!args.other) {
		error("Missing '--other=..'");
		return;
	}
  
	var initSQL = readFileSync( SCHEMA_PATH, "utf-8" )
	await SQL3.exec(initSQL)

	var other = args.other;
	var something = Math.trunc(Math.random() * 1E9);

  const otherId = await insertOrLookupOther( other )
  
  if (otherId) {
    
    let result = await insertSomething( otherId, something )

    if ( result ) {
      const records = await getAllRecords()
      if ( records && records.length ) {
        console.table(records)
        return
      }
    }
  }

	error("Oops!");
}

async function getAllRecords() {

  let records = await SQL3.all(`
    SELECT
      Other.data as "other",
      Something.data as "something"
    FROM
      Something JOIN Other
      ON (Something.OtherID = Other.id )
    ORDER BY
      Other.id DESC, Something.data
  `)

  return records
}

async function insertSomething( otherId, something ) {
  
  let result = await SQL3.run(`
    INSERT INTO
      Something (otherID, data)
    VALUES
      (?,?)
  `, otherId, something )

  return result && result.changes > 0
}

async function insertOrLookupOther( other ) {
  let result = await SQL3.get(`
    SELECT
      id
    FROM
      Other
    WHERE
      data = ?
  `, other )

  if ( result && result.id ) {
    return result.id
  }
  else { // insert
    result = await SQL3.run(`
      INSERT INTO
        Other (data)
      VALUES
        (?)
    `, other )

    if ( result && result.lastID ) {
      return result.lastID
    }
  }
}

function error(err) {
	if (err) {
		console.error(err.toString());
		console.log("");
	}
}
