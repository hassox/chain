// curl http://127.0.0.1:8000

process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

/*
will return 
<h1>Hello jello world</h1><h2>and two bits!</h2>
*/

app = Link.Builder.make([
  Link.Links.Logger,
  function(env) {
    env.send(this.nextApp, function() {
      env.body += '<h2>and two bits!</h2>'
      env.done()
    })
  },
  function(env) {
    env.headers['content-type'] = 'text/html'
    env.body = "<h1>Hello jello world</h1>"
    env.done()
  }
])

Link.run(app);

