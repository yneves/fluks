/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - assets

"use strict";

var assert = require("assert");
var index = require("../index.js");

// - -------------------------------------------------------------------- - //
// - tests

describe("Action",function() {

  it("should dispatch action when method returns payload",function() {
    var flux = new index.Flux();
    var action = flux.createAction({
      test: function() {
        return {
          actionType: "TEST"
        };
      }
    });
    var actionType;
    action.dispatcher.register(function(payload) {
      actionType = payload.actionType;
    });
    action.test();
    assert.strictEqual(actionType,"TEST");
  });
  
  it("should dispatch action when method returns actionType",function() {
    var flux = new index.Flux();
    var action = flux.createAction({
      test: function() {
        return "TEST";
      }
    });
    var actionType;
    action.dispatcher.register(function(payload) {
      actionType = payload.actionType;
    });
    action.test();
    assert.strictEqual(actionType,"TEST");
  });
  
});

// - -------------------------------------------------------------------- - //
