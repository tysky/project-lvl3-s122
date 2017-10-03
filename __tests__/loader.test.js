import fs from 'mz/fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';
import pageLoader from '../src/index';

axios.defaults.adapter = httpAdapter;

const fixturesSrcPath = './__tests__/__fixtures__/src';
const host = 'http://example.com';
// const body = 'hello world!\n';
const body = fs.readFileSync(path.join(__dirname, '/__fixtures__/example.html'));

beforeEach(() => {
  nock(host)
    .get('/')
    .replyWithFile(200, path.join(__dirname, '/__fixtures__/example.html'));
  // .reply(200, body);
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
      expect(response.data.toString()).toBe(body.toString());
    });
});

test('page download test', () => {
  const tempDirPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  expect.assertions(1);
  return pageLoader(host, tempDirPath)
    .then(() => fs.readFile(path.join(tempDirPath, 'example-com.html')))
    .then(fileData => expect(fileData.toString()).toBe(body.toString()));
});

test('sources download test', () => {
  const tempDirPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);

  const cssPath = path.join(fixturesSrcPath, 'app.css');
  const jsPath = path.join(fixturesSrcPath, 'app.js');
  const imgPath = path.join(fixturesSrcPath, 'cat.jpg');
  const expectedCSS = fs.readFileSync(cssPath);
  const expectedJS = fs.readFileSync(jsPath);
  const expectedIMG = fs.readFileSync(imgPath);

  const testFilesPath = 'example-com_files';
  expect.assertions(3);
  return pageLoader(host, tempDirPath)
    .then(() => fs.readFile(path.join(tempDirPath, testFilesPath, 'src-app.css')))
    .then(cssFile => expect(cssFile).toBe(expectedCSS))
    .then(() => fs.readFile(path.join(tempDirPath, testFilesPath, 'src-app.js')))
    .then(jsFile => expect(jsFile).toBe(expectedJS))
    .then(() => fs.readFile(path.join(tempDirPath, testFilesPath, 'src-cat.jpg')))
    .then(imgFile => expect(imgFile).toBe(expectedIMG));
});
