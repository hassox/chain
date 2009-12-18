sys = require("sys");
Builder =  {
  chain : function(stack){
    var events = {};
    
    var firstApp = this.wrap(stack[0])
    var app = firstApp
    for(var i = 1; i < stack.length; i++){
      var nextApp = this.wrap(stack[i])
      app.nextApp = nextApp

      /* by getting all the events of the parent, all child
       * apps can be setup to re-emit unknown events back to the parent
       */
      app = nextApp
    }
    return firstApp
  },
  wrap : function(app) {
    puts(typeof(app))
    if (typeof(app) == 'function') {
      puts('wrapping')
      return new Link.App('', {onRequest: app})
    } else {
      return app
    }
  }
}

exports.Builder = Builder
