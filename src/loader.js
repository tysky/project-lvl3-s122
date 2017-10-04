import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';
import { getPagePath, getSrcDirPath } from './getPath';
import getSrcLinks from './getSrcLinks';
import loadFiles from './loadFiles';


export default (url, outputDir) => {
  const filePath = getPagePath(url, outputDir);
  const srcDirPath = getSrcDirPath(url, outputDir);
  axios.defaults.adapter = httpAdapter;
  return axios.get(url)
    .then(response => response.data)
    .then(data => fs.writeFile(filePath, data, 'utf8'))
    .then(() => fs.mkdir(srcDirPath))
    .then(() => {
      const pageFileData = fs.readFile(filePath);
      return pageFileData;
    })
    .then((pageFileData) => {
      // console.log('++++++++++', pageFileData.toString());
      const links = getSrcLinks(pageFileData.toString());
      // console.log('===============\n', links);
      loadFiles(url, links, srcDirPath);
    })
    .catch(error => console.log('Error!', error));
};
