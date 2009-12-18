process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

app = Link.Builder.chain([
  Link.Links.Responder,
  function(env) {

    env.finish(function() {
      puts('all done!')
    })

    env.call(function() {
      env.body += 'hey guys'
      env.done()
    })

  }
])

Link.run(app);

