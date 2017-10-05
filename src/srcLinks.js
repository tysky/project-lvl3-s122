import cheerio from 'cheerio';
import { getSrcLocalPath } from './getPath';

const startWith = path => path[0] === '/';

const attributes = {
  script: 'src',
  link: 'href',
  img: 'src',
};

export const getSrcLinks = (pageBody) => {
  const $ = cheerio.load(pageBody);
  const links = Object.keys(attributes).reduce((acc, tag) => {
    const tagAttrs = $(tag).map((i, el) => $(el).attr(attributes[tag])).get();
    return [...acc, ...tagAttrs];
  }, []);
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
