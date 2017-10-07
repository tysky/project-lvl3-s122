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
    pageLoader(url, program.output)
      .then(message => console.log(message))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  })
  .parse(process.argv);
