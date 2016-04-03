/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

'use strict';

module.exports = function (store, options) {

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
};

// - -------------------------------------------------------------------- - //
