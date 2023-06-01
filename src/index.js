#! /usr/bin/env node

const { program } = require( "commander" );
const chalk = require("chalk");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

const { processFile, processDirectory } = require( "./processors" );

program
    .option( "-f, --file <file>", "file to be processed" )
    .option( "-d, --dir <dir>", "directory to be processed" )
    .option( "-o, --out <out>", "output directory" )
    .option( "-v, --version", "output the version number" )
    .option( "-l, --lang <lang>", "language file to be processed" )
    .option( "-w, --watch", "watch for changes")
    .option( "-i, --init <init>", "generate stub files to location" );

program.parse();

const options = program.opts();

console.log("\n" + chalk.red.bold("MEGA") + chalk.cyan.bold("ZORD") + " - " + chalk.bgGray( " HTML Assembler \n") );

if ( options.version ) {
    const version = require( "./package.json" ).version;
    console.log( chalk.blue.bold( " -- Version: " + version + "\n" ) );

    return;
}

if ( options.init ) {

    // copy sample folder and all subfolders to output directory
    const outputDir = path.resolve( options.init );
    const sampleDir = path.resolve( __dirname, "stub" );

    fse.copySync( sampleDir, outputDir );

    console.log( chalk.green.bold( " -- Project files created in " + outputDir + "\n" ) );
    return;
}

if ( !options.file && !options.dir ) {
    console.log( chalk.red.bold( " -- Error: Please specify a file or directory to be processed.\n" ) );
    return process.exit( 1 );
}

if ( !options.out ) {
    console.log(chalk.red.bold( " -- Error: Please specify an output directory.\n" ) );
    return process.exit( 1 );
}

if ( options.watch ) {
    console.log( chalk.blue.bold( " -- Watching for changes...\n" ) );

    if ( options.file ) {
        fs.watch( options.file, ( eventType, filename ) => {
            if ( eventType === "change" ) {
                return processFile( options.file, options, options.out );
            }
        } );

        processFile( options.file, options, options.out );

        return;
    }

    if ( options.dir ) {
        // watch files in options.dir and process them if anything changes
        fs.watch( options.dir, { recursive: true }, ( eventType, filename ) => {
            if ( eventType === "change" ) {
               return processDirectory( options.dir, options, options.out );
            }
        });

        processDirectory( options.dir, options, options.out );

        return;
    }

}

if ( options.file ) {
    return processFile( options.file, options, options.out );
}

if ( options.dir ) {
    return processDirectory( options.dir, options, options.out );
}
