/*!
**  fluks -- Another flux implementation library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/fluks>
*/
// - -------------------------------------------------------------------- - //

var modules = [
  require("./lib/classes.js"),
  // require("./lib/models.js"),
  // require("./lib/collections.js"),
  require("./lib/dispatchers.js"),
  require("./lib/actions.js"),
  require("./lib/stores.js"),
  require("./lib/flux.js"),
];

modules.forEach(function(obj) {
  Object.keys(obj).forEach(function(key) {
    module.exports[key] = obj[key];
  });
});

// - -------------------------------------------------------------------- - //
