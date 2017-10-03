#!/usr/bin/env node
import program from 'commander';
import config from '../../package.json';
import pageLoader from '..';

program
  .version(config.version)
  .description(config.description)
  .option('-o, --output [outputDir]', 'Path to downloading page')
  .arguments('<url>')
  .action((url) => {
    pageLoader(url, program.output);
  })
  .parse(process.argv);
