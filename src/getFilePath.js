import url from 'url';
import pathNode from 'path';

const replaceSymbols = str => str.replace(/\W/g, '-');

const getPath = (urlName, dirName, suffix) => {
  const { host, path } = url.parse(urlName);
  const correctPath = path.slice(-1) === '/' ? path.slice(0, -1) : path;
  const fileName = `${replaceSymbols(host)}${replaceSymbols(correctPath)}`;
  return pathNode.resolve(dirName, `${fileName}${suffix}`);
};

export const getPagePath = (urlName, outputDir) => getPath(urlName, outputDir, '.html');
export const getSrcDirPath = (urlName, outputDir) => getPath(urlName, outputDir, '_files');
