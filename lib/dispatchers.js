/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

'use strict';

var factory = require('bauer-factory');
var Dispatcher = require('flux').Dispatcher;

// - -------------------------------------------------------------------- - //
// - module

function isDispatcher (arg) {
  return arg instanceof Dispatcher;
}

function createDispatcher (options) {
  options = options || {};
  options.inherits = Dispatcher;
  return factory.createClass(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Dispatcher: Dispatcher,
  isDispatcher: isDispatcher,
  createDispatcher: createDispatcher
};

// - -------------------------------------------------------------------- - //
