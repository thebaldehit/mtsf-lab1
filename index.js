'use strict';

const path = require('node:path');
const { convert } = require('./convertor.js');
const { readFile, writeFile } = require('./fs.js');

const convertMdToHtml = async (filePath) => {
  try {
    const absolutePath = path.join(__dirname, filePath);
    const data = await readFile(absolutePath);
    const convertedData = convert(data);
    const outPath = process.argv[process.argv.length - 1].split('=')[1];
    if (outPath) {
      const absOutPath = path.resolve(__dirname, outPath);
      await writeFile(absOutPath, convertedData);
    } else {
      console.log(convertedData);
    }
  } catch (err) {
    console.log(err);
    process.exit(err.code)
  }
};

process.stdin.setEncoding('utf8');
process.stdout.write('File name: ');
process.stdin.on('data', (data) => {
  process.stdin.pause();
  convertMdToHtml(data.trim());
});