// curl -F "test=test" http://127.0.0.1:8000

process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

app = Link.Builder.wrap(function(env) {
  env.formData(function() {
    /* returns 
    {
      "test": "test"
    }
    */
    env.body = inspect(env.parts)
    env.done()
  })
  
  
})

Link.run(app);

