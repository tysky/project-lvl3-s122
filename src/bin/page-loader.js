#!/usr/bin/env node
import fs from 'fs';
import program from 'commander';
import config from '../../package.json';
import pageLoader from '..';

program
  .version(config.version)
  .description(config.description)
  .option('-o, --output [outputDir]', 'Path to downloading page')
  .arguments('<url>')
  .action((url) => {
    if (fs.existsSync(program.output)) {
      pageLoader(url, program.output);
    } else {
      console.log('Error. Incorrect path to the directory. Please rerun programm and choose correct path');
    }
  })
  .parse(process.argv);
