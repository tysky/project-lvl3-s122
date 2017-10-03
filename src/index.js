import loader from './loader';
import getFileName from './getFileName';

export default (url, outputDir) => loader(url, outputDir, getFileName(url));
