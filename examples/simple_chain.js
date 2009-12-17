process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

var Responder = new Link.App.Standard("Responder", {
  on : {
    request  : function(env){
      this.pass(env);
    },

    response : function(env){
      env.body = "Hi There";
      var res = env.response;
      res.sendHeader(env.status, env.headers);
      res.sendBody(env.body);
      res.finish();
    }
  }
});

Link.Builder.chain(Responder, [new Link.App.LoopBack("loopback")]);

Link.run(Responder);
