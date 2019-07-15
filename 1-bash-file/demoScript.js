#!/usr/bin/env node
"use_strict"

const path = require('path')
const fs = require('fs')

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help"],
  string: ["file"]
})

if ( args.help ) {
  printHelp()
}
else if ( args.file ) {
  processFile( path.resolve(args.file) )
}
else {
  error("incorrect usage!", true )
}

//************************************

function processFile( pathAndFile ) {
  /*
  const buffer = fs.readFileSync(pathAndFile)
  console.log(buffer)
  process.stdout.write(buffer)
  */

  fs.readFile( pathAndFile, (err,data) => {
    if(err) {
      console.log( err.toString() )
    }
    else {
      process.stdout.write(data)
    }
  })
}

function error(message, showHelp) {
  console.error( `\nERROR: ${message}` )
  if ( showHelp ) {
    printHelp()
  }
}

function printHelp() {

  const helpText = `
    Usage:

      ./demoScript --file={FILENAME}
    
    Options:
      
      --help                print this help
      --file={FILENAME}     process the file
  `

  console.log('\n' + helpText)
}