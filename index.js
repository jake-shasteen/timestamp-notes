#!/usr/bin/env node

'use strict';
const fs = require( 'fs' );
const cp = require( 'copy-paste' );
const path = require( 'path' );
const readline = require( 'readline' );
const eol = require( 'os' ).EOL;

/**
 *  Print help text and exit
 */
function printUsageAndExit () {
  console.log( 'Usage: timestamp [filename]' );
  process.exit(1);
}

/**
 *  Generate timestamp based on diff from start time
 */
const timestamp = function() {
  let seconds = process.hrtime( time )[0];
  return calculateTimestamp( seconds );
}

/**
 * Format seconds into minutes and seconds
 * @param {number} seconds - Number of seconds to format a timestamp from
 */
const calculateTimestamp = function( seconds ) {
  const minutes = Math.floor( seconds / 60 ).toString();
  let remainingSeconds = ( seconds % 60 ).toString();
  let formattedSeconds = remainingSeconds.length === 1 ? '0' + remainingSeconds : remainingSeconds;
  return `${minutes}:${formattedSeconds}`;
}

// Check for appropriate number of arguments
if ( process.argv.length > 3 ) printUsageAndExit();

// Default filename
if ( !process.argv[2] ) {
  process.argv[2] = new Date().toISOString().slice(0, 19);
}

const FILENAME = `${process.argv[2]}.txt`;
const FILEPATH = path.resolve( process.cwd(), './', FILENAME );

const rli = readline.createInterface({
  input: process.stdin,
  output: fs.createWriteStream( FILEPATH, { flags: 'a+' } )
});

// initialize time
let time = process.hrtime();

// listeners
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

// Initial prompt & corresponding line in file
process.stdout.write( '> ' );
rli.output.write( timestamp() + eol );


