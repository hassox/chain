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
  _callBacks        : [],
  _ensuredCallBacks : [],
  done              : function(){
    if(callBack = this._callBacks.pop())
      callBack.call(this);
  },
  complete          : function(){
    while(callBack = this._ensuredCallBacks.pop()){
      callBack.call(this);
    }
  },
  callBack       : function(fn){
    this._callBacks.push(fn);
  },
  ensuredCallBack : function(fn){
    this._ensuredCallBacks.push(fn);
  }
}

exports.Environment = Environment;
