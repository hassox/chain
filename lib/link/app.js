sys = require("sys");
function Standard(name, obj){
  if ( !(this instanceof arguments.callee) )
    return new Standard(obj);
	process.mixin(true, this, obj);
  var self = this;
  this.name = name;

  Link.addListener("start", function(event_type){
    self.addListener("request", function(env){
      self.on.request.call(self, env);
      });
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

Standard.prototype = new AppPrototype();

exports.Standard = Standard;
