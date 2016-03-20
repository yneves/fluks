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
var stores = require('./stores.js');
var actions = require('./actions.js');
var dispatchers = require('./dispatchers.js');

// - -------------------------------------------------------------------- - //
// - module

var Flux = factory.createClass({

  // New Flux(dispatcher Dispatcher) :Flux
  constructor: function (dispatcher) {
    if (dispatchers.isDispatcher(dispatcher)) {
      this.dispatcher = dispatcher;
    } else {
      this.dispatcher = new dispatchers.Dispatcher();
    }
  },

  // .createStore(options Object) :Store
  createStore: function (options) {
    options = options || {};
    var Store = stores.createStore(options);
    return new Store(this.dispatcher);
  },

  // .createAction(options Object) :Action
  createAction: function (options) {
    options = options || {};
    var Action = actions.createAction(options);
    return new Action(this.dispatcher);
  }

});

function isFlux (arg) {
  return arg instanceof Flux;
}

function createFlux (options) {
  options = options || {};
  options.inherits = Flux;
  return factory.createObject(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Flux: Flux,
  isFlux: isFlux,
  createFlux: createFlux
};

// - -------------------------------------------------------------------- - //
