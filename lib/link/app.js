sys = require("sys");

var globalProxyEmitter = new process.EventEmitter();

function App(name, obj){
  if ( !(this instanceof arguments.callee) )
    return new App(obj);

	process.mixin(true, this, obj);
  var self = this;
  this.name = name;

  Link.addListener("start", function(event_type){
    switch (event_type) {
    case "http" :
      self.addListener("request", function(env){
        self.onRequest.call(self, env);
      });
      break;
    }
  });
}

function AppPrototype(){
  this.call = function(callback){
    if (callback !== undefined) {
      env.callback(callback)
    }

    if (this.nextApp !== undefined){
      nextApp.emit("request", env)
    } else {
      this.done()
    }
  }

  this.emit = function(){
    globalProxyEmitter.emit.apply(globalProxyEmitter, arguments);
    return process.EventEmitter.prototype.emit.apply(this, arguments);
  }
}

App.addInstanceListener = function(event, fn){
  return globalProxyEmitter.addListener(event, fn)
}

App.removeInstanceListener = function(listener){
  return globalProxyEmitter.removeListener(listener)
}


process.inherits(AppPrototype, process.EventEmitter);

App.prototype = new AppPrototype();

exports.App = App;
