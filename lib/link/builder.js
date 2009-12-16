sys = require("sys");
function callAction(app, event){
	return function(env){
    sys.puts("Calling " + event + " back to " + app.name);
  	app.on[event].call(app, env);
  }
}

function reEmit(app, event){
	return function(env){
    sys.puts("Re-Emitting " + event + " back to " + app.name);
    app.emit(event, env);
  }
}

function addEventChain(parent, child, event){
  sys.puts("Adding " + event + " from " + child.name + " to " + parent.name);
  if(parent.on[event] == undefined){
    child.addListener(event, reEmit(parent, event));
  } else {
    child.addListener(event, callAction(parent,event));
  }
}

exports.chain = function(master, stack){
  var events = {};

  var app = master;

  for(var i = 0; i < stack.length; i++){
    var nextApp = stack[i];
    puts("Entering Chaing with " + app.name + " and " + nextApp.name );
    app.nextApp = nextApp;

    /* by getting all the events of the parent, all child
     * apps can be setup to re-emit unknown events back to the parent
     */
    process.mixin(events, app.on);
    sys.puts("Current Events: " + inspect(events));

    for(event in events){
      if(event != "request"){
        puts(i + " Chaining events for " + app.name + " and " + nextApp.name + " for " + event);
        addEventChain(app, nextApp, event);
      }
    }
    app = nextApp;
  }
  return master;
}
