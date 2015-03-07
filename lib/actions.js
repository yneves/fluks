/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

var classes = require("./classes.js");
var dispatchers = require("./dispatchers.js");

// - -------------------------------------------------------------------- - //
// - module

var Action = classes.createClass({

  // new Action(dispatcher Dispatcher) :Store
  constructor: function(dispatcher) {
    if (dispatchers.isDispatcher(dispatcher)) {
      this.dispatcher = dispatcher;
    } else {
      this.dispatcher = new dispatchers.Dispatcher()
    }
  },
  
  // .disptach(payload Object) :void
  dispatch: function(payload) {
    this.dispatcher.dispatch(payload);
  },
  
});

function isAction(arg) {
  return arg instanceof Action;
}

function createAction(options) {
  options = options || {};
  options.inherits = Action;
  
  // Wraps action creators to dispatch returned value.
  var wrapped = {};
  Object.keys(options).forEach(function(key) {
    var val = options[key];
    if (key === "inherits" || key === "constructor") {
      wrapped[key] = val;
    } else if (typeof val === "function") {
      wrapped[key] = function() {
        var ret = val.apply(this,arguments);
        if (typeof ret !== "undefined") {
          this.dispatch(ret);
        }
      };
    } else {
      wrapped[key] = val;
    }
  });
  
  return classes.createClass(wrapped);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Action: Action,
  isAction: isAction,
  createAction: createAction
};

// - -------------------------------------------------------------------- - //
