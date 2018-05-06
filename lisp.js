'use strict';

const t = true;
const nil = [];

function lisp(...lists) {
  // TODO: separate func and var namespace
  const global = {};
  const lexical = [];

  const operators = {
    '+': function(args) {
      return args.reduce((a, b) => a + b);
    },
    '-': function(args) {
      return args.reduce((a, b) => a - b);
    },
    '*': function(args) {
      return args.reduce((a, b) => a * b);
    },
    '/': function(args) {
      return args.reduce((a, b) => a / b);
    },
    '=': function(args) {
      return args[0] == args[1] ? t : nil;
    },
    'equal': function(args) {
      return args[0] === args[1] ? t : nil;
    },
    '>': function(args) {
      return args[0] > args[1] ? t : nil;
    },
    '<': function(args) {
      return args[0] < args[1] ? t : nil;
    },
    '<=': function(args) {
      return args[0] <= args[1] ? t : nil;
    },
    '>=': function(args) {
      return args[0] >= args[1] ? t: nil;
    },
    car: function(args) {
      return args[0][0];
    },
    cdr: function(args) {
      return args[0].slice(1);
    },
    cons: function(args) {
      return [].concat(args[0]).concat(args[1]);
    }
  };

  const specialForms = {
    quote: function(args) { // ['quote', []
      return args[0];
    },
    defun: function(args) { // ['defun', 'square', ['x'], ['*', 'x', 'x']]
      global[args[0]] = args;
    },
    setq: function(args) { // ['setq', 'x', 1]
      global[args[0]] = process(args[1]);
    },
    let: function(args) {
      lexical[0][args[0]] = process(args[1]);
    },
    if: function(args) {
      return !isNil(process(args[0])) ? process(args[1]) : process(args[2]);
    },
    cond: function(args) {
      for (let i = 0; i < args.length; i++) {
        if (!isNil(process(args[i][0]))) {
          return process(args[i][1]);
        }
      }
      return null;
    },
    progn: function(args) {
      return progn(args);
    }
  };

  function isNil(value) {
    return value instanceof Array && value.length === 0;
  }

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
    if (isNil(list)) {
      return list;
    } else if (!(list instanceof Array)) {
      result = lookup(list);
    } else if (typeof list[0] === 'string') {
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
        throw `no such operator or function ${list}`;
      }
    } else {
      throw `invalid list expr ${list}`;
    }
    return result;
  }

  function progn(lists) {
    return lists.reduce((a, b) => process(b), null);
  }

  return progn(lists);
}

module.exports = lisp;
lisp.lisp = lisp;
lisp.nil = nil;
lisp.t = t;
