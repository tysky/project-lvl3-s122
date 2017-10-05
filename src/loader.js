import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';
import url from 'url';
import { getPagePath, getSrcDirPath, getSrcFilePath } from './getPath';
import { getSrcLinks, changeSrcLinks } from './srcLinks';


const loadFiles = (pageUrl, links, srcDirPath) => {
  links.map((link) => { // eslint-disable-line array-callback-return
    const srcUrl = url.resolve(pageUrl, link);
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
    .then(response => response.data)
    .then(data => fs.writeFile(pagePath, data, 'utf8'))
    .then(() => fs.mkdir(srcDirPath))
    .then(() => fs.readFile(pagePath))
    .then((pageFileData) => {
      const pageBody = pageFileData.toString();
      const links = getSrcLinks(pageBody);
      loadFiles(urlPage, links, srcDirPath);
      return pageBody;
    })
    .then(page => fs.writeFile(pagePath, changeSrcLinks(page, srcDirPath), 'utf8'))
    .catch(error => console.log('Error!', error));
};
