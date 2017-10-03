import fs from 'mz/fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';
import pageLoader from '../src/index';

axios.defaults.adapter = httpAdapter;

const host = 'http://example.com';
const body = 'hello world';

beforeEach(() => {
  nock(host)
    .get('/')
    .reply(200, body);
});

test('test simple get response status', () => {
  expect.assertions(1);
  return axios.get(host)
    .then((response) => {
      expect(response.status).toBe(200);
    });
});

test('test simple get response body', () => {
  expect.assertions(1);
  return axios.get(host)
    .then((response) => {
      expect(response.data).toBe(body);
    });
});

test('test downloading page', () => {
  const tempDirPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  expect.assertions(1);
  return pageLoader(host, tempDirPath)
    .then(() => fs.readFile(path.join(tempDirPath, 'example-com.html')))
    .then(fileData => expect(fileData.toString()).toBe(body));
});
