process.mixin(require("sys"));
var Chain = require('../lib/chain');

/* A global auditor */
var Auditor = {
  handle : function(message_type, messages){
    puts(new Date().toString() + " Auditing the environment with uri " + env.request.uri);
    while(message = messages.shift()) puts("   " + message);
  }
}

Chain.Environment.prototype.audit = function(){
  Chain.broadcast("Auditor", "audit", Array.prototype.slice.call(arguments));
}

Chain.addListener("Auditor", function(message_type, messages){
  Auditor.handle(message_type, messages);
})

/* End the global auditor */

var SimpleRouter = {
  onRequest : function(env){
    var self = this;

    if (env.request.uri == "/test"){
      env.next();
    } else {
      env.next(SomeEndPoint);
    }
    env.audit("A Message from the SimpleRouter");
  }
}

var SomeEndPoint = {
  name      : 'SomeEndPoint',
  onRequest : function(env){
    env.body += "I'm In " + this.name;
    env.done();
    env.audit("Hi, I'm in Some Endpoint and I've got something to say", "And I've got somethign else to say too");
  }
}

var EndPoint = {
  onRequest : function(env){
    env.body += "<br/>I'm in the endpoint now!";
    env.headers["Content-Type"] = "text/plain";
    env.done();
    env.audit("I'm in the Endpoint.  I'm done " )
  }
};

var builder = new Chain.Builder();
builder
  .use(SimpleRouter)
  .use(EndPoint)

Chain.run(builder.build());
