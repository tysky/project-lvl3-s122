import url from 'url';
import pathNode from 'path';

const getFilePath = (dir, fileName) => pathNode.resolve(dir, fileName);

const replaceSymbols = str => str.replace(/\W/g, '-');

export default (urlName, dirName) => {
  const { host, path } = url.parse(urlName);
  const correctPath = path.slice(-1) === '/' ? path.slice(0, -1) : path;
  const fileName = `${replaceSymbols(host)}${replaceSymbols(correctPath)}.html`;
  return getFilePath(dirName, fileName);
};
