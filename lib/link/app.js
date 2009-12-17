sys = require("sys");

function App(name, obj){
  if ( !(this instanceof arguments.callee) )
    return new App(obj);
	process.mixin(true, this, obj);
  var self = this;
  this.name = name;

  Link.addListener("start", function(event_type){
    switch(event_type){
    case "http" :
      self.addListener("request", function(env){
        self.onRequest.call(self, env);
      });
      break;
    case "globalCallbacks" :
      sys.puts(inspect(arguments[1]));
      for(var i=0; i < arguments[1].length; i++){
        arguments[1][i](self);
      };
      break;
    }
  });
}

function AppPrototype(){
  this.pass = function(env){
    if(this.newApp != undefined){
      nextApp.emit("request", env);
    } else {
      env.done();
    }
  }
}

process.inherits(AppPrototype, process.EventEmitter);

App.prototype = new AppPrototype();

exports.App = App;
