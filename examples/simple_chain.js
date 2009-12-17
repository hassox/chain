process.mixin(require("sys"));
process.mixin(require('./../lib/link'));

var Responder = new Link.App.Standard("Responder", {
  on : {
    request  : function(env){
      var self = this;
      env.body += "In Request on Responder";
      env.callBack(function(){
        self.on.response(env);
      });

      this.pass(env);
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

Link.run(Responder);
