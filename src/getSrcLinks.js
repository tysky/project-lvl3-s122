import cheerio from 'cheerio';

const isRelativePath = path => path[0] === '/';

export default (pageBody) => {
  const $ = cheerio.load(pageBody);
  const js = $('script').map((i, el) => $(el).attr('src')).get();
  const css = $('link').map((i, el) => $(el).attr('href')).get();
  const img = $('img').map((i, el) => $(el).attr('src')).get();
  const links = [...js, ...css, ...img];
  return links.filter(link => isRelativePath(link));
};
