var sys = require("sys");
var link = require('./link')

function wrap(app){
  if (typeof(app) == 'function') {
    return new link.Link('', {onRequest: app});
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
 *    .use(function(env){env.don()})
 *    .use(myInstanceComponent);
 *    .useConstructor(myConstructor, "any", {other:"args"});
 *
 *   chain.run(builder.build());
 */
function Builder(){
  this.stackDefinition  = [];
  this.stack            = [];
  this.constructed      = false;

  // setup the use function to use function / instances
  this.use = function(instance){
    this.stackDefinition.push({ type : "object", object : instance});
    return this;
  }

  /* setup the function to use constructors with options
   * a single object may be provided as options to pass to the constructor
   *
   * The constructor may only accept a single argument due to no argument splatting
   * in javascript
   *
   * @example
   *   var builder = new Chain.Builder()
   *   builder
   *    .useConstrctor(myConstructor, { path : "/some/path", option2 : "another option"})
   *    .use(myInstanceApp);
   */
  this.useConstructor = function(constructor, opts){
    this.stackDefinition.push({type : "constructor", "constructor" : constructor, "opts" : opts});
    return this;
  }

  // setup an app method that creates the stack and returns the application
  this.build = function(){
    this.stack = [];
    var sd = this.stackDefinition
    for(var i=0; i < sd.length; i++){
      switch(sd[i].type){
        case "object" :
          this.stack.push(sd[i].object);
          break;
        case "constructor" :
          var c     = sd[i].constructor
          var opts  = sd[i].opts
          this.stack.push(new c(opts))
          break;
        default :
          throw "Unknown type of link " + sys.inspect(sd[i])
      }
    }
    return make(this.stack);
  }
}

Builder.make = make;

exports.Builder = Builder;
