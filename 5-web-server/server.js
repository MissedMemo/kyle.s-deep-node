#!/usr/bin/env node

"use strict"

const { createServer } = require('http')

const server = createServer(handleRequest)

const port = 8039

server.listen(port)
console.log(`listening on ${port}`)

function handleRequest ( req, res ) {
  if ( req.url === "/hello" ) {
    res.writeHead( 200, { "Content-Type": "text/plain" })
    res.end('hey, you!')
  }
  else {
    res.writeHead(404)
    res.end('404: Page Not Found!')
  }
}