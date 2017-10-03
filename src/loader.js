import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';


export default (url, outputDir = './', fileName) => {
  // console.log('+++++++++++++', url);
  // console.log('=============', outputDir);
  // console.log('-------------', fileName);
  axios.defaults.adapter = httpAdapter;
  return axios.get(url)
    .catch((error) => {
      console.log('Error!', error);
    });
};
