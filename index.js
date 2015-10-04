/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var modules = [
  require("./lib/dispatchers.js"),
  require("./lib/actions.js"),
  require("./lib/stores.js"),
  require("./lib/flux.js")
];

var toExport = {};

modules.forEach(function(obj) {
  Object.keys(obj).forEach(function(key) {
    toExport[key] = obj[key];
  });
});

module.exports = toExport;

// - -------------------------------------------------------------------- - //
