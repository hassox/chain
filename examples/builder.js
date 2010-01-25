var sys = require('sys');
var chain = require('../lib/chain');

function MyApp(opts){
  opts = opts || {};
  this.options = opts;
  var self = this;

  this.name = opts.name;

  this.onRequest = function(env){
    var self = this;
    sys.puts("Going in with " + self.name);
    env.next(function(){
      sys.puts("Oh I'm in the callback stack! in " + self.name);
      sys.puts("My options are " + sys.inspect(self.options));
      env.done();
    });
  }
}

function firstOne(env){
  sys.puts("In the first one on the way in");
  env.next();
}

function lastOne(env){
  sys.puts("In the last one dude");
  env.response.body += "In the last one dude";
  env.done();
}

var builder = new chain.Builder();

builder
  .use(firstOne)
  .use(MyApp, {some    : "opt",  name : "Some Name!"})
  .use(MyApp, {another : "opts", name : "Another Name!"})
  .use(lastOne);

chain.run(builder.build());
