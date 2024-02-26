'use strict';

const regExpes = [
  {
    regExp: /```.*```/s,
    lengthS: 3,
    lengthE: 3,
    changeToStart: '<pre>',
    changeToEnd: '</pre>',
    nestedTag: true,
    fn: (data) => data.split(' ').map(word => '~!~' + word).join(' ')
  },
  {
    regExp: / \*\*.*?\*\*/,
    lengthS: 3,
    lengthE: 2,
    changeToStart: ' <b>',
    changeToEnd: '</b>',
    nestedTag: false
  },
  {
    regExp: / _.*?_/,
    lengthS: 2,
    lengthE: 1,
    changeToStart: ' <i>',
    changeToEnd: '</i>',
    nestedTag: false
  },
  {
    regExp: / `.*?`/,
    lengthS: 2,
    lengthE: 1,
    changeToStart: ' <tt>',
    changeToEnd: '</tt>',
    nestedTag: false
  }
];

const addParagrapgs = (data) => {
  data = '<p>' + data;
  let idx;
  while ((idx = data.indexOf('\n\n')) != -1) {
    data = data.slice(0, idx) + '</p><p>' + data.slice(idx + 1);
  }
  data = data + '</p>';
  return data;
};

const isNestedTag = (data) => {
  for (const regExp of regExpes) {
    if (data.match(regExp.regExp) != null) return true;
  }
  return false;
}

const deleteInternalSymbols = (data, symbols) => data.split(' ').map(word => word.replace(symbols, '')).join(' ');

const convert = (data) => {
  data = addParagrapgs(data);
  for (const regExp of regExpes) {
    let match;
    while ((match = data.match(regExp.regExp)) != null) {
      const midx = match.index;
      const mlength = match[0].length;
      const preformatedData = data.slice(midx + regExp.lengthS, midx + mlength - regExp.lengthE);
      const formatedData = regExp.fn ? regExp.fn(preformatedData) : preformatedData;
      if (!regExp.nestedTag && isNestedTag(' ' + formatedData)) {
        const err = new Error('Error: invalid markdown nested tags');
        err.code = 406;
        throw err;
      }
      data = data.slice(0, midx) + regExp.changeToStart + formatedData + regExp.changeToEnd + data.slice(midx + mlength); 
    }
  }
  data = deleteInternalSymbols(data, '~!~');
  console.log(data); // console
};

module.exports = { convert };