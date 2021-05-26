/* NGDS Adept Server
   G. Hudman
  
  Path - to local node application
  certname - root name of cert fileSize
  This configuration assumes the application will have certs located in /ssl directory under path
  The local host IP given below is a default docker instance IP. 
*/

var  Path = '/<WORKING-DIR>';
var certname = '<WORKING-CERT>';
var localHostIp = '172.17.0.2';

var  fs = require("fs");
console.log('Node Adept SSL app startup at ' + Date.now());

const port = 443;
var  fs = require("fs");

var https = require("https");
const cert = fs.readFileSync(Path+'/ssl/'+certname+'_cert.cer');
const ca = fs.readFileSync(Path+'/ssl/'+certname+'.cer');
const key = fs.readFileSync(Path+'/ssl/server.key');

var credentials = { key: key,
                    cert: cert };
                    
var express = require('express'),
    app = express(),
    request = require('request');

var adeptapi =  require("./adept-routes.js");
var httpsServer = https.createServer(credentials, app);

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

httpsServer.listen(port,localHostIp)

