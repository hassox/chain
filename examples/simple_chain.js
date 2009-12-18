process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

/* A global auditor */
var Auditor = {
  handle : function(messages){
    puts(new Date().toString() + " Auditing the environment with uri " + env.request.uri.path);
    args = Array.prototype.slice.call(messages)
    while(message = args.shift()){
      puts("   " + message);
    }
  }
}

Link.App.prototype.audit = function(){
  this.emit("audit", arguments)
}

Link.addGlobalCallback(function(app){
  app.addListener("audit",function(env){
    Auditor.handle(env);
  });
});
/* End the global auditor */

var SomeMiddleware = new Link.App("SomeMiddleware", {
  onRequest : function(env){
    var self = this
    this.audit("A Message from the middleware")

    env.onDone(function(){
      puts("On the way out.  I went through Some Middleware")
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
    this.audit("Hi, I'm in Some Endpoint and I've got something to say");
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
