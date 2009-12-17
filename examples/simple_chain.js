process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

var Responder = new Link.App.Standard("Responder", {
  on : {
    request  : function(env){
      var self = this;
      env.callBack(function(){
        self.on.response(env);
      });
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

var SomeEndPoint = new Link.App.Standard("SomeEndPoint", {
  on : {
    request : function(env){
      env.body += "I'm In " + this.name;
      env.done();
    }
  }
})

var EndPoint = new Link.App.Standard("EndPoint", {
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
