#!/usr/bin/env node
import program from 'commander';
import config from '../../package.json';
import pageLoader from '..';

program
  .version(config.version)
  .description(config.description)
  .arguments('<url>')
  .option('-o, --output [outputDir]', 'Output format')
  .action((url) => {
    pageLoader(url);
  });
program.parse(process.argv);
