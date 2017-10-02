import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';

export default (url) => {
  axios.defaults.adapter = httpAdapter;
  return axios.get(url)
    .catch((error) => {
      console.log('Error!', error);
    });
};
