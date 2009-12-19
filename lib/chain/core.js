var sys = require("sys")

function Chain(){
  var self = this;

  /* The broadcast function is setup as a place where
   * pices of the applciation can setup global listeners so that there can be global components.
   */
  this.broadcast = function(){
    this.emit.apply(this, arguments)
  }

  /* Starts a http server with the given component as the entry point to the application
   *
   * An optional second parameter, an object, may be given to set the options for the server.
   * Supported properties:
   *   port  : <Deafult
   */
  this.run = function(masterApp, opts){
    Chain = this;
    if(opts == undefined){ opts = {} }
    var defaults = {
      port : 8000
    }

    process.mixin(opts, defaults);
    self.broadcast("start", "http", opts)

	  http = require('http');

	  http.createServer(function(req, res){
      env = new self.Environment(req, res);

      env.onDone(Chain.Utils.responderCallback);

    	masterApp.onRequest.call(masterApp, env);
  	}).listen(opts.port);

  	sys.puts("Server running at http://127.0.0.1:" + opts.port.toString());
  }
  process.mixin(this, require('./app'));
  process.mixin(this, require('./builder'));
  process.mixin(this, require('./environment'));
  process.mixin(this, require('./links'));
  process.mixin(this, require('./utils'));
}


process.inherits(Chain, process.EventEmitter);

exports.Chain = new Chain();
