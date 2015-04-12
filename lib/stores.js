/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var events = require("events");
var classes = require("./classes.js");
var dispatchers = require("./dispatchers.js");

// - -------------------------------------------------------------------- - //
// - module

var Store = classes.createClass({

  inherits: events.EventEmitter,
  
  // new Store(dispatcher Dispatcher) :Store
  constructor: function(dispatcher) {
    if (dispatchers.isDispatcher(dispatcher)) {
      this.dispatcher = dispatcher;
    } else {
      this.dispatcher = new dispatchers.Dispatcher()
    }
    this.tokens = [];
  },
  
  // .register(callback Function|Object) :void
  register: function(callback) {
    if (typeof callback === "function") {
      this.tokens.push(this.dispatcher.register(callback));
    } else if (callback instanceof Object) {
      this.tokens.push(this.dispatcher.register(function(payload) {
        if (payload.actionType) {
          if (typeof callback[payload.actionType] === "function") {
            callback[payload.actionType].call(this,payload);
          }
        }
      }.bind(this)));
    }
  },
  
  // .unregister() :void
  unregister: function() {
    while (this.tokens.length) {
      this.dispatcher.unregister(this.tokens.pop());
    }
  },
  
  // .onChange(callback Function) :void
  onChange: function(callback) {
    this.addListener("change",callback);
  },
  
  // .emitChange() :void
  emitChange: function() {
    this.emit("change");
  },
  
  // .createMixin() :Object
  createMixin: function() {
    var store = this;
    var callback;
    return {
      componentDidMount: function() {
        var component = this;
        callback = function() {
          if (typeof component.storeDidChange === "function") {
            component.storeDidChange();
          }
        };
        store.addListener("change",callback);
      },
      componentWillUnmount: function() {
        store.removeListener("change",callback);
      }
    }
  }
  
});

function isStore(arg) {
  return arg instanceof Store;
}

function createStore(options) {
  options = options || {};
  options.inherits = Store;
  return classes.createClass(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Store: Store,
  isStore: isStore,
  createStore: createStore
};

// - -------------------------------------------------------------------- - //
