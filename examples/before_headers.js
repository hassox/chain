var sys = require('sys');
var chain = require('../lib/chain');

var builder = new chain.Builder();
builder
  .use(function(env){
    env.response.beforeHeaders(function(status, headers){
      sys.puts("In First :");
      sys.puts("STATUS:   " + status);
      sys.puts("HEADERS:  " + sys.inspect(headers));
      headers["X-MyHeader"] = "Some Header"
      return [500, headers]; // change the status code
    })
    env.next();
  })

  .use(function(env){
    env.response.beforeHeaders(function(status, headers){
      sys.puts("In Second : ");
      sys.puts("STATUS    : " + status);
      sys.puts("HEADERS   : " + sys.inspect(headers));
      headers["X-MySecondHeader"] = "Another Header";
    })
    env.next();
  })

  .use(function(env){
    env.response.body += "In the end";
    env.done();
  })


chain.run(builder.build());

