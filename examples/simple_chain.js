process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

var Auditor = {
  handle : function(env){
    puts("Auditing the environment with uri " + env.request.uri.path);
    puts(inspect(arguments));
    args = Array.prototype.slice.call(arguments)
    args.shift();
    while(message = args.shift()){
      puts("   " + message);
    }
  }
}

Link.addGlobalCallBack(function(app){
  app.addListener("audit",function(env){
    Auditor.handle(env);
  });
});


var Responder = new Link.App("Responder", {
  on : {
    request  : function(env){
      var self = this;
      env.callBack(function(){
        self.on.response(env);
      });

      this.emit("audit", env, "Some Message from the responder");
      // route
      if(env.request.uri.path == "/test"){
        this.nextApp.emit("request", env);
      } else {
        SomeEndPoint.emit("request", env);
      }
    },

    response : function(env){
      var res = env.response;
      res.sendHeader(env.status, env.headers);
      res.sendBody(env.body);
      res.finish();
      env.complete();
    }
  }
});

var SomeEndPoint = new Link.App("SomeEndPoint", {
  on : {
    request : function(env){
      env.body += "I'm In " + this.name;
      env.done();
      this.emit("audit", env, "Hi, I'm in SomeEndPoint and I've got somethign to say");
    }
  }
})

var EndPoint = new Link.App("EndPoint", {
  on : {
    request : function(env){
      env.body += "<br/>I'm in the endpoint now!";
      env.headers["Content-Type"] = "text/plain";
      env.done();
    }
  }
});


Link.Builder.chain(Responder, [EndPoint]);

Link.run(Responder);
