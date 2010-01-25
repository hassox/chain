var http    = require('http');
var events  = require('events');
var sys     = require('sys');
var Url     = require('url');

// parts of this based on the request object from http://github.com/kriszyp/jsgi-node

function Request(request){
  events.EventEmitter.call(this);
  var
    url               = Url.parse( request.url ),
    headers           = request.headers,
    namePort          = headers.host.split( ":" ),
    lowerCaseHeaders  = {},
    self              = this,
    listeners         = {},
    inputBuffers      = {},
    completeEvents    = {},
    emittedEvents     = {}

    bodyListener      = false,
    inputBuffer       = [],
    bodyComplete      = false,
    completeEmitted   = false;

  this.method         = request.method;
  this.scriptName     = "";
  this.pathInfo       = url.pathname;
  this.url            = request.url;
  this.queryString    = url.query || "";
  this.serverName     = namePort[ 0 ];
  this.serverPort     = namePort[ 1 ] || 80;
  this.scheme         = "http";

  for(var i in headers){
    lowerCaseHeaders[i.toLowerCase()] = headers[i];
  }
  this.headers = lowerCaseHeaders;
  this.version = [ request.httpVersionMajor, request.httpVersionMinor ];

  request.isComplete  = false;

  this.addListener = function(event){
    if(event == "body"){
      if( self.bodyEmitStarted )
        throw(new Error("Request Body Emitting Already Started"));

      bodyListener = true;
    }
    Request.prototype.addListener.apply(this, arguments);

    // Have to give the complete listener a chance to be added
    process.nextTick(shiftAndEmit)
  }

  // From here we deal with buffering the request as it comes in
  function shiftAndEmit(){
    if(!bodyListener) return;

    if(inputBuffer.length > 0){
      var chunk = inputBuffer.shift();
      self.bodyEmitStarted = true;
      self.emit("body", chunk);
    }

    if(bodyComplete && !completeEmitted && inputBuffer.length == 0){
      self.emit("complete");
      completeEmitted = true;
    } else if(inputBuffer.length > 0) {
      process.nextTick(shiftAndEmit);
    }
  }

  request
    .addListener( "body", function( data ) {
      inputBuffer.push( data );
      shiftAndEmit();
    })
    .addListener("complete", function() {
      bodyComplete = true;
      shiftAndEmit();
    });
}

sys.inherits(Request, events.EventEmitter);

exports.Request = Request;

