import cheerio from 'cheerio';
import { getSrcLocalPath } from './getPath';

const isRelativePath = path => path[0] === '/';

export default (pageBody, srcDirPath) => {
  const $ = cheerio.load(pageBody);
  $('script').map((i, el) => {
    if ($(el).attr('src') && isRelativePath($(el).attr('src'))) {
      return $(el).attr('src', `${getSrcLocalPath(srcDirPath, $(el).attr('src'))}`);
    }
    return el;
  });
  $('link').attr('href', (i, val) => `${getSrcLocalPath(srcDirPath, val)}`);
  $('img').attr('src', (i, val) => `${getSrcLocalPath(srcDirPath, val)}`);
  return $.html();
};
