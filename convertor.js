'use strict';

const regExpes = [
  {
    regExp: /```.*```/s,
    lengthS: 3,
    lengthE: 3,
    changeToStart: '<pre>',
    changeToEnd: '</pre>',
    fn: (data) => data.split(' ').map(word => '~!~' + word).join(' ')
  },
  {
    regExp: / \*\*.*\*\*/,
    lengthS: 3,
    lengthE: 2,
    changeToStart: ' <b>',
    changeToEnd: '</b>'
  },
  {
    regExp: / _.*_/,
    lengthS: 2,
    lengthE: 1,
    changeToStart: ' <i>',
    changeToEnd: '</i>'
  },
  {
    regExp: / `.*`/,
    lengthS: 2,
    lengthE: 1,
    changeToStart: ' <tt>',
    changeToEnd: '</tt>'
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

const deleteInternalSymbols = (data, symbols) => data.split(' ').map(word => word.replace(symbols, '')).join(' ');

const convert = (data) => {
  data = addParagrapgs(data);
  for (const regExp of regExpes) {
    let match;
    while ((match = data.match(regExp.regExp)) != null) {
      console.log(match);
      const midx = match.index;
      const mlength = match[0].length;
      const preformatedData = data.slice(midx + regExp.lengthS, midx + mlength - regExp.lengthE);
      const formatedData = regExp.fn ? regExp.fn(preformatedData) : preformatedData;
      data = data.slice(0, midx) + regExp.changeToStart + formatedData + regExp.changeToEnd + data.slice(midx + mlength); 
    }
  }
  data = deleteInternalSymbols(data, '~!~');
  console.log(data); // console
};

module.exports = { convert };