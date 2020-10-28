/* NGDS Adept Server
   G. Hudman
  
*/

require('dotenv').config();
var  Path = process.env.NODE_PATH;
var  fs = require("fs");
console.log('Startup at ' + Date.now() + ' ' + Path);

const pg = require('pg');

const connectionString = 'postgres://xx:xx@localhost:5432/';
console.log(' connection ', connectionString );

const port = process.env.PORT;
var express = require('express'),
    app = express(),
    request = require('request');

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});
 
app.use( bodyParser.json({limit: '50mb'}) ); 

app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
const client = new pg.Client(connectionString);

client.connect();

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
  console.log('App running on port ${port}.')
});

