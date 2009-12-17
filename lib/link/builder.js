sys = require("sys");
Builder =  {
  chain : function(master, stack){
    var events = {};

    var app = master;

    for(var i = 0; i < stack.length; i++){
      var nextApp = stack[i];
      app.nextApp = nextApp;

      /* by getting all the events of the parent, all child
       * apps can be setup to re-emit unknown events back to the parent
       */
      app = nextApp;
    }
    return master;
  }
}

exports.Builder = Builder;
