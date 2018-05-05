'use strict';

const assert = require('assert');
const lisp = require('./lisp');

const eq = assert.deepStrictEqual;

eq(lisp(123), 123);
eq(lisp(123, 345), 345);
eq(lisp(['+', 123, 345]), 468);
eq(lisp(['+', ['*', 12, 80], ['/', 20, 5]]), 964);

eq(lisp(
  ['defun', 'square', ['x'], ['*', 'x', 'x']],
  ['square', 10]
), 100);

eq(lisp(
  ['defun', 'factorial', ['n'],
   ['if', ['<=', 'n', 1],
    1,
    ['*', 'n', ['factorial', ['-', 'n', 1]]]
   ]
  ],
  ['factorial', 10]
), 3628800);

eq(lisp(
  ['defun', 'fib', ['n'],
   ['cond',
    [['=', 'n', 0], 0],
    [['=', 'n', 1], 1],
    [true, ['+',
           ['fib', ['-', 'n', 1]],
           ['fib', ['-', 'n', 2]]
          ]
    ]
   ]
  ],
  ['fib', 10]
), 55);

console.log('ok');
