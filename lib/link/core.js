var sys = require("sys");

function Link(){
  var globalCallBacks = [];
  var self = this;

  this.addGlobalCallBack = function(fn){
    globalCallBacks.push(fn);
  }

  this.globalCallBacks = function(fn){ return globalCallBacks; }

  this.run = function(masterApp, opts){
    if(opts == undefined){ opts = {} }
    var defaults = {
      port : 8000
    }

    process.mixin(opts, defaults);

    self.emit("start", "http", opts);
    self.emit("start", "globalCallBacks", self.globalCallBacks());

	  http = require('http');
	  http.createServer(function(req, res){
      env = new self.Environment(req, res);
    	masterApp.on.request.call(masterApp, env);
  	}).listen(opts.port);
  	sys.puts("Server running at http://127.0.0.1:" + opts.port.toString());
  }
  process.mixin(this, require('./app'));
  process.mixin(this, require('./builder'));
  process.mixin(this, require('./environment'));
}


process.inherits(Link, process.EventEmitter);

exports.Link = new Link();
