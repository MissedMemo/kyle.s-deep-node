#!/usr/bin/env node
"use_strict"

const path = require('path')
const fs = require('fs')
const getStdIn = require('get-stdin')
const util = require('util')

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in"],
  string: ["file"]
})

if ( args.help ) {
  printHelp()
}
else if (args.in || args._.includes('-')) {
  getStdIn().then( processData ).catch( showError )
}
else if ( args.file ) {
  const pathAndFile = path.resolve(args.file)

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

      node demoScript --file={FILENAME}
      ./demoScript.js --file={FILENAME}
      cat {FILENAME} | ./demoScript.js --in
    
    Options:
      
      --help                print this help
      --file={FILENAME}     process the file
      --in, -               process from stdin
  `

  console.log('\n' + helpText)
}