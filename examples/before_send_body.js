var sys = require('sys');
var chain = require('../lib/chain');

var builder = new chain.Builder();
builder
  .use(function(env){
    env.beforeSendBody(function(chunk, encoding){
      return [chunk + " - appended from beforeSendBody\n", encoding];
    })
    env.next();
  })

  .use(function(env){
    env.response.sendHeader(200, {"Content-Type" : "text/plain"});
    for(var i = 0; i < 10; i++){
      env.response.sendBody("Iteration - " + i);
    }
    env.response.finish();
  })

chain.run(builder.build());
