process.mixin(require("sys"));
process.mixin(require('./../lib/chain'));

/* A global auditor */
var Auditor = {
  handle : function(message_type, messages){
    puts(new Date().toString() + " Auditing the environment with uri " + env.request.uri.path);
    while(message = messages.shift()) puts("   " + message);
  }
}

Chain.Link.prototype.audit = function(){
  Chain.broadcast("Auditor", "audit", Array.prototype.slice.call(arguments))
}

Chain.addListener("Auditor", function(message_type, messages){
  Auditor.handle(message_type, messages)
})

/* End the global auditor */

var SimpleRouter = new Chain.Link("SimpleRouter", {
  onRequest : function(env){
    var self = this

    if (env.request.uri.path == "/test"){
      env.send(this.nextApp)
    } else {
      env.send(SomeEndPoint)
    }
    this.audit("A Message from the SimpleRouter")
  }
})

var SomeEndPoint = new Chain.Link("SomeEndPoint", {
  onRequest : function(env){
    env.body += "I'm In " + this.name;
    env.done();
    this.audit("Hi, I'm in Some Endpoint and I've got something to say", "And I've got somethign else to say too");
  }
})

var EndPoint = new Chain.Link("EndPoint", {
  onRequest : function(env){
    env.body += "<br/>I'm in the endpoint now!";
    env.headers["Content-Type"] = "text/plain";
    env.done();
    this.audit("I'm in the Endpoint.  I'm done " )
  }
});

app = Chain.Builder.make([SimpleRouter, EndPoint]);

Chain.run(app);
