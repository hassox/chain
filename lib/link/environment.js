sys = require('sys');

function Environment(request, response){
  if ( !(this instanceof arguments.callee) )
    return new Environment(obj);
  this.request = request;
  this.response = response;
  this.start    = new Date();
}

Environment.prototype = {
  status 		        : 200,
  headers		        : {},
  body		          : "",
  _callbacks        : [],
  _ensuredCallbacks : [],
  done              : function(){
    if(callback = this._callbacks.pop())
      callback.call(this);
  },
  complete          : function(){
    while(callback = this._ensuredCallbacks.pop()){
      callback.call(this);
    }
  },
  callback       : function(fn){
    this._callbacks.push(fn);
  },
  ensuredCallback : function(fn){
    this._ensuredCallbacks.push(fn);
  }
}

exports.Environment = Environment;
