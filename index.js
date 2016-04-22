#!/usr/bin/env node

'use strict';
const fs = require( 'fs' );
const cp = require( 'copy-paste' );
const path = require( 'path' );
const readline = require( 'readline' );
const eol = require( 'os' ).EOL;

if ( process.argv.length !== 3 ) printUsageAndExit();

const FILENAME = `${process.argv[2]}.txt`;
const FILEPATH = path.resolve( process.cwd(), './', FILENAME );

const timestamp = function() {
  let seconds = process.hrtime(time)[0];
  return calculateTimestamp(seconds);
}

const calculateTimestamp = function( seconds ) {
  const minutes = Math.floor( seconds / 60 ).toString();
  let remainingSeconds = ( seconds % 60 ).toString();
  let formatedSeconds = remainingSeconds.length === 1 ? '0' + remainingSeconds : remainingSeconds;
  return `${minutes}:${formatedSeconds}`;
}

const rli = readline.createInterface({
  input: process.stdin,
  output: fs.createWriteStream( FILEPATH, { flags: 'a+' } )
});

let time = process.hrtime();


rli.on( 'line', function( line ) {
  rli.output.write( timestamp() + ' - ' + String( line ) + eol );
  process.stdout.write( '> ' );
});

process.on( 'SIGINT', function() {
  rli.output.write( eol );
  process.stdout.write( eol + 'Saved: ' + FILENAME + eol );
  process.stdout.write( 'Copied to clipboard.' + eol );
  cp.copy( fs.readFileSync( FILEPATH ) );
  process.exit( 0 );
});

process.stdout.write( '> ' );
rli.output.write( timestamp() + eol );

function printUsageAndExit () {
  console.log( 'Usage: timestamp <filename>' );
  process.exit(1);
}

