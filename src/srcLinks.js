import cheerio from 'cheerio';
import { getSrcLocalPath } from './getPath';

const startWith = path => path[0] === '/';

export const getSrcLinks = (pageBody) => {
  const $ = cheerio.load(pageBody);
  const js = $('script').map((i, el) => $(el).attr('src')).get();
  const css = $('link').map((i, el) => $(el).attr('href')).get();
  const img = $('img').map((i, el) => $(el).attr('src')).get();
  const links = [...js, ...css, ...img];
  return links.filter(link => startWith(link));
};

export const changeSrcLinks = (pageBody, srcDirPath) => {
  const $ = cheerio.load(pageBody);
  $('script').map((i, el) => {
    if ($(el).attr('src') && startWith($(el).attr('src'))) {
      return $(el).attr('src', `${getSrcLocalPath(srcDirPath, $(el).attr('src'))}`);
    }
    return el;
  });
  $('link').attr('href', (i, val) => `${getSrcLocalPath(srcDirPath, val)}`);
  $('img').attr('src', (i, val) => `${getSrcLocalPath(srcDirPath, val)}`);
  return $.html();
};
