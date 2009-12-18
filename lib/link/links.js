Links = {
  responderCallback: function(env) {
    env.response.sendHeader(env.status, env.headers);
    env.response.sendBody(env.body);
    env.response.finish();
  }
}

exports.Links = Links;
