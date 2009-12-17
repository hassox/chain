Links = {
  Responder: function(env) {
    env.call(this.nextApp, function() {
      env.response.sendHeader(env.status, env.headers);
      env.response.sendBody(env.body);
      env.response.finish();
    })
  }  
}

exports.Links = Links;