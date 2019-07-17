#!/usr/bin/env node
"use strict"

const path = require('path')
const fs = require('fs')
const getStdIn = require('get-stdin')
const util = require('util')

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in"],
  string: ["file"]
})

const basePath = path.resolve( process.env.BASE_PATH || __dirname )

if ( args.help ) {
  printHelp()
}
else if (args.in || args._.includes('-')) {
  getStdIn().then( processData ).catch( showError )
}
else if ( args.file ) {
  const pathAndFile = path.join( basePath, args.file )

  fs.readFile( pathAndFile, (err,data) => {
    if(err) {
      console.log( err.toString() )
    }
    else {
      processData(data)
    }
  })
}
else {
  showError("incorrect usage!", true )
}

//************************************

function processData( data ) {
  const upCased = data.toString().toUpperCase()
  process.stdout.write(upCased)
}

function showError(message, showHelp) {
  console.error( `\nERROR: ${message}` )
  if ( showHelp ) {
    printHelp()
  }
}

function printHelp() {

  const helpText = `
    Usage:

      node demoScript --file={PATH_AND_FILENAME}
      ./demoScript.js --file={PATH_AND_FILENAME}
      cat {PATH_AND_FILENAME} | ./demoScript.js --in
      BASE_PATH={PATH} ./demoScript.js --file={FILENAME}
    
    Options:
      
      --help                print this help
      --file={FILENAME}     process the file
      --in, -               process from stdin

    Env:
      
      BASE_PATH             specify path to file
  `

  console.log('\n' + helpText)
}