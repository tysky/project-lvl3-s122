import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';

export default (url, filePath) => {
  axios.defaults.adapter = httpAdapter;
  return axios.get(url)
    .then(response => response.data)
    .then(data => fs.writeFile(filePath, data, 'utf8'))
    .catch(error => console.log('Error!', error));
};
