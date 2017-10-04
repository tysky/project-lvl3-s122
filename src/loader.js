import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';
import { getPagePath, getSrcDirPath } from './getFilePath';
import getSrcLinks from './getSrcLinks';
// impot loadFiles from 'loadFiles';


export default (url, outputDir) => {
  const filePath = getPagePath(url, outputDir);
  axios.defaults.adapter = httpAdapter;
  return axios.get(url)
    .then(response => response.data)
    .then(data => fs.writeFile(filePath, data, 'utf8'))
    .then(() => fs.mkdir(getSrcDirPath(url, outputDir)))
    .then(() => {
      const pageFileData = fs.readFile(filePath);
      console.log('=========', pageFileData.toString());
      return pageFileData;
    })
    .then((pageFileData) => {
      console.log('++++++++++', pageFileData.toString());
      const links = getSrcLinks(pageFileData.toString(), url);
      console.log('===============\n', links);
      // links.forEach(link => loadFiles(link));
    })
    .catch(error => console.log('Error!', error));
};
