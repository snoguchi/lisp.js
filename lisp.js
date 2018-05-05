'use strict';

function lisp(...lists) {
  const global = {};
  const lexical = [];

  const operators = {
    '+': function(list) {
      return list.reduce((a, b) => a + b);
    },
    '-': function(list) {
      return list.reduce((a, b) => a - b);
    },
    '*': function(list) {
      return list.reduce((a, b) => a * b);
    },
    '/': function(list) {
      return list.reduce((a, b) => a / b);
    },
    '=': function(list) {
      return list[0] == list[1];
    },
    'equal': function(list) {
      return list[0] === list[1];
    },
    '>': function(list) {
      return list[0] > list[1];
    },
    '<': function(list) {
      return list[0] < list[1];
    },
    '<=': function(list) {
      return list[0] <= list[1];
    },
    '>=': function(list) {
      return list[0] >= list[1];
    }
  };

  const specialForms = {
    defun: function(list) { // ['defun', 'square', ['x'], ['*', 'x', 'x']]
      global[list[0]] = list;
    },
    setq: function(list) { // ['setq', 'x', 1]
      global[list[0]] = process(list[1]);
    },
    let: function(list) {
      lexical[0][list[0]] = process(list[1]);
    },
    if: function(list) {
      return process(list[0]) ? process(list[1]) : process(list[2]);
    },
    cond: function(list) {
      for (let i = 0; i < list.length; i++) {
        if (process(list[i][0])) {
          return process(list[i][1]);
        }
      }
      return null;
    },
    progn: function(list) {
      return progn(list);
    }
  };

  function lookup(symbol) {
    let value;
    if (typeof symbol === 'string') {
      if (lexical.length > 0 && symbol in lexical[0]) {
        value = lexical[0][symbol];
      } else if (symbol in global) {
        value = global[symbol];
      }
    } else {
      value = symbol;
    }
    return value;
  }

  function process(list) {
    let result;
    if (!(list instanceof Array)) {
      result = lookup(list);
    } else {
      const name = list[0], args = list.slice(1);
      let func = lookup(name); // func = ['square', ['x'], ['*', 'x', 'x']]
      if (func) {
        lexical.unshift(func[1].reduce((scope, argName, i) => {
          scope[argName] = process(args[i]);
          return scope;
        }, {}));
        result = process(func[2]);
        lexical.shift();
      } else if (operators[name]) {
        result = operators[name](args.map(process));
      } else if (specialForms[name]) {
        result = specialForms[name](args);
      } else {
        throw `invalid list ${list}`;
      }
    }
    return result;
  }

  function progn(lists) {
    return lists.reduce((a, b) => process(b), null);
  }

  return progn(lists);
}

module.exports = lisp;
