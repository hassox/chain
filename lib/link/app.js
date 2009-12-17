sys = require("sys");
function Standard(name, obj){
  if ( !(this instanceof arguments.callee) )
    return new Standard(obj);
	process.mixin(true, this, obj);
  self = this;
  this.name = name;

  this.addListener("request", function(env){ self.on.request.call(self, env)});
}

function AppProto(){
	this.done	  = function(env){ this.emit("response", env);}
	this.pass	  =	function(env){ this.nextApp.emit("request",  env);}
	this.cancel	=	function(env){ this.emit("cancel",   env);}
  this.error  = function(env){ this.emit("error",    env);}
  this.on     = {
    request : function(env){ this.pass() }
  }
}

process.inherits(AppProto, process.EventEmitter);
Standard.prototype = new AppProto();

function LoopBack(name){
  if ( !(this instanceof arguments.callee) )
    return new LoopBack(obj);

  this.name = name;
  this.on = {
    request : function(env){
      this.emit("response", env)
    }
  }
  var self = this;
  self.addListener("request", function(env){
    self.on.request.call(self, env)
  });
};

LoopBack.prototype = new process.EventEmitter();

exports.Standard = Standard;
exports.LoopBack = LoopBack;
