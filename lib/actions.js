/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var factory = require("bauer-factory");
var dispatchers = require("./dispatchers.js");

// - -------------------------------------------------------------------- - //
// - module

var Action = factory.createClass({

  // new Action(dispatcher Dispatcher) :Action
  constructor: function(dispatcher) {
    
    if (dispatchers.isDispatcher(dispatcher)) {
      this.dispatcher = dispatcher;
    } else {
      this.dispatcher = new dispatchers.Dispatcher();
    }
  },
  
  dispatch: {
    
    // .dispatch(actionType String) :void
    s: function(actionType) {
      this.dispatcher.dispatch({
        actionType: actionType
      });
    },
    
    // .disptach(payload Object) :void
    o: function(payload) {
      this.dispatcher.dispatch(payload);
    }
    
  }
  
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
    } else if (factory.isFunction(val)) {
      wrapped[key] = function() {
        var ret = val.apply(this,arguments);
        if (typeof ret !== "undefined") {
          this.dispatch(ret);
        }
      };
    } else if (factory.isObject(val)) {
      wrapped[key] = function() {
        this.dispatch(val);
      };
    } else if (factory.isString(val)) {
      wrapped[key] = function() {
        this.dispatch(val);
      };
    } else {
      wrapped[key] = val;
    }
  });
  
  return factory.createClass(wrapped);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Action: Action,
  isAction: isAction,
  createAction: createAction
};

// - -------------------------------------------------------------------- - //
