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
    
    var action = this;
    var prototype = Object.getPrototypeOf(this);
    Object.keys(prototype).forEach(function(method) {
      if (method !== "dispatch") {
        action[method] = function() {
          var ret = prototype[method].apply(action,arguments);
          if (typeof ret !== "undefined") {
            action.dispatch(ret);
          }
        };
      }
    });
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
  return factory.createClass(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Action: Action,
  isAction: isAction,
  createAction: createAction
};

// - -------------------------------------------------------------------- - //
