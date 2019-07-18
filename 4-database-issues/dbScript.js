#!/usr/bin/env node

"use strict";

const util = require("util");
const { join } = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");

const DB_PATH = join( __dirname, "my.db" );
const SCHEMA_PATH = join( __dirname, "mydb.sql" );

const args = require("minimist")(process.argv.slice(2),{
	string: ["other",],
});

let SQL3;

main().catch(console.error);

async function main() {

	if (!args.other) {
		error("Missing '--other=..'");
		return;
	}

	// define some SQLite3 database helpers
	var myDB = new sqlite3.Database(DB_PATH);
	SQL3 = {
		run(...args) {                             // insert, update, or delete record
			return new Promise(function c(resolve,reject){
				myDB.run(...args,function onResult(err){
					if (err) reject(err);
					else resolve(this);
				});
			});
		},
		get: util.promisify(myDB.get.bind(myDB)),   // get one record
		all: util.promisify(myDB.all.bind(myDB)),   // get multiple records
		exec: util.promisify(myDB.exec.bind(myDB)),
	};

	var initSQL = fs.readFileSync(SCHEMA_PATH,"utf-8");
	await SQL3.exec(initSQL)


	var other = args.other;
	var something = Math.trunc(Math.random() * 1E9);

  const otherId = await insertOrLookupOther( other )
  
  if (otherId) {
    
    let result = await insertSomething( otherId, something )

    if ( result ) {
      console.log('success!')
      return
    }
  }

	error("Oops!");
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
