import url from 'url';

const replaceSymbols = str => str.replace(/\W/g, '-');

export default (urlName) => {
  const { host, path } = url.parse(urlName);
  return `${replaceSymbols(host)}${replaceSymbols(path)}.html`;
};
