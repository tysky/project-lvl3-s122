import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';
import cheerio from 'cheerio';
import { getPagePath, getSrcDirPath } from './getFilePath';
// impot loadFiles from 'loadFiles';

const getSrcLinks = (page) => {
  const $ = cheerio.load(page);
  const js = $('script').map((i, el) => $(el).attr('src')).get();
  const css = $('link').map((i, el) => $(el).attr('href')).get();
  const img = $('img').map((i, el) => $(el).attr('src')).get();
  return [...js, ...css, ...img];
};

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
      const links = getSrcLinks(pageFileData.toString());
      // console.log('===============\n', links);
      // links.forEach(link => loadFiles(link));
    })
    .catch(error => console.log('Error!', error));
};
