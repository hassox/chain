var sys   = require("sys");
var chain = require('../chain')

var globalProxyEmitter = new process.EventEmitter();

function Link(name, obj){
  if ( !(this instanceof arguments.callee) )
    return new Link(name, obj);

	process.mixin(true, this, obj);
  var self = this;
  this.name = name;

  chain.addListener("start", function(event_type){
    switch (event_type) {
    case "http" :
      self.addListener("request", function(env){
        self.onRequest.call(self, env);
      });
      break;
    }
  });
}

function LinkPrototype(){
  this.emit = function(){
    globalProxyEmitter.emit.apply(globalProxyEmitter, arguments);
    return process.EventEmitter.prototype.emit.apply(this, arguments);
  }
}

Link.addInstanceListener = function(event, fn){
  return globalProxyEmitter.addListener(event, fn);
}

Link.removeInstanceListener = function(listener){
  return globalProxyEmitter.removeListener(listener);
}

process.inherits(LinkPrototype, process.EventEmitter);

Link.prototype = new LinkPrototype();

exports.Link = Link;
