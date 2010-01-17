var sys = require("sys");
var link = require('./link')

function wrap(app){
  if (typeof(app) == 'function') {
    return { onRequest : app }
  } else {
    return app;
  }
}

function make(stack){
  if (typeof(stack) === 'function') {
    stack = [stack];
  }
  var firstApp = wrap(stack[0]);
  var app = firstApp;
  for(var i = 1; i < stack.length; i++){
    var nextApp = wrap(stack[i]);
    app.nextApp = nextApp;
    app = nextApp;
  }
  return firstApp;
}

/* Need a builder object that we can setup chain dependencies
 * using functions, instances or a constructor
 *
 * @example
 *   var chain = require('chain')
 *
 *   var builder = new chain.Builder();
 *   builder
 *    .use(function(env){env.done()})
 *    .use(myInstanceComponent);
 *    .use(myConstructor, "some", ["args"], {opts:"args"});
 *
 *   chain.run(builder.build());
 */
function Builder(){
  this.stackDefinition  = [];
  this.stack            = [];
  this.constructed      = false;

  // setup the use function to use function / instances
  this.use = function(instance){
    var sd = this.stackDefinition;
    if(arguments.length > 1){
      sd.push({ "arguments" : arguments})
    } else {
      sd.push({ link : wrap(instance) })
    }
    return this;
  }

  // setup an app method that creates the stack and returns the application
  this.build = function(){
    this.stack = [];
    var sd = this.stackDefinition
    for(var i=0; i < sd.length; i++){
      var blueprint = sd[i];
      var link = undefined;
      if(blueprint.arguments){
        link = Object.create.apply(Object, blueprint.arguments);
      } else {
        link = blueprint.link;
      }
      this.stack.push(link);
    }
    return make(this.stack);
  }
}

exports.Builder = Builder;
