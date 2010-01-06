var sys = require('sys');
var chain = require('../lib/chain');

var app = chain.Builder.make([
  function(env){
    env.beforeHeaders(function(status, headers){
      sys.puts("In First :");
      sys.puts("STATUS:   " + status);
      sys.puts("HEADERS:  " + sys.inspect(headers));
      headers["X-MyHeader"] = "Some Header"
      return 500; // change the status code
    })

    env.send(this.nextApp);
  },

  function(env){
    env.beforeHeaders(function(status, headers){
      sys.puts("In Second : ");
      sys.puts("STATUS    : " + status);
      sys.puts("HEADERS   : " + sys.inspect(headers));
      headers["X-MySecondHeader"] = "Another Header";
    })
    env.send(this.nextApp);
  },

  function(env){
    env.body += "In the end";
    env.done();
  }
])

chain.run(app);

