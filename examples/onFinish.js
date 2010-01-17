// curl http://127.0.0.1:8000

process.mixin(require("sys"));
var Chain = require('../lib/chain');

/*
will return
<h1>Hello jello world</h1>
*/
var builder = new Chain.Builder();
builder
  .use(function(env) {
    env.onFinish(function() {
      puts('this is after the request');        // this will be printed out
      env.body += 'you will never ever see me'; // this line has no effect.
    })

    env.headers['content-type'] = 'text/html';
    env.body = "<h1>Hello jello world</h1>";
    env.done();
  })

Chain.run(builder.build());

