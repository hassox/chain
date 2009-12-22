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

try{
  app = Chain.Builder.make(
    function(env) {
      env.headers['content-type'] = 'text/html';
      env.body = "<h1>Hello jello world</h1>";
      env.done();
    }
  );
} catch(e) {
  sys.puts(e.stack)
}

Chain.run(app);

