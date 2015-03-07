/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //
// - libs

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

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  createClass: createClass,
};

// - -------------------------------------------------------------------- - //
