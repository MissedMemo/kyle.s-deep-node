#!/usr/bin/env node
"use_strict"

const path = require('path')
const fs = require('fs')
const util = require('util')
const { Transform } = require('stream')

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in"],
  string: ["file"]
})

const basePath = path.resolve( process.env.BASE_PATH || __dirname )

if ( args.help ) {
  printHelp()
}
else if (args.in || args._.includes('-')) {
  processData( process.stdin )
}
else if ( args.file ) {
  
  const stream = fs.createReadStream( path.join( basePath, args.file ) )
  processData( stream )
}
else {
  showError("incorrect usage!", true )
}

//************************************

function processData( inputStream ) {

  let outputStream = inputStream

  const upperStream = new Transform({
    transform( chunk, enc, cb ) {
      this.push( chunk.toString().toUpperCase() )
      cb()
    }
  })

  outputStream = outputStream.pipe( upperStream )

  const targetStream = process.stdout
  outputStream.pipe( targetStream )
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