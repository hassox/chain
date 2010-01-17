exports.Logger = function(env) {
  var startTime = new Date().valueOf();
  puts('--> [' + env.request.method + '] '+env.request.url);
  env.next(function() {
    puts('<-- completed in '+(new Date().valueOf() - startTime)+'ms');
    env.done();
  })
}
