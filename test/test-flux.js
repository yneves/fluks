/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - assets

var assert = require("assert");
var index = require("../index.js");

// - -------------------------------------------------------------------- - //
// - tests

describe("flux",function() {

  it("constructor",function() {
    var flux = new index.Flux();
    assert.ok(flux.dispatcher instanceof index.Dispatcher);
  });

  it("constructor with dispatcher",function() {
    var dispatcher = new index.Dispatcher();
    var flux = new index.Flux(dispatcher);
    assert.strictEqual(flux.dispatcher,dispatcher);
  });

  it("createStore",function() {
    var flux = new index.Flux();
    var store = flux.createStore();
    assert.ok(store instanceof index.Store);
    assert.strictEqual(store.dispatcher,flux.dispatcher);
  });

  it("createAction",function() {
    var flux = new index.Flux();
    var action = flux.createAction();
    assert.ok(action instanceof index.Action);
    assert.strictEqual(action.dispatcher,flux.dispatcher);
  });

});

// - -------------------------------------------------------------------- - //
