import axios from 'axios';
import fs from 'mz/fs';
import url from 'url';
import { getSrcFilePath } from './getPath';

export default (pageUrl, links, srcDirPath) => {
  const { protocol, host } = url.parse(pageUrl);
  links.map((link) => { // eslint-disable-line array-callback-return
    const srcUrl = `${protocol}//${host}${link}`;
    console.log('#####################\n', srcUrl);
    axios.get(srcUrl, { responseType: 'arraybuffer' })
      .then(response => fs.writeFile(getSrcFilePath(srcDirPath, link), response.data))
      .catch(error => console.log('Error in sources downoading!', error));
  });
};
