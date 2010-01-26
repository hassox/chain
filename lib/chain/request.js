var http    = require('http');
var events  = require('events');
var sys     = require('sys');
var Url     = require('url');
var Stream  = require('./vendor/stream');

// parts of this based on the request object from http://github.com/kriszyp/jsgi-node

function Request(request, chain){
  events.EventEmitter.call(this);
  var
    url               = Url.parse( request.url ),
    headers           = request.headers,
    namePort          = headers.host.split( ":" ),
    lowerCaseHeaders  = {};

  this.chain          = chain;
  this.method         = request.method;
  this.scriptName     = "";
  this.pathInfo       = url.pathname;
  this.url            = request.url;
  this.queryString    = url.query || "";
  this.serverName     = namePort[ 0 ];
  this.serverPort     = namePort[ 1 ] || 80;
  this.scheme         = "http";
  this.headers        = request.headers;
  this.Connection     = request.Connection;
  var body = this.body = new Stream();

  body.pause();

  request.addListener("body", function(chunk){ body.write(chunk) })
  request.addListener("complete", function() { body.close() })

  body.addListener("newListener", function(type, listener){
    if(type == "data")
      body.resume();
  })

  body.addListener("pause",   function(){
    sys.puts("Pausing the request");
    request.pause()
  });
  body.addListener("resume",  function(){request.resume()});
  body.addListener("eof",     function(){body.emit("finish")});

  for(var i in headers){
    lowerCaseHeaders[i.toLowerCase()] = headers[i];
  }
  this.headers = lowerCaseHeaders;
  this.version = [ request.httpVersionMajor, request.httpVersionMinor ];

  request.isComplete  = false;
}

sys.inherits(Request, events.EventEmitter);

exports.Request = Request;

