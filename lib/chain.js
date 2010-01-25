var sys    = require("sys")
var events = require("events")

exports.Environment = require('./chain/environment').Environment
exports.Utils       = require('./chain/utils')
exports.Links       = require('./chain/links')
exports.Builder     = require('./chain/builder').Builder

exports.meta = {
  version : [0,0,1],
  name    : "Chain",
  engine  : "node"
}

exports.Environment.meta = exports.meta

  /* The broadcast function is setup as a place where
   * pices of the applciation can setup global listeners so that there can be global components.
   */
exports.broadcast = function(){
  this.emit.apply(this, arguments);
}

/* Starts a http server with the given component as the entry point to the application
 *
 * An optional second parameter, an object, may be given to set the options for the server.
 * Supported properties:
 *   port  : <Deafult
 */
exports.run = function(firstLink, opts){
  var self = this;
  if(opts == undefined){ opts = {} }
  var defaults = {
    port : 8000
  }

  process.mixin(opts, defaults);
  self.broadcast("start", "http", opts);
  http = require('http');
  http.createServer(function(req, res){
    env = new self.Environment(req, res, this);
    env.onDone(self.Utils.responderCallback);
    env.next(firstLink);
  }).listen(opts.port);

  sys.puts("Server running at http://127.0.0.1:" + opts.port.toString());
}

process.mixin(exports, new events.EventEmitter());


// setup an event listener to perform the link transitions.
// Using an event is more performant than a setTimeout
exports.addListener("linkTransition", function(link, env){
  link.onRequest(env);
})

