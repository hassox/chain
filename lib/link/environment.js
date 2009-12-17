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
  call              : function(nextApp, callback) {
    switch (arguments.length) {
      case 2:
        this.callback(arguments[1])
        arguments[0].emit("request", this)
        break
      case 1:
        if ('onRequest' in arguments[0]) {
          arguments[0].emit("request", this)
        } else {
          this.callback(arguments[0])
          this.done()
        }
        break
    }
  },
  done              : function() {
    if (this._callbacks.length != 0) this._callbacks.pop().call(this);
  },
  finish            : function(fn){
    this.response.addListener('sent', fn)
  },
  callback       : function(fn){
    this._callbacks.push(fn);
  },
}

exports.Environment = Environment;
