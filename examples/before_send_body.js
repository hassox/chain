var sys = require('sys');
var chain = require('../lib/chain');

var app = chain.Builder.make([
  function(env){
    env.beforeSendBody(function(chunk, encoding){
      return [chunk + " - appended from beforeSendBody\n", encoding];
    })
    env.send(this.nextApp);
  },

  function(env){
    env.response.sendHeader(200, {"Content-Type" : "text/plain"});
    for(var i = 0; i < 10; i++){
      env.response.sendBody("Iteration - " + i);
    }
    env.response.finish();
  }
])

chain.run(app);
