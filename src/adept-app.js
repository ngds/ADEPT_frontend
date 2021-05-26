/* NGDS Adept Server
   G. Hudman
  
*/

var  Path = '/<WORKING-DIR>/';
var  fs = require("fs");
console.log('Node Adept app startup at ' + Date.now());

const port = 80;
var express = require('express'),
    app = express(),
    request = require('request');

var adeptapi =  require("./adept-routes.js");

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});
 
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/adept',adeptapi);

app.get('/' , function(req,res) {
	 var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

	 console.log('Remote IP ' + ip + ' ' + Path );
	 res.header('Access-Control-Allow-Origin', '*');
	 res.header('Access-Control-Allow-Headers', '*');
	 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
     res.sendFile(Path+'/public/adept-ssl.htm');
} );

app.listen(port, () => {
 
  console.log(`App running on port ${port}.`)
});

