/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - assets

'use strict';

var assert = require('assert');
var index = require('../index.js');

// - -------------------------------------------------------------------- - //
// - tests

describe('Store', function () {

  it('should emit change when setState is called', function () {
    var flux = new index.Flux();
    var store = flux.createStore();
    var called = false;
    store.on('change', function () {
      called = true;
    });
    store.setState({
      one: 1,
      two: 2
    });
    assert.ok(called);
  });

  it('should call global handler when action is dispatched', function () {
    var flux = new index.Flux();
    var store = flux.createStore();
    var actionType;
    store.register(function (payload) {
      actionType = payload.actionType;
    });
    flux.dispatcher.dispatch({actionType: 'TEST'});
    assert.strictEqual(actionType, 'TEST');
  });

  it('should call action handler when action is dispatched', function () {
    var flux = new index.Flux();
    var store = flux.createStore();
    var actionType;
    store.register({
      TEST: function () {
        actionType = 'TEST';
      }
    });
    flux.dispatcher.dispatch({actionType: 'TEST'});
    assert.strictEqual(actionType, 'TEST');
  });

  it('should NOT call action handler when another action is dispatched', function () {
    var flux = new index.Flux();
    var store = flux.createStore();
    var actionType;
    store.register({
      TEST: function () {
        actionType = 'TEST';
      }
    });
    flux.dispatcher.dispatch({actionType: 'ANOTHER'});
    assert.strictEqual(actionType, undefined);
  });

  it('should catch change handler errors', function () {
    var flux = new index.Flux();
    var store = flux.createStore({
      displayName: 'MyStore'
    });
    store.onChange(function () {
      this.undefined();
    });
    var errorHandled = false;
    store.on('error', function (error, trace) {
      assert.ok(error instanceof Error);
      assert.ok(trace instanceof Error);
      assert.strictEqual(trace.message, 'MyStore: change handler error');
      errorHandled = true;
    });
    store.emitChange();
    assert.ok(errorHandled);
  });

  it('should catch dispatcher handler errors', function () {
    var flux = new index.Flux();
    var store = flux.createStore({
      displayName: 'MyStore'
    });
    store.register({
      TEST: function () {
        this.undefined();
      }
    });
    var errorHandled = false;
    store.on('error', function (error, trace) {
      assert.ok(error instanceof Error);
      assert.ok(trace instanceof Error);
      assert.strictEqual(trace.message, 'MyStore: dispatcher handler error');
      errorHandled = true;
    });
    flux.dispatcher.dispatch({actionType: 'TEST'});
    assert.ok(errorHandled);
  });

});

// - -------------------------------------------------------------------- - //
