process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

app = Link.Builder.wrap(function(env) {
  env.onFinish(function() {
    env.status = 201
  })

  env.body += "Hey Guys"
  env.done()
})

Link.run(app);

