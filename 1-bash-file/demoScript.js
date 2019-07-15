#!/usr/bin/env node
"use_strict"

console.log('logging...')
console.error('erroring...')

//************************************

const helpText = `
  script usage:
    demoScript --help
`

const printHelp = () => {
  console.log(helpText)
}