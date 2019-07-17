#!/usr/bin/env node
"use_strict"

const path = require('path')
const fs = require('fs')
const util = require('util')
const { Transform } = require('stream')
const zlib = require("zlib")
const caf = require('caf')

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in", "out", "compress"],
  string: ["file"]
})

const streamComplete = stream => {
  return new Promise( res => {
    stream.on( "end", () => {
      res()
    })
  })
}

processData = caf(processData)

const basePath = path.resolve( process.env.BASE_PATH || __dirname )

let outputFile = path.join( basePath, "output.txt" )

if ( args.help ) {
  printHelp()
}
else if (args.in || args._.includes('-')) {
  const tookTooLong = caf.timeout( 3, "Operation took too long!" )
  processData( tookTooLong, process.stdin ).catch( showError )
}
else if ( args.file ) {
  const stream = fs.createReadStream( path.join( basePath, args.file ) )
  const tookTooLong = caf.timeout( 3, "Operation took too long!" )

  processData( tookTooLong, stream ).then( () => {
    console.log('COMPLETE!')
  }).catch( showError )
}
else {
  showError("incorrect usage!", true )
}

//************************************

function *processData( signal, inputStream ) {

  let outputStream = inputStream

  if ( args.decompress ) {
    const gunzipStream = zlib.Gunzip()
    outputStream = outputStream.pipe( gunzipStream )
  }

  const upperStream = new Transform({
    transform( chunk, enc, cb ) {
      this.push( chunk.toString().toUpperCase() )
      cb()
    }
  })

  outputStream = outputStream.pipe( upperStream )

  if ( args.compress ) {
    const gzipStream = zlib.createGzip()
    outputStream = outputStream.pipe( gzipStream )
    outputFile = `${outputFile}.gz`
  }

  const targetStream = args.out ? process.stdout : fs.createWriteStream( outputFile )
  outputStream.pipe( targetStream )

  signal.pr.catch( () => {
    outputStream.unpipe( targetStream )
    outputStream.destroy()
  })
  
  yield streamComplete(outputStream)
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
      --out                 write to stdout (not file)
      --compress            gzip output
      --decompress          unzip the input

    Env:
      
      BASE_PATH             specify path to file
  `

  console.log('\n' + helpText)
}