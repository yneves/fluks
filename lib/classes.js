/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var util = require("util");

// - -------------------------------------------------------------------- - //
// - module

function createClass(options) {
  
  var Class = function() {
    if (typeof options.constructor === "function") {
      options.constructor.apply(this,arguments);
    }
    if (typeof options.inherits === "function") {
      options.inherits.apply(this,arguments);
    }
  };
  
  if (typeof options.inherits === "function") {
    util.inherits(Class,options.inherits);
  }
  
  Object.keys(options).forEach(function(key) {
    if (key !== "inherits" && key !== "constructor") {
      Class.prototype[key] = options[key];
    }
  });
  
  return Class;
}

function createProperty(object,name,options) {
  
  if (typeof object === "function") {
    object = object.prototype;
  }
  
  var property = {
    get: function() {},
    set: function(value) {},
    enumerable: true,
    configurable: true
  };
  
  if (options instanceof Object) {
    Object.keys(options).forEach(function(key) {
      property[key] = options[key];
    });
  }
  
  if (typeof property.get === "string") {
    var get = property.get;
    property.get = function() {
      return this[get](name);
    };
  }
  
  if (typeof property.set === "string") {
    var set = property.set;
    property.set = function(value) {
      return this[set](name,value);
    };
  }
  
  Object.defineProperty(object,name,property);

}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  createClass: createClass,
  createProperty: createProperty
};

// - -------------------------------------------------------------------- - //
