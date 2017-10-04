import cheerio from 'cheerio';
import url from 'url';

const isRelativePath = path => path[0] === '/';

export default (pageBody, pageUrl) => {
  const $ = cheerio.load(pageBody);
  const js = $('script').map((i, el) => $(el).attr('src')).get();
  const css = $('link').map((i, el) => $(el).attr('href')).get();
  const img = $('img').map((i, el) => $(el).attr('src')).get();
  const links = [...js, ...css, ...img];

  const { protocol, host } = url.parse(pageUrl);
  // return links;
  return links.map((link) => {
    if (isRelativePath(link)) {
      return `${protocol}//${host}${link}`;
    }
    return link;
  });
};
