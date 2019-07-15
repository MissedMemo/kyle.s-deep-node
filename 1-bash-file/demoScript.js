#!/usr/bin/env node
"use_strict"

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help"],
  string: ["file"]
})

if ( args.help ) {
  printHelp()
}
else if ( args.file ) {
  console.log(args.file)
}
else {
  error("incorrect usage!", true )
}

//************************************

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