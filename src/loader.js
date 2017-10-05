import axios from 'axios';
import debug from 'debug';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';
import url from 'url';
import { getPagePath, getSrcDirPath, getSrcFilePath } from './getPath';
import { getSrcLinks, changeSrcLinks } from './srcLinks';

const log = debug('page-loader');

const loadFiles = (pageUrl, links, srcDirPath) => {
  links.map((link) => { // eslint-disable-line array-callback-return
    const srcUrl = url.resolve(pageUrl, link);
    log(`downloading file ${srcUrl}`);
    axios.get(srcUrl, { responseType: 'arraybuffer' })
      .then(response => fs.writeFile(getSrcFilePath(srcDirPath, link), response.data))
      .catch(error => error);
  });
};

export default (urlPage, outputDir) => {
  const pagePath = getPagePath(urlPage, outputDir);
  const srcDirPath = getSrcDirPath(urlPage, outputDir);
  axios.defaults.adapter = httpAdapter;
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
      log('start downloading files to the local directory');
      const pageBody = pageFileData.toString();
      const links = getSrcLinks(pageBody);
      loadFiles(urlPage, links, srcDirPath);
      return pageBody;
    })
    .then((page) => {
      log('changing links in the page to local sources');
      return fs.writeFile(pagePath, changeSrcLinks(page, srcDirPath), 'utf8');
    })
    .catch(error => console.log('Error!', error));
};
