'use strict';

const fsp = require('node:fs').promises;

const readFile = async (path) => {
  try {
    await fsp.access(path, fsp.constants.R_OK);
  } catch (err) {
    err.code = 404;
    throw err;
  }
  return await fsp.readFile(path, 'utf-8');
};

const writeFile = async (path, data) => {
  await fsp.writeFile(path, data);
};  

module.exports = { readFile, writeFile };