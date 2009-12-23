var sys     = require('sys');
var Chain   = require('../lib/chain');
var http    = require('http');
var restler = require('./vendor/restler/lib/restler')

function Twitter(options){
  this.options = options;

  if (!options.username || !options.password || !options.filterParams)
    throw new Error("username, password and filterParams must be specified");

  var urlString = "http://" +
                  options.username +
                  ":" +
                  options.password +
                  "@stream.twitter.com/1/statuses/sample.json"

  var stream = restler.get(urlString)
  var twitterEmitter = this;

  stream._responseHandler = function(response){
    response.addListener("body", function(status){
      twitterEmitter.emit("newStatus", status)
    })
  }
}

process.inherits(Twitter, process.EventEmitter);

var twitter = new Twitter(
    {
      username      : "",   // YOUR USERNAME
      password      : "",   // YOUR PASSWORD
      filterParams  : { track : "foo" }
    }
  );

var app = new Chain.Link("Twitter Consumer", {
  onRequest : function(env){
    env.response.sendHeader(200, {"Content-Type" : "text/json"});

    var twitterListener = function(status){
      sys.puts(status);
      env.response.sendBody(status);
    }

    twitter.addListener("newStatus", twitterListener)

    env.request.connection.addListener("eof", function(){
      sys.puts("Connection Closed");
      twitter.removeListener("newStatus", twitterListener);
      env.response.finish();
    });
  }
})

Chain.run(app);
