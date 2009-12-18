process.mixin(require("sys"));
process.mixin(require('./../lib/link'));


app = Link.Builder.chain([function(env) {
  env.onFinish(function() {
    puts('all done!')
  })

  env.body += "Hey Guys"
  env.done()
}])

Link.run(app);

