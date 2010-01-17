// curl -F "test=test" http://127.0.0.1:8000

process.mixin(require("sys"));
var Chain = require('../lib/chain');

var builder = new Chain.Builder();
builder
  .use(function(env) {
    env.formData(function() {
      /* returns
      {
        "test": "test"
      }
      */
      env.body = inspect(env.parts);
      env.done();
    })
  })

Chain.run(builder.build());

