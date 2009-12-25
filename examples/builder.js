var sys = require('sys');
var chain = require('../lib/chain');

function MyApp(opts){
  opts = opts || {};
  this.options = opts;
  var self = this;

  this.name = opts.name;

  chain.addListener("start", function(event_type){
    switch(event_type){
    case 'http' :
      self.addListener("request", function(env){
        self.handle.call(self, env);
      });
      break;
    }
  });

  this.handle = function(env){
    var self = this;
    sys.puts("Going in with " + self.name);
    env.send(this.nextApp, function(){
      sys.puts("Oh I'm in the callback stack! in " + self.name);
      sys.puts("My options are " + sys.inspect(self.options));
      env.done();
    });
  }
}

process.inherits(MyApp, process.EventEmitter);

function firstOne(env){
  sys.puts("In the first one on the way in");
  env.send(this.nextApp);
}

function lastOne(env){
  sys.puts("In the last one dude");
  env.body += "In the last one dude";
  env.done();
}

var builder = new chain.Builder();

builder
  .use(firstOne)
  .useConstructor(MyApp, {some    : "opt",  name : "Some Name!"})
  .useConstructor(MyApp, {another : "opts", name : "Another Name!"})
  .use(lastOne);

chain.run(builder.build());
