process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

/* A global auditor */
var Auditor = {
  handle : function(message_type, messages){
    puts(new Date().toString() + " Auditing the environment with uri " + env.request.uri.path);
    while(message = messages.shift()) puts("   " + message);
  }
}

Link.App.prototype.audit = function(){
  Link.broadcast("Auditor", "audit", Array.prototype.slice.call(arguments))
}

Link.addListener("Auditor", function(message_type, messages){
  Auditor.handle(message_type, messages)
})

/* End the global auditor */

var SomeMiddleware = new Link.App("SomeMiddleware", {
  onRequest : function(env){
    var self = this
    this.audit("A Message from the SomeMiddleware")

    env.onDone(function(){
      env.done();
    })

    if (env.request.uri.path == "/test"){
      env.send(this.nextApp)
    } else {
      env.send(SomeEndPoint)
    }
  }
})

var SomeEndPoint = new Link.App("SomeEndPoint", {
  onRequest : function(env){
    env.body += "I'm In " + this.name;
    env.done();
    this.audit("Hi, I'm in Some Endpoint and I've got something to say", "And I've got somethign else to say too");
  }
})

var EndPoint = new Link.App("EndPoint", {
  onRequest : function(env){
    env.body += "<br/>I'm in the endpoint now!";
    env.headers["Content-Type"] = "text/plain";
    env.done();
    this.audit("I'm in the Endpoint.  I'm done " )
  }
});

app = Link.Builder.chain([SomeMiddleware, EndPoint]);

Link.run(app);
