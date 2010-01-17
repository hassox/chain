// curl http://127.0.0.1:8000

process.mixin(require("sys"));
var Chain = require('../lib/chain');

/*
will return
<h1>Hello jello world</h1><h2>and two bits!</h2>
*/

var builder = new Chain.Builder();
builder
  .use(Chain.Links.Logger)
  .use(function(env) {
    env.next(function() {
      env.body += '<h2>and two bits!</h2>';
      env.done();
    })
  })

  .use(function(env) {
    env.headers['content-type'] = 'text/html';
    env.body = "<h1>Hello jello world</h1>";
    env.done();
  })

Chain.run(builder.build());

