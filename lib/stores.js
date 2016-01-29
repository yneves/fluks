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
var factory = require("bauer-factory");
var dispatchers = require("./dispatchers.js");
var Immutable = require("immutable");

// - -------------------------------------------------------------------- - //
// - module

var Store = factory.createClass({

  inherits: events.EventEmitter,
  
  // new Store(dispatcher Dispatcher) :Store
  constructor: function(dispatcher) {
    
    if (dispatchers.isDispatcher(dispatcher)) {
      this.dispatcher = dispatcher;
    } else {
      this.dispatcher = new dispatchers.Dispatcher();
    }
    
    this.tokens = [];
    
    this.props = this.getDefaultProps();
    this.resetState();
    
    this.on("storeWillMount", this.storeWillMount);
    this.on("storeWillUnmount", this.storeWillUnmount);
    this.on("storeWillReceiveProps", this.storeWillReceiveProps);
    
  },
  
  register: {
    
    // .register(callback Function) :void
    f: function(callback) {
      this.tokens.push(this.dispatcher.register(callback));
    },
    
    // .register(actions Object) :void
    o: function(actions) {
      this.tokens.push(this.dispatcher.register(function(payload) {
        if (payload.actionType) {
          if (factory.isFunction(actions[payload.actionType])) {
            actions[payload.actionType].call(this,payload);
          }
        }
      }.bind(this)));
    }
  },
  
  unregister: {
    
    // .unregister() :void
    0: function() {
      while (this.tokens.length) {
        this.dispatcher.unregister(this.tokens.pop());
      }
    }
  },
  
  onChange: {
    
    // .onChange(callback Function) :void
    f: function(callback) {
      this.addListener("change",callback);
    }
  },
  
  emitChange: {
    
    // .emitChange() :void
    0: function() {
      this.emit("change");
    }
  },
  
  // .storeWillMount() :void
  storeWillMount: function() {
    
  },
  
  // .storeWillUnmount() :void
  storeWillUnmount: function() {
    
  },
  
  // .storeWillReceiveProps() :void
  storeWillReceiveProps: function() {
    
  },
   
  // .getDefaultProps() :Object
  getDefaultProps: function() {
    return {};
  },
  
  // .replaceProps(props) :void
  replaceProps: function(props) {
    this.props = props;
  },
  
  // .getInitialState() :Object
  getInitialState: function() {
    return {};
  },
  
  setState: {
    
    // .setState(state Object) :void
    o: function(state) {
      this.state = this.state.merge(state);
      this.emitChange();
    }
  },
  
  getState: {
    
    0: function() {
      return this.state.toObject();
    }
  },
  
  resetState: {
    
    // .resetState() :void
    0: function() {
      if (this.state) {
        this.state = this.state.clear();
        this.state = this.state.merge(this.getInitialState());
      } else {
        this.state = Immutable.Map(this.getInitialState());
      }
    }
  },
  
  createMixin: {
    
    // .createMixin() :Object
    0: function() {
      
      var store = this;
      var storeChangeHandler;
      
      return {
        
        getInitialState: function() {
          store.replaceProps(this.props);
          store.resetState();
          return store.getState();
        },
        
        componentWillMount: function() {
          storeChangeHandler = function() {
            if (this.storeDidChange) {
              this.storeDidChange(store);
            }
          }.bind(this);
          store.addListener("change", storeChangeHandler);
          store.emit("storeWillMount");
        },
        
        componentWillReceiveProps: function(newProps) {
          store.replaceProps(newProps);
          store.emit("storeWillReceiveProps");
        },
        
        componentWillUnmount: function() {
          store.removeListener("change", storeChangeHandler);
          store.emit("storeWillUnmount");
          store.replaceProps(store.getDefaultProps());
        }
      };
    }
  }
  
});

function isStore(arg) {
  return arg instanceof Store;
}

function createStore(options) {
  options = options || {};
  options.inherits = Store;
  return factory.createClass(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Store: Store,
  isStore: isStore,
  createStore: createStore
};

// - -------------------------------------------------------------------- - //
