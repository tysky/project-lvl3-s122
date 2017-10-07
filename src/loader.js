import debug from 'debug';
import Listr from 'listr';
import fs from 'mz/fs';
import path from 'path';
import url from 'url';
import axios from './lib/customAxios';
import { getPagePath, getSrcDirPath, getSrcFilePath } from './getPath';
import { getSrcLinks, changeSrcLinks } from './srcLinks';

const log = debug('page-loader');

const loadFiles = (pageUrl, links, srcDirPath) => {
  links.map((link) => { // eslint-disable-line array-callback-return
    const srcUrl = url.resolve(pageUrl, link);
    log(`downloading file ${srcUrl}`);
    const tasks = new Listr([
      {
        title: srcUrl,
        task: () => {
          axios.get(srcUrl, { responseType: 'arraybuffer' })
            .then(response => fs.writeFile(getSrcFilePath(srcDirPath, link), response.data));
        },
      },
    ]);
    tasks.run();
  });
};

export default (urlPage, outputDir) => {
  const pagePath = getPagePath(urlPage, outputDir);
  const srcDirPath = getSrcDirPath(urlPage, outputDir);
  return axios.get(urlPage)
    .then((response) => {
      log(`request to ${urlPage}`);
      return response.data;
    })
    .then((data) => {
      log(`saving page in ${pagePath}`);
      return fs.writeFile(pagePath, data, 'utf8');
    })
    .then(() => {
      log(`creating directory '${srcDirPath}' for saving sources from the page'`);
      return fs.mkdir(srcDirPath);
    })
    .then(() => fs.readFile(pagePath))
    .then((pageFileData) => {
      log('start downloading files to the local directory and changing links in the page to local sources');
      const pageBody = pageFileData.toString();
      const links = getSrcLinks(pageBody);
      loadFiles(urlPage, links, srcDirPath);
      return Promise.all([loadFiles(urlPage, links, srcDirPath),
        fs.writeFile(pagePath, changeSrcLinks(pageBody, srcDirPath), 'utf8')]);
    })
    .then(() => `\nPage was downloaded as ${path.parse(pagePath).base}`)
    .catch((error) => {
      if (error.response) {
        const msg = `Error. Request failed with status code ${error.response.status}`;
        return Promise.reject(msg);
      }
      const errMessages = {
        ENOTFOUND: 'Error. This address was not found',
        ENOENT: "Error. The directory doesn't exists",
        EACCES: "Error. You don't have permissons to write files to this directory",
        EEXIST: 'Error. File with this name already exists',
        ENOTDIR: "Error. Given path isn't path to the directory",
      };
      return Promise.reject(errMessages[error.code]);
    });
};
