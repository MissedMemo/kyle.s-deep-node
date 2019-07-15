#!/usr/bin/env node
"use_strict"

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