import loader from './loader';
import getFilePath from './getFilePath';

export default (url, outputDir = './') => loader(url, getFilePath(url, outputDir));
