var sys = require("sys");
var link = require('./link')

function wrap(app){
  if (typeof(app) == 'function') {
    return new link.Link('', {onRequest: app});
  } else {
    return app;
  }
}

exports.make = function(stack){
  if (typeof(stack) === 'function') {
    stack = [stack];
  }
  var firstApp = wrap(stack[0]);
  var app = firstApp;
  for(var i = 1; i < stack.length; i++){
    var nextApp = wrap(stack[i]);
    app.nextApp = nextApp;
    app = nextApp;
  }
  return firstApp;
}
