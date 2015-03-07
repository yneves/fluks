/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

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
  
  // .register(callback Function) :void
  register: function(callback) {
    var token = this.dispatcher.register(callback);
    this.tokens.push(token);
  },
  
  // .unregister() :void
  unregister: function() {
    while (this.tokens.length) {
      var token = this.tokens.pop();
      this.dispatcher.unregister(token);
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
