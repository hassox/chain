var multipart = require("multipart")

function Environment(request, response){
  if ( !(this instanceof arguments.callee) )
    return new Environment(obj);
  this.request  = request;
  this.response = response;
  // should not go here...
//  this.parsedFormData   = new multipart.parse(request)
  this.start    = new Date();
}

exports.Environment = Environment;

Environment.prototype = {
  status 		        : 200,
  headers		        : {},
  body		          : "",
  _callback         : undefined,

  formData          : function(callback) {
    var env = this;
    if (this.parts === undefined) {
      var promise = new multipart.parse(this.request);
      var parts = this.parts = {};
      promise.addCallback(function(parts) {
        env.parts = parts;
        callback.call();
      });
    } else {
      callback.call();
    }
  },

  /* Sends the request on to the specified application
   * Optionally you may include a callback as a second argument that will be added to the onDone callback queue
   */
  send              : function(nextApp, callback) {
    if (callback !== undefined) this.onDone(callback);
    nextApp.emit("request", this);
  },

  /* Call to initiate the request callback chain
   * done callbacks are only run if the last component / callback
   * calls done() on the environment.
   * When a component adds a callback, it's with this thinking
   *   "If the request comes back to me, here's a callback to apply to it"
   * A callback should not come back if the response has already been sent to the client
   */
  done              : function() {
    if (this._callback !== undefined){
      this._callback.emitSuccess();
    }
  },

  /* Add a callback that will run when the env.response.finish() method is called.
   * These callbacks are assured to run once that function has been called.
   */
  onFinish            : function(fn){
    this.response.addListener('sent', fn);
  },

  /* Adds a callback to the onDone queue manually.
   */
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

