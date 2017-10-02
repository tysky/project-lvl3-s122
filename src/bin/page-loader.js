#!/usr/bin/env node
import program from 'commander';
import config from '../../package.json';
// import loader from '..';

program
  .version(config.version)
  .description(config.description)
  .arguments('<url>')
  .option('-o, --output <outputDir>', 'Output format')
  .action((url) => {
    console.log('@@@@@@@@@@@@@@@@@@@@', url);
  });
program.parse(process.argv);
