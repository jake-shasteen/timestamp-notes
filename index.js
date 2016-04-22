#!/usr/bin/env node

const fs = require( 'fs' );
const path = require( 'path' );
const readline = require( 'readline' );
const eol = require( 'os' ).EOL;
const moment = require( 'moment' );
const now = moment();

const FILENAME = now.format() + '.txt';
const FILEPATH = path.resolve( process.cwd(), './', FILENAME );

const timestamp = function() {
  return moment().format( 'hh:mm:ss A' );
}

const rli = readline.createInterface({
  input: process.stdin,
  output: fs.createWriteStream( FILEPATH, { flags: 'a' })
});

rli.on( 'line', function ( line ) {
  rli.output.write( timestamp() + ' > ' + String( line ) + eol);
});
process.on( 'SIGINT', function() {
  rli.output.write( eol );
  process.stdout.write( eol + 'Note saved!' + eol );
  process.exit( 0 );
});

process.stdout.write( 'Enter note:' + eol );
rli.output.write( timestamp() + eol );
