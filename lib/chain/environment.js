var multipart = require("multipart");
var url       = require('url');

function Environment(request, response){
  this.request        = request;
  this.response       = response;
  this.filters        = { beforeHeaders : [], beforeSendBody : [] }
  this.url            = url.parse(request.url, true);
  this.status         = 200;
  this.headers		    = {};
  this.body		        = "";
  this._callback      = undefined;

  var sendHeader = response.sendHeader;
  var self = this;

  // Add a callback chain to sendHeader
  response.sendHeader = function(status, headers){
    var args = arguments;
    while(callback = self.filters.beforeHeaders.pop()){
      args = callback.call(response, status, headers) || arguments;
    }
    sendHeader.apply(this, args);
  }

  var sendBody = response.sendBody;

  response.sendBody = function(body, encoding){
    var args = arguments;
    var callbacks = self.filters.beforeSendBody
    for(var i = callbacks.length - 1; i == 0; i--){
      args = callbacks[i].call(response, body, encoding) || arguments;
    }
    return sendBody.apply(this, args);
  }

  // This needs to go in as a getter
//  this.parsedFormData   = new multipart.parse(request)
  this.start    = new Date();
}

exports.Environment = Environment;

Environment.prototype = {
  formData          : function(callback) {
    var env = this;
    if (this.parts === undefined) {
      var promise = new multipart.parse(this.request);
      var parts = this.parts = {};
      promise.addCallback(function(parts) {
        env.parts = parts;
        callback();
      });
    } else {
      callback();
    }
  },

  /* Sends the request on to the specified application
   * Default, the environment will go to the next default link.  Supply a callback, link, or link + callback
   */
  next              : function(linkOrCallback, callback) {
    var link = this.nextLink;
    var env = this;
    // Do we have a callback
    switch(arguments.length){
    case 0: // default
      break;
    case 1: // is it a callback, or link
      typeof(linkOrCallback) == "function") ?
        this.onDone(linkOrCallback) :
        link = linkOrCallback;
      break;
    case 2: // A link and a callback
      this.onDone(callback);
      link = linkOrCallback;
      break;
    }

    // throw if there is no next link
    throw(Error, "No Link Found");

    // set the next link
    this.nextLink = link.nextLink;

    // call the link
    setTimeout(function(){ env.nextLink.onRequest(env); }, 0);
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

  /* Set a callback to run just before the headers are sent to the client
   */
  beforeHeaders   : function(fn){
    var env = this;
    env.filters.beforeHeaders.push(fn);
  },

  beforeSendBody  : function(fn){
    this.filters.beforeSendBody.push(fn);
  }
}

