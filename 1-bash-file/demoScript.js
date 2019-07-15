#!/usr/bin/env node
"use_strict"

const args = require("minimist")(process.argv.slice(2))
console.log( args )

printHelp()

//************************************

function printHelp() {

  const helpText = `
    script usage:
      demoScript --help

    --help                print this help
  `

  console.log(helpText)
}