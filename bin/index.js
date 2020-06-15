#!/usr/bin/env node
'use strict';
const fs = require('fs');
const payphones = require('../src/payphones');
const argv = require('yargs')
  .usage('Usage: $0 aus-payphones [options]')
  .option('f', {
    alias: 'filename',
    describe: 'The name of the file to emit the features to. The default file takes for form payphones-{timestamp}.json',
    type: 'string',
    demandOption: false,
    default: `payphones-${Date.now()}.json`,
  })
  .option('d', {
    alias: 'datefile',
    describe: 'Generate file with date - payphones-{yyyy}-{mm}-{dd}.json',
    type: 'boolean',
    demandOption: false,
    default: false,
  })
  .option('p', {
    alias: 'path',
    describe: 'Path to generate the file. Defaults to current directory',
    type: 'string',
    demandOption: false,
    default: process.cwd(),
  })
  .option('t', {
    alias: 'test',
    describe: 'Sets the mode to test to only download a subset of the data',
    type: 'boolean',
    demandOption: false,
    default: false,
  })
  .option('e', {
    alias: 'envelope',
    describe: 'Sets the mode to test to only download a subset of the data',
    type: 'string',
    demandOption: false,
    default: false,
  })
  .help('h')
  .alias('h', 'help').argv;

if (argv.d){
  // change filename to use date rather than timestamp
  let now = new Date();
  argv.f = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}.json`;
  argv.filename = argv.f;
}

// append trailing slash in path if required
if (argv.p.substr(-1) !== '/') {
  argv.p = argv.p + '/';
  argv.path = argv.p;
}

const { filename, path, test, envelope } = argv;

// check if path exists
// create path if it does not exist
if (!fs.existsSync(path)){
  console.log('path does not exist');
  fs.mkdirSync(path);
}

payphones.getPayphones(test, envelope)
  .then(results => {
    fs.writeFileSync(`${path}${filename}`, JSON.stringify(results));
    console.log(`File written to ${path}${filename}`);
  })
  .catch(e => {
    console.error('Cannot get payphone data:', e);
  });
