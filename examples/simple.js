process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

app = Link.Builder.wrap(function(env) {
  env.body += "Hey Guys"
  env.done()
})

Link.run(app);

