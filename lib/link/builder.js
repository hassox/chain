sys = require("sys");
Builder =  {
  chain : function(stack){
    var firstApp = this.wrap(stack[0])
    var app = firstApp
    for(var i = 1; i < stack.length; i++){
      var nextApp = this.wrap(stack[i])
      app.nextApp = nextApp
      app = nextApp
    }
    return firstApp
  },

  wrap : function(app) {
    if (typeof(app) == 'function') {
      return new Link.App('', {onRequest: app})
    } else {
      return app
    }
  }
}

exports.Builder = Builder
