var sys = require('sys')
var content = "Fastest Node I can do";
var headers = {'Content-Type' : 'text/plain'};

http = require('http');

http.createServer(function(req, res){
  res.sendHeader(200, headers);
  res.sendBody(content);
  res.finish();
}).listen(8000);

sys.puts("Server running at http://127.0.0.1:8000")
