var sys     = require('sys');
var http    = require('http');
var events  = require('events');

function Response(response, chain){
  events.EventEmitter.call(this);
  this.filters  = {beforeHeaders : [], beforeSendBody : []};
  this.chain    = chain;
  this.status   = 200;
  this.headers  = {};
  this.body     = [];

  var
    self        = this;

  this.finish = function(){
    response.finish();
    self.emit("finish");
  }

  /* Set a callback to run just before the headers are sent to the client
   */
  this.beforeHeaders = function(fn){
    self.filters.beforeHeaders.push(fn);
  },

  this.beforeSendBody = function(fn){
    self.filters.beforeSendBody.push(fn);
  }

  this.sendHeader = function(status, headers){
    var args = arguments;
    while(callback = this.filters.beforeHeaders.pop()){
      args = callback.call(this,status, headers) || arguments;
    }
    return response.sendHeader.apply(response,args);
  }

  this.sendBody = function(body, encoding){
    var args = arguments;
    var callbacks = this.filters.beforeSendBody;
    for(var i = callbacks.length - 1; i == 0; i--){
      args = callbacks[i].call(this, body, encoding) || arguments;
    }
    return response.sendBody.apply(response, args);
  }
}

process.inherits(Response, events.EventEmitter);

exports.Response = Response;
