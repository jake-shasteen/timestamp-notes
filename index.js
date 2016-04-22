#!/usr/bin/env node

const fs = require( 'fs' );
const cp = require( 'copy-paste' );
const path = require( 'path' );
const readline = require( 'readline' );
const eol = require( 'os' ).EOL;
const moment = require( 'moment' );
const now = moment();

if ( process.argv.length !== 3 ) printUsageAndExit();

const FILENAME = `${process.argv[2]}.txt`;
const FILEPATH = path.resolve( process.cwd(), './', FILENAME );

const timestamp = function() {
  return moment().format( 'hh:mm:ss A' );
}

const rli = readline.createInterface({
  input: process.stdin,
  output: fs.createWriteStream( FILEPATH, { flags: 'a+' } )
});

rli.on( 'line', function ( line ) {
  rli.output.write( timestamp() + ' > ' + String( line ) + eol );
  process.stdout.write( '> ' );
});

process.on( 'SIGINT', function() {
  rli.output.write( eol );
  process.stdout.write( eol + 'Note saved!' + eol );
  cp.copy( fs.readFileSync( FILEPATH ) );
  process.exit( 0 );
});

process.stdout.write( '> ' );
rli.output.write( timestamp() + eol );

function printUsageAndExit () {
  console.log('Usage: timestamp <filename>');
  process.exit(1);
}
