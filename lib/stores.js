/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

'use strict';

var events = require('events');
var factory = require('bauer-factory');
var dispatchers = require('./dispatchers.js');
var Immutable = require('immutable');

// - -------------------------------------------------------------------- - //
// - module

var Store = factory.createClass({

  inherits: events.EventEmitter,

  // New Store(dispatcher Dispatcher) :Store
  constructor: function (dispatcher) {

    if (dispatchers.isDispatcher(dispatcher)) {
      this.dispatcher = dispatcher;
    } else {
      this.dispatcher = new dispatchers.Dispatcher();
    }

    this.tokens = [];

    this.resetProps();
    this.resetState();

    var name = this.constructor.name;
    var trace;
    var handler;

    if (factory.isFunction(this.storeWillMount)) {
      trace = new Error(name + ': storeWillMount handler error');
      handler = this.catchError(this.storeWillMount.bind(this), trace);
      this.on('storeWillMount', handler);
    }

    if (factory.isFunction(this.storeWillUnmount)) {
      trace = new Error(name + ': storeWillUnmount handler error');
      handler = this.catchError(this.storeWillUnmount.bind(this), trace);
      this.on('storeWillUnmount', handler);
    }

    if (factory.isFunction(this.storeWillReceiveProps)) {
      trace = new Error(name + ': storeWillReceiveProps handler error');
      handler = this.catchError(this.storeWillReceiveProps.bind(this), trace);
      this.on('storeWillReceiveProps', handler);
    }
  },

  catchError: {

    // .catchError(callback Function, trace Error) :Function
    fe: function (callback, trace) {
      return function (arg) {
        try {
          callback(arg);
        } catch (error) {
          if (this.listenerCount('error')) {
            this.emit('error', error, trace);
          } else {
            console.error(error, trace);
          }
        }
      }.bind(this);
    }
  },

  register: {

    // .register(callback Function) :void
    f: function (callback) {
      var trace = new Error(this.constructor.name + ': dispatcher handler error');
      var token = this.dispatcher.register(this.catchError(callback, trace));
      this.tokens.push(token);
    },

    // .register(actions Object) :void
    o: function (actions) {
      this.register(function (payload) {
        if (payload.actionType) {
          if (factory.isFunction(actions[payload.actionType])) {
            actions[payload.actionType].call(this, payload);
          }
        }
      }.bind(this));
    }
  },

  unregister: {

    // .unregister() :void
    0: function () {
      while (this.tokens.length) {
        this.dispatcher.unregister(this.tokens.pop());
      }
    }
  },

  onChange: {

    // .onChange(callback Function) :void
    f: function (callback) {
      var trace = new Error(this.constructor.name + ': change handler error');
      var handler = this.catchError(callback, trace);
      this.addListener('change', handler);
      return handler;
    }
  },

  emitChange: {

    // .emitChange() :void
    0: function () {
      this.emit('change');
    }
  },

  // .storeWillMount() :void
  storeWillMount: function () {

  },

  // .storeWillUnmount() :void
  storeWillUnmount: function () {

  },

  // .storeWillReceiveProps() :void
  storeWillReceiveProps: function () {

  },

  // .getDefaultProps() :Object
  getDefaultProps: function () {
    return {};
  },

  // .replaceProps(props) :void
  replaceProps: function (props) {
    this.props = props;
  },

  // .resetProps() :void
  resetProps: function () {
    this.replaceProps(this.getDefaultProps());
  },

  // .getInitialState() :Object
  getInitialState: function () {
    return {};
  },

  setState: {

    // .setState(state Object) :void
    o: function (state) {
      this.state = this.state.merge(state);
      this.emitChange();
    }
  },

  getState: {

    0: function () {
      return this.state.toObject();
    }
  },

  resetState: {

    // .resetState() :void
    0: function () {
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
    0: function () {
      return this.createMixin({});
    },

    // .createMixin(options Object) :Object
    o: function (options) {

      options = options || {};

      var store = this;
      var storeChangeHandler;

      return {

        getInitialState: function () {
          store.replaceProps(this.props);
          if (options.resetState !== false) {
            store.resetState();
          }
          return store.getState();
        },

        componentWillMount: function () {
          storeChangeHandler = store.onChange(function () {
            if (this.storeDidChange) {
              this.storeDidChange(store);
            }
          }.bind(this));
          store.emit('storeWillMount');
        },

        componentWillReceiveProps: function (newProps) {
          store.replaceProps(newProps);
          store.emit('storeWillReceiveProps');
        },

        componentWillUnmount: function () {
          store.removeListener('change', storeChangeHandler);
          store.emit('storeWillUnmount');
          if (options.resetProps !== false) {
            store.resetProps();
          }
        }
      };
    }
  }

});

function isStore (arg) {
  return arg instanceof Store;
}

function createStore (options) {
  options = options || {};
  options.inherits = Store;
  options.displayName = options.displayName || 'CustomStore';
  return factory.createClass(options.displayName, options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Store: Store,
  isStore: isStore,
  createStore: createStore
};

// - -------------------------------------------------------------------- - //
