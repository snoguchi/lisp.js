'use strict';

const lisp = require('./lisp');
const nil = lisp.nil;
const t = lisp.t;
const eq = require('assert').deepStrictEqual;

eq(lisp(123), 123);

eq(lisp(123, 345), 345);

eq(lisp(['+', 123, 345]), 468);

eq(lisp(['+', ['*', 12, 80], ['/', 20, 5]]), 964);

eq(lisp(['quote', [1, 2, 3, 4]]), [1, 2, 3, 4]);

eq(lisp(['car', ['quote', [1, 2, 3, 4]]]), 1);

eq(lisp(['cdr', ['quote', [1, 2, 3, 4]]]), [2, 3, 4]);

eq(lisp(['cons', 1, ['cons', 2, ['cons', 3, 4]]]), [1, 2, 3, 4]);

eq(lisp(['if', t, 11, 24]), 11);

eq(lisp(['if', nil, 11, 24]), 24);

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
    [t, ['+',
         ['fib', ['-', 'n', 1]],
         ['fib', ['-', 'n', 2]]
        ]
    ]
   ]
  ],
  ['fib', 10]
), 55);

console.log('ok');
