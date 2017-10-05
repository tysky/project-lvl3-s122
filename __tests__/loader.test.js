import fs from 'mz/fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../src/';
import axios from '../src/lib/axiosUpdate';


const fixturesSrcPath = './__tests__/__fixtures__/src';
const testPagePath = path.join(__dirname, '/__fixtures__/example.html');
const host = 'http://example.com';

beforeEach(() => {
  nock(host)
    .get('/')
    .replyWithFile(200, path.join(__dirname, '/__fixtures__/example.html'))
    .get('/src/app.css')
    .replyWithFile(200, path.join(__dirname, '/__fixtures__/src/app.css'))
    .get('/src/app.js')
    .replyWithFile(200, path.join(__dirname, '/__fixtures__/src/app.js'))
    .get('/src/cat.jpg')
    .replyWithFile(200, path.join(__dirname, '/__fixtures__/src/cat.jpg'));
});

test('test simple get response status', () => {
  expect.assertions(1);
  return expect(axios.get(host)
    .then(response => response.status)).resolves.toBe(200);
  // return axios.get(host)
  //   .then((response) => {
  //     expect(response.status).toBe(200);
  //   });
});

test('test simple get response body', () => {
  const body = fs.readFileSync(testPagePath);
  expect.assertions(1);
  return expect(axios.get(host)
    .then(response => response.data.toString())).resolves.toBe(body.toString());
  // return axios.get(host)
  //   .then((response) => {
  //     expect(response.data.toString()).toBe(body.toString());
  //   });
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
    .then(cssFile => expect(cssFile.toString()).toBe(expectedCSS.toString()))
    .then(() => fs.readFile(path.join(tempDirPath, testFilesPath, 'src-app.js')))
    .then(jsFile => expect(jsFile.toString()).toBe(expectedJS.toString()))
    .then(() => fs.readFile(path.join(tempDirPath, testFilesPath, 'src-cat.jpg')))
    .then(imgFile => expect(imgFile.toString()).toBe(expectedIMG.toString()));
});
