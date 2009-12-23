var http = require('http')
http.createServer(function(req, res){
  res.sendHeader(200, {})
  res.sendBody("Server 1")
  res.finish();
}).listen(8000);

http.createServer(function(req, res){
  res.sendHeader(200, {})
  res.sendBody("Server 2")
  res.finish();
}).listen(8001);

