sys = require("sys");

function wrap(app){
  if (typeof(app) == 'function') {
    return new Chain.Link('', {onRequest: app})
  } else {
    return app
  }
}

Builder =  {
  make : function(stack){
    if (typeof(stack) === 'function') {
      stack = [stack]
    }
    var firstApp = wrap(stack[0])
    var app = firstApp
    for(var i = 1; i < stack.length; i++){
      var nextApp = wrap(stack[i])
      app.nextApp = nextApp
      app = nextApp
    }
    return firstApp
  },
}

exports.Builder = Builder
