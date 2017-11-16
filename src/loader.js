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
        task: async () => {
          const response = await axios.get(srcUrl, { responseType: 'arraybuffer' });
          await fs.writeFile(getSrcFilePath(srcDirPath, link), response.data);
        },
      },
    ]);
    tasks.run();
  });
};

export default async (urlPage, outputDir) => {
  const pagePath = getPagePath(urlPage, outputDir);
  const srcDirPath = getSrcDirPath(urlPage, outputDir);
  try {
    const response = await axios.get(urlPage);
    log(`request to ${urlPage}`);
    log(`saving page in ${pagePath}`);
    await fs.writeFile(pagePath, response.data, 'utf8');
    log(`creating directory '${srcDirPath}' for saving sources from the page'`);

    await fs.mkdir(srcDirPath);
    const pageFileData = await fs.readFile(pagePath);
    log('start downloading files to the local directory and changing links in the page to local sources');

    const pageBody = pageFileData.toString();
    const links = getSrcLinks(pageBody);
    loadFiles(urlPage, links, srcDirPath);
    await Promise.all([loadFiles(urlPage, links, srcDirPath),
      fs.writeFile(pagePath, changeSrcLinks(pageBody, srcDirPath), 'utf8')]);
    const message = `\nPage was downloaded as ${path.parse(pagePath).base}`;
    return message;
  } catch (error) {
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
  }
};
