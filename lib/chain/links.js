Links = {
  Logger: function(env) {
    var startTime = new Date().valueOf()
    puts('--> [' + env.request.method + '] '+env.request.uri.full)
    env.send(this.nextApp, function() {
      puts('<-- completed in '+(new Date().valueOf() - startTime)+'ms')
      env.done()
    })
  }
}

exports.Links = Links;
