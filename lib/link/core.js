var sys = require("sys");

exports.run = function(masterApp, opts){
  if(opts == undefined) opts = {}

  var defaults = {
    port : 8000
  }

  process.mixin(opts, defaults);

	http = require('http');
	http.createServer(function(req, res){
//		puts("RECEIVED A REQUEST");
//		puts("PASSING TO " + master.name);
		env = {
			status 		: 200,
			headers		: {},
			body		: "",
			request 	: req,
			response 	: res,
		}
		masterApp.on.request.call(masterApp, env);
	}).listen(opts.port);
	sys.puts("Server running at http://127.0.0.1:" + opts.port.toString());
}

exports.App = require("./app");
exports.Builder = require("./builder");
