import nock from 'nock';
// import axios from 'axios';
// import httpAdapter from 'axios/lib/adapters/http';
import pageLoader from '../src/index';

const host = 'http://localhost';
const body = 'hello world';


nock(host)
  .get('/')
  .reply(200, body);

test('test web page loader', () => {
  expect.assertions(1);
  return pageLoader(host)
    .then((response) => {
      expect(response.data).toBe(body);
    });
});
