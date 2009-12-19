Links = {
  /* Provides a default callback to flush the request to the client if nothing else has done so
   */
  responderCallback: function(env) {
    env.response.sendHeader(env.status, env.headers);
    env.response.sendBody(env.body);
    env.response.finish();
  }
}

exports.Links = Links;
