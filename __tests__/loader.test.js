import fs from 'mz/fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../src/';
import axios from '../src/lib/customAxios';


const fixturesSrcPath = './__tests__/__fixtures__/src';
const testPagePath = path.join(__dirname, '/__fixtures__/example.html');
const host = 'http://example.com';

describe('Test success requests', () => {
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

  test('test simple get response status', async () => {
    expect.assertions(1);
    const response = await axios.get(host);
    await expect(response.status).toBe(200);
  });

  test('test simple get response body', async () => {
    const body = fs.readFileSync(testPagePath);
    expect.assertions(1);
    const response = await axios.get(host);
    await expect(response.data.toString()).toBe(body.toString());
  });

  test('sources download test', async () => {
    const tempDirPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);

    const cssPath = path.join(fixturesSrcPath, 'app.css');
    const jsPath = path.join(fixturesSrcPath, 'app.js');
    const imgPath = path.join(fixturesSrcPath, 'cat.jpg');
    const expectedCSS = fs.readFileSync(cssPath);
    const expectedJS = fs.readFileSync(jsPath);
    const expectedIMG = fs.readFileSync(imgPath);

    const testFilesPath = 'example-com_files';
    expect.assertions(3);

    await pageLoader(host, tempDirPath);
    const cssFile = await fs.readFile(path.join(tempDirPath, testFilesPath, 'src-app.css'));
    const jsFile = await fs.readFile(path.join(tempDirPath, testFilesPath, 'src-app.js'));
    const imgFile = await fs.readFile(path.join(tempDirPath, testFilesPath, 'src-cat.jpg'));
    await expect(cssFile.toString()).toBe(expectedCSS.toString());
    await expect(jsFile.toString()).toBe(expectedJS.toString());
    await expect(imgFile.toString()).toBe(expectedIMG.toString());
  });
});

describe('Test errors', () => {
  test('404 page test', async () => {
    nock(host).get('/404page').reply(404);
    const tempDirPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    expect.assertions(1);
    await expect(pageLoader(`${host}/404page`, tempDirPath))
      .rejects.toMatch('Error. Request failed with status code 404');
  });
  test('ENOENT: test downloading to nonexistent directory', async () => {
    nock(host).get('/').reply(200, 'hello world');
    expect.assertions(1);
    await expect(pageLoader(host, './nonexistent'))
      .rejects.toMatch("Error. The directory doesn't exists");
  });
  test('ENOTDIR: passed filepath instead of path to the directory', async () => {
    nock(host).get('/').reply(200, 'hello world');
    expect.assertions(1);
    await expect(pageLoader(host, path.join(__dirname, '/__fixtures__/file.md')))
      .rejects.toMatch("Error. Given path isn't path to the directory");
  });
});
