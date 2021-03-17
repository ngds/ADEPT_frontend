/* Adept Front End  App V1.2
   G. Hudman

*/  

require('dotenv').config();
var  Path = process.env.NODE_PATH;
const port = 443;
const hostIP = '';
var  fs = require("fs");

var https = require("https");
const cert = fs.readFileSync('../ssl/__XXX_org_cert.cer');
const ca = fs.readFileSync('../ssl/__XXXX_org.cer');
const key = fs.readFileSync('../ssl/MYSERVER.key');

var credentials = { key: key,
                    cert: cert };

const pg = require('pg');

const connectionString = 'postgres://USER:PW@localhost:5432/DBNAME';

var express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser');

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
const client = new pg.Client(connectionString);

const results = [];
client.connect();

function routelog(req,lp, ore) {
	var ip = req.headers['x-forwarded-for'] || 
	req.connection.remoteAddress || 
	req.socket.remoteAddress ||
	(req.connection.socket ? req.connection.socket.remoteAddress : null);

	if (ip.substr(0, 7) == "::ffff:") {
	   ip = ip.substr(7)
	}
	var qs = '';
	if ( req.query ) {
		qs = '?';
		for (var key in req.query) {
			qs = qs + '&' + key + '=' + req.query[key];
		  }
	}
	
	var rm = req.method;
	var nw = rd();

	if ( typeof(ore) !== 'undefined' ) {
		console.error(ip + ' ' + nw + ' ' + rm  + ' ' + lp + ' ' + qs + ' : ' + ore);
	} else {
		console.log(ip + ' ' + nw + ' ' + rm  + ' ' + lp + qs);
	}		

}

function rd() {
	var d = new Date();
	d = '['+d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) 
		+ "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) 
		+ ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' 
		+ d.getSeconds()).slice(-2).slice(-2)+'.'+d.getMilliseconds()+']';
	return d;
}

app.get('/' , function(req,res) {
	console.log('path '+Path);
	
	 var lp = '/public/adept-ssl.htm';
	 routelog(req, lp);
	 res.header('Access-Control-Allow-Origin', '*');
	 res.header('Access-Control-Allow-Headers', '*');
	 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
     res.sendFile(Path+lp);
} );


app.get('/adept' , function(req,res) {
	var lp = '/public/adept-ssl.htm';
	routelog(req, lp);
	res.sendFile(Path+lp);
} );


app.get('/admin' , function(req,res) {
	 
	var lp = '/public/adept-admin.htm';
	routelog(req, lp);
	res.sendFile(Path+lp);

} );

app.get('/url_status', function(req, res) {
	var lp = '/url_status';
	routelog(req, lp);
  	var exists = true;
	res.send(exists);
	
	var urlToCheck = req.query.url;
	console.log(' URL - ' + urlToCheck);
	res.send(exists);
	
});	

httpsServer.listen(port,localhost)

/*
app.listen(port, () => {
  //console.log('App running on port ${port}.')
  console.log('Startup  ' + rd() + ' ' + Path + ':' + port);
});
*/
