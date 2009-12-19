var multipart = require("multipart")

function Environment(request, response){
  if ( !(this instanceof arguments.callee) )
    return new Environment(obj);
  this.request  = request;
  this.response = response;
  this.parsedFormData   = new multipart.parse(request)
  this.start    = new Date();
}

Environment.prototype = {
  status 		        : 200,
  headers		        : {},
  body		          : "",
  _callback         : undefined,
  _doneCallbacks    : [],
  
  formData          : function(callback) {
    var env = this
    if (this.parts === undefined) {
      var promise = new multipart.parse(this.request)
      var parts = this.parts = {}
      promise.addCallback(function(parts) {
        env.parts = parts
        callback.call()
      });
    } else {
      callback.call()
    }
  },
  
  send              : function(nextApp, callback) {
    if (callback !== undefined) this.onDone(callback);
    nextApp.emit("request", this)
  },

  done              : function() {
    if (this._callback !== undefined){
      this._callback.emitSuccess();
    }
  },

  onFinish            : function(fn){
    this.response.addListener('sent', fn);
  },

  onDone       : function(fn){
    var env = this;
    var previousCallback = env._callback;
    env._callback = new process.Promise();
    env._callback.addCallback(function(){
      env._callback = previousCallback; // setup the callback for the following function to call done()
      fn(env);
    });
  },
}

exports.Environment = Environment;
