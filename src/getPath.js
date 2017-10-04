import url from 'url';
import pathNode from 'path';

const replaceSymbols = str => str.replace(/\W/g, '-');

const getPath = (urlName, dirName, suffix) => {
  const { host, path } = url.parse(urlName);
  const correctPath = path.slice(-1) === '/' ? path.slice(0, -1) : path;
  const fileName = `${replaceSymbols(host)}${replaceSymbols(correctPath)}${suffix}`;
  return pathNode.resolve(dirName, fileName);
};

export const getPagePath = (urlName, outputDir) => getPath(urlName, outputDir, '.html');
export const getSrcDirPath = (urlName, outputDir) => getPath(urlName, outputDir, '_files');
export const getSrcFilePath = (srcDirPath, srcName) => {
  const { dir, name, ext } = pathNode.parse(srcName.slice(1));
  const srcFileName = `${replaceSymbols(dir)}-${replaceSymbols(name)}${ext}`;
  return pathNode.resolve(srcDirPath, srcFileName);
};
