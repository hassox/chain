// curl http://127.0.0.1:8000
var sys = require('sys');
try {
  var Chain = require('../lib/chain')
} catch(e) {
  sys.puts(e.stack);
}

/*
will return
<h1>Hello jello world</h1>
*/

builder = new Chain.Builder()
var counter = 0;
builder
  .use(function(env) {
      //var requestNumber = 0 + ++counter;
      var buffer = [];

      //sys.puts("Request: " + requestNumber);

      env.request.body.addListener("data", function(data){
        buffer.push(data);
      })

      env.request.body.addListener("finish", function(){
       // sys.puts("Complete: " + requestNumber);
        env.response.headers['content-type'] = 'text/html';
        env.response.body = "<h1>Hello jello world</h1>" + buffer.join("");
        env.done();
      })

    });

Chain.run(builder.build());

