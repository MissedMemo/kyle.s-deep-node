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

main().catch(console.error);


let SQL3;

async function main() {

	if (!args.other) {
		error("Missing '--other=..'");
		return;
	}

	// define some SQLite3 database helpers
	var myDB = new sqlite3.Database(DB_PATH);
	SQL3 = {
		run(...args) {
			return new Promise(function c(resolve,reject){
				myDB.run(...args,function onResult(err){
					if (err) reject(err);
					else resolve(this);
				});
			});
		},
		get: util.promisify(myDB.get.bind(myDB)),
		all: util.promisify(myDB.all.bind(myDB)),
		exec: util.promisify(myDB.exec.bind(myDB)),
	};

	var initSQL = fs.readFileSync(SCHEMA_PATH,"utf-8");
	await SQL3.exec(initSQL)


	var other = args.other;
	var something = Math.trunc(Math.random() * 1E9);

	// ***********

	// TODO: insert values and print all records

	error("Oops!");
}

function error(err) {
	if (err) {
		console.error(err.toString());
		console.log("");
	}
}
