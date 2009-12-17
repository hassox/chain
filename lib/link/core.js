var sys = require("sys");

function Link(){
  this.run = function(masterApp, opts){
    if(opts == undefined){ opts = {} }
    var defaults = {
      port : 8000
    }

    process.mixin(opts, defaults);

    this.emit("start", "http", opts);

	  http = require('http');
	  http.createServer(function(req, res){
	  	env = {
		  	status 		        : 200,
		  	headers		        : {},
		  	body		          : "",
		  	request   	      : req,
		  	response 	        : res,
        _callBacks        : [],
        _ensuredCallBacks : [],
        done              : function(){ // make asyn
          if(callBack = this._callBacks.pop())
            callBack.call(this);
        },
        complete          : function(){ // make async
          while(callBack = this._ensuredCallBacks.pop()){
            callBack.call(this);
          }
        },
        callBack       : function(fn){
          this._callBacks.push(fn);
        },
        ensuredCallBack : function(fn){
          this._ensuredCallBacks.push(fn);
        }
	  	}
    	masterApp.on.request.call(masterApp, env);
  	}).listen(opts.port);
  	sys.puts("Server running at http://127.0.0.1:" + opts.port.toString());
  }

  this.App = require("./app")
  this.Builder = require("./builder")
}

process.inherits(Link, process.EventEmitter);

exports.Link = new Link();
