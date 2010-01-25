var sys = require('sys')
var keepAliveRegex = /keep\-alive/i

function closeConnectionIfRequired(env){
  var h = env.request.headers
  if (!(
      (h.Connection && h.Connection.match(keepAliveRegex)) ||
      (h.connection && h.connection.match(keepAliveRegex))
  )) env.response.headers.Connection = "close";
}

exports.responderCallback = function(env) {
  closeConnectionIfRequired(env)
  env.response.sendHeader(env.response.status, env.response.headers);
  env.response.sendBody(env.response.body);
  env.response.finish();
}
