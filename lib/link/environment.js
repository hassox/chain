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
  _callback         : undefined,
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
    if (this._callback !== undefined) this._callback.emitSuccess()

  },
  finish            : function(fn){
    this.response.addListener('sent', fn)
  },
  callback          : function(fn){
    var previousCallback = this._callback
    var env = this
    this._callback = new process.Promise()
    this._callback.addCallback(function() {
      fn.call(env)
      if (previousCallback !== undefined) previousCallback.emitSuccess()
    })
  },
}

exports.Environment = Environment;
