// curl http://127.0.0.1:8000

process.mixin(require("sys"));
process.mixin(require('./../lib/chain'));

/*
will return
<h1>Hello jello world</h1>
*/

app = Chain.Builder.make(
  function(env) {
    env.headers['content-type'] = 'text/html';
    env.body = "<h1>Hello jello world</h1>";
    env.done();
  }
);

Chain.run(app);

