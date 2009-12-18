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
  _doneCallbacks    : [],

  send              : function(nextApp, callback) {
    if (arguments.length > 1)
      this.onDone(callback);
    nextApp.emit("request", this)
  },

  done              : function() {
    var self = this;
    if (this._doneCallbacks.length != 0)
      setTimeout(self._doneCallbacks.pop()(self),0);
  },

  onFinish            : function(fn){
    this.response.addListener('sent', fn)
  },

  onDone       : function(fn){
    this._doneCallbacks.push(fn);
  },
}

exports.Environment = Environment;
