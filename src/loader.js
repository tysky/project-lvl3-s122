import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';
import { getPagePath, getSrcDirPath } from './getPath';
import getSrcLinks from './getSrcLinks';
import loadFiles from './loadFiles';
import changeSrcLinks from './changeSrcLinks';


export default (url, outputDir) => {
  const pagePath = getPagePath(url, outputDir);
  const srcDirPath = getSrcDirPath(url, outputDir);
  axios.defaults.adapter = httpAdapter;
  return axios.get(url)
    .then(response => response.data)
    .then((data) => {
      // console.log('++++++++++\n', data);
      fs.writeFile(pagePath, data, 'utf8');
    })
    .then(() => fs.mkdir(srcDirPath))
    .then(() => {
      const pageFileData = fs.readFile(pagePath);
      return pageFileData;
    })
    .then((pageFileData) => {
      const pageBody = pageFileData.toString();
      const links = getSrcLinks(pageBody);
      loadFiles(url, links, srcDirPath);
      return pageBody;
    })
    .then((page) => {
      // console.log('============\n', page);
      fs.writeFile(pagePath, changeSrcLinks(page, srcDirPath), 'utf8');
    })
    .catch(error => console.log('Error!', error));
};
