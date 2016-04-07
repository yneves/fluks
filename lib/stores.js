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
var createMixin = require('./mixin.js');

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

  onReset: {

    // .onReset(callback Function) :void
    f: function (callback) {
      var trace = new Error(this.constructor.name + ': reset handler error');
      var handler = this.catchError(callback, trace);
      this.addListener('reset', handler);
      return handler;
    }
  },

  emitReset: {

    // .emitReset() :void
    0: function () {
      this.emit('reset');
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

    // .setState() :void
    0: function () {
      this.emitChange();
    },

    // .setState(state Object) :void
    1: function (state) {
      this.state = this.state.merge(state);
      this.emitChange();
    },

    // .setState(path Array, value Object) :void
    _: function () {
      var path = Immutable.List();
      for (var i = 0; i < arguments.length - 1; i++) {
        path = path.concat(arguments[i]);
      }
      var value = arguments[arguments.length - 1];
      this.state = this.state.setIn(path, value);
      this.emitChange();
    }
  },

  getState: {

    // .getState() :Object
    0: function () {
      return this.state.toObject();
    },

    // .getState(path Array) :void
    _: function () {
      var path = Immutable.List();
      for (var i = 0; i < arguments.length; i++) {
        path = path.concat(arguments[i]);
      }
      return this.state.getIn(path);
    }
  },

  mergeState: {

    // .mergeState() :void
    0: function () {
      this.emitChange();
    },

    // .mergeState(state Object) :void
    1: function (state) {
      this.state = this.state.merge(Immutable.fromJS(state));
      this.emitChange();
    },

    // .mergeState(path Array, value Object) :void
    _: function () {
      var path = Immutable.List();
      for (var i = 0; i < arguments.length - 1; i++) {
        path = path.concat(arguments[i]);
      }
      var value = arguments[arguments.length - 1];
      this.state = this.state.mergeIn(path, Immutable.fromJS(value));
      this.emitChange();
    }
  },

  resetState: {

    // .resetState() :void
    0: function () {
      var state = Immutable.fromJS(this.getInitialState());
      if (this.state) {
        this.state = this.state.clear();
        this.state = this.state.merge(state);
      } else {
        this.state = state;
      }
      this.emitReset();
    }
  },

  attachStore: {

    // .attachStore(store Store) :void
    1: function (store) {
      this.attachStore(null, store);
    },

    // .attachStore(property String, store Store) :void
    2: function (property, store) {

      if (!isStore(store)) {
        throw new Error('Store expected');
      }

      var _this = this;

      store.onChange(function () {
        if (property) {
          _this.setState(property, store.state);
        } else {
          _this.setState(store.state);
        }
      });

      this.onReset(function () {
        store.resetState();
      });

      this.on('storeWillMount', function () {
        store.replaceProps(_this.props);
        store.emit('storeWillMount');
      });

      this.on('storeWillUnmount', function () {
        store.emit('storeWillUnmount');
        store.replaceProps(_this.props);
      });

      this.on('storeWillReceiveProps', function () {
        store.replaceProps(_this.props);
        store.emit('storeWillReceiveProps');
      });
    }
  },

  createMixin: {

    // .createMixin() :Object
    0: function () {
      return createMixin(this, {});
    },

    // .createMixin(options Object) :Object
    o: function (options) {
      return createMixin(this, options);
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
