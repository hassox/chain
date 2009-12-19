var sys = require("sys")

function Link(){
  var self = this;

  this.broadcast = function(){
    this.emit.apply(this, arguments)
  }

  this.run = function(masterApp, opts){
    Link = this;
    if(opts == undefined){ opts = {} }
    var defaults = {
      port : 8000
    }

    process.mixin(opts, defaults);
    self.broadcast("start", "http", opts)

	  http = require('http');

	  http.createServer(function(req, res){
      env = new self.Environment(req, res);

      env.onDone(Link.Links.responderCallback);

    	masterApp.onRequest.call(masterApp, env);
  	}).listen(opts.port);

  	sys.puts("Server running at http://127.0.0.1:" + opts.port.toString());
  }
  process.mixin(this, require('./app'));
  process.mixin(this, require('./builder'));
  process.mixin(this, require('./environment'));
  process.mixin(this, require('./links'));
}


process.inherits(Link, process.EventEmitter);

exports.Link = new Link();
