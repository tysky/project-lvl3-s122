import url from 'url';
import path from 'path';

const replaceSymbols = str => str.replace(/\W/g, '-');

const getPath = (urlName, dirName, suffix) => {
  // const { host, path } = url.parse(urlName);
  const { host } = url.parse(urlName);
  const pathUrl = url.parse(urlName).path;
  const correctPath = pathUrl.slice(-1) === '/' ? pathUrl.slice(0, -1) : pathUrl;
  const fileName = `${replaceSymbols(host)}${replaceSymbols(correctPath)}${suffix}`;
  return path.resolve(dirName, fileName);
};

export const getPagePath = (urlName, outputDir) => getPath(urlName, outputDir, '.html');
export const getSrcDirPath = (urlName, outputDir) => getPath(urlName, outputDir, '_files');
export const getSrcFilePath = (srcDirPath, srcName) => {
  const { dir, name, ext } = path.parse(srcName.slice(1));
  const srcFileName = `${replaceSymbols(dir)}-${replaceSymbols(name)}${ext}`;
  return path.resolve(srcDirPath, srcFileName);
};
export const getSrcLocalPath = (srcDirPath, srcName) => {
  const { dir, base } = path.parse(getSrcFilePath(srcDirPath, srcName));
  const { name } = path.parse(dir);
  return `${name}/${base}`;
};
