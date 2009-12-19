process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

app = Link.Builder.wrap(function(env) {
  puts("in app.")
  env.formData(function() {
    puts(inspect(env.parts))
    env.body += "Hey Guys"
    env.done()
  })
  
  
})

Link.run(app);

