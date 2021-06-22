/* Adept Frontend API routes */

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var bodyParser = require('body-parser');
var  Path = '/app/src/';

const  {Pool} = require('pg');

// The ADEPT Database is a postgres database containing user, stored datasets, & applications control
// used to run Machine Learning apps. 
  
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
	max: 25
  });
  
pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
  })

var request = require('request');

// The GeoDeepDive URL is the elastic search engine
var gdUrl = 'https://xdddev.chtc.io/api/v1';

// Authentication 

var gAdeptKey = [];
var gNACL = '5d097fe1065645c8';

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var salt = '5d097fe1065645c8';
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
    return passwordData;
}

// * Logging functions with err
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
		console.error(ip + ' ' + nw + ' ' + rm  + ' ' + lp + qs + ' ' + ore);
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

async function createUser(uo) {
  
	var tdate = Date.now();
	var pwh = sha512(uo.pw,gNACL);
	console.log('b');
	var sqlStr = 'insert into adept.users (user_id, first_name, last_name, email,'
				+ 'org_name, purpose, apikey, role_id,'
				+ 'auth_app, created, password, user_name, state) values '
				+ ' (nextval(\'adept.adept_user_id\')'
				+ ',\'' + uo.fname + '\''
				+ ',\'' + uo.lname + '\''
				+ ',\'' + uo.em + '\''
				+ ',\'' + uo.org + '\''
				+ ',\'' + uo.purp + '\''
				+ ',\'' + gNACL + '\''
				+ ',2'
				+ ',\'adept\''
				+ ',current_timestamp'
				+ ',\'' + pwh.passwordHash + '\''
				+ ',\'' + uo.uname + '\''
				+ ',\'inactive\')';

	try {
		var z = await dbCall(sqlStr);
		return z;
	} catch(e) {
		return e;
	}
	
 }

async function dbCall(q) {
	//using pgPool
	return new Promise(function(resolve, reject) {
		pool.connect()
			.then(client => {
				return client
				.query(q)
				.then(res => {
					client.release();
					resolve(res);
				})
				.catch(err => {
					client.release()
					console.log(err.stack)
					reject(err);
				})
			});
	});
}

async function fetchAuth(u,p,s ) {

	var sqlStr = 'select user_id, first_name, last_name, user_name, apikey, role_id, password '
				+ ' from adept.users where email = \'' 
				+ u + '\' and password = \'' + p + '\' and state = \'active\' order by 1'; 

	try {
		var z = await dbCall(sqlStr);
		
		return z;
	} catch(e) {
		return e;
	}
	
}

async function getDict(type) {
	
	var s = 'select dict_id, dict_name as name, base_class as base_classification, dict_source as source, '
			+'case_sensitive, last_updated from adept.dictionaries where filter_flag = \'true\'';

  try {
		var z = await dbCall(s);
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
	
	} catch(e) {
		return e;
	}

}

async function getLocalDict(u) {

	var s = 'select * from adept.user_dictionaries where user_id ='+u;
	try {
		var z = await dbCall(s);
		
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
}

async function fetchProcessLog(u) {

	var s = 'select * from adept.process_activity where user_id ='+u;
	try {
		var z = await dbCall(s);
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
	} catch(e) {
		return e;
	}
}

async function fetchUserApps(u) {

	
	var s = 'select * from adept.app_resource where user_id ='+u;
	try {
		var z = await dbCall(s);
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
	} catch(e) {
		return e;
	}
}

async function newUserApps(u,ao) {

	var s = 'insert into adept.user_applications (ua_id, user_id, app_name, app_key, app_type,'
				+ ' source_url, proc_state, state, created, resources ) values '
				+ ' ( nextval(\'adept.user_application_seq\')'
				+ ',' + u
				+ ',\''+ ao.aname + '\''
				+ ',\'0\''
				+ ',\'docker\''
				+ ',\''+ ao.did + '\''
				+ ',\'new\''
				+ ',\'new\''
				+ ',current_timestamp'
				+ ',\''+ ao.cores + '-' + ao.memory + '\') returning ua_id';
	
  try {
		var z = await dbCall(s);
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var ua_id = b.rows[0].ua_id;
		
		if ( ao ) {
		  var r = await	addAppResources(u,ao,ua_id);
		}
		
 
		var dx = {};
		dx.success = {};
		
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
	} catch(e) {
		return e;
	}
 

  
async	function addAppResources(u,o,fk) {
		
		var s = 'insert into adept.user_app_resources (ur_id, user_id, app_id, res_type, res_id, state, created ) values ';
		var x = '';
		if ( typeof(o.test_sets) == 'undefined' && typeof(o.dict) == 'undefined' ) {
			return 0;
		} else {
			if ( typeof(o.test_sets) !== 'undefined' ) {
				s = s + ' (nextval(\'adept.user_app_res_seq\'),'+u+','+fk+',\'test set\','+o.test_sets+',\'new\',current_timestamp)';
				x = ',';
			}
			if ( typeof(o.dict) !== 'undefined' ) {
				s = s + x + ' (nextval(\'adept.user_app_res_seq\'),'+u+','+fk+',\'dict\','+o.dict+',\'new\',current_timestamp)';
			}
			
			try {
				var z = await dbCall(s);
				if (typeof(z) == "object" ) {
					var b = z;
				} else {
					var b = JSON.parse(z);
				}
				var dx = {};
				dx.success = {};
				
				if ( b.rows ) {
					dx.success.data =  b.rows;
					return dx;
				} else {
					return b;
				}
			} catch(e) {
				return e;
			}
      
		}	
	}
	
}

async function fetchUsers(t, u) {

	var s = 'select user_id, first_name, last_name, email, role_id, org_name, created, state from adept.users';
	
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
	
	} catch(e) {
		return e;
	}
}

async function updateUser(t, u, p, v) {
    
	if ( p == 'state' ) {
		var uv = '\''+v+'\'';
	} else if ( p == 'password' ) {
		var pwh = sha512(v,gNACL);
		var uv = '\''+pwh.passwordHash+'\'';
		console.log('hash '+pwh.passwordHash );
	} else {
		var uv = v;
	}

	var s = 'update adept.users set '+ p + ' = ' + uv + ' where user_id = '+ u;
	console.log('update user '+s)
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		console.log('update cb '+JSON.stringify(b));
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
}

async function fetchTestSets(u) {

	var s = 'select * from adept.test_sets where user_id ='+u;
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
}

async function fetchCollections(u, c) {

    if ( c ) {
		var s = 'select * from adept.getCollection('+u+','+c+')';
	} else {
		
		var s = 'select * from adept.collection_group where owner_id = '+u;
	}
	
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}

	} catch(e) {
		return e;
	}
}


async function newCollection(u,c) {

	var s = 'insert into adept.collections (col_name, col_type, user_id, proc_state, share_state, state, created) '
			+ ' values (\'' + c + '\',\'user\','+u+',\'new\',\'none\',\'active\',current_timestamp)';
	console.log(s);

	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}

	} catch(e) {
		return e;
	}
}

async function createNewLocalDict(user_id,dn) {
	var s = 'INSERT INTO adept.user_dictionaries (did, dict_id, user_id, proc_state, source, filter_flag, state, name)'
			+ ' VALUES (nextval(\'adept.dict_seq_id\'), 0,'+user_id+', \'new\', \'local\',\'true\', \'active\',\''+dn+'\')';

	console.log(s);

	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}

	} catch(e) {
		return e;
	}

}

async function addSearchToCollection(i, t, u, c) {
    // col_id, terms, url, count
	var s = 'insert into adept.collection_search (col_id, col_desc, search_url, state, rec_count) '
			+ ' values ('+i+',\''+t+'\',\''+u+'\',\'active\','+c+')';
	console.log(s);
  try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}

	} catch(e) {
		return e;
	}
  
}

async function delCollection(c) {
	if ( c ) {
		var s = 'select * from adept.deleteCollection ('+c+')';
		console.log(s);
		try {
			var z = await dbCall(s);
			if (typeof(z) == "object" ) {
				var b = z;
			} else {
				var b = JSON.parse(z);
			}
			var dx = {};
			dx.success = {};
			if ( b.rows ) {
				dx.success.data =  b.rows;
				return dx;
			} else {
				return b;
			}
	
		} catch(e) {
			return e;
		}
	}
	
	
}
async function addRecordToCollection(i, d) {
    // col_id, doi
	var s = 'insert into adept.collection_records (col_id, ident, itype, state) '
			+ ' values ('+i+',\''+d+'\',\'doi\',\'active\')';
	console.log(s);

	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}

	} catch(e) {
		return e;
	}
}

async function loadDict() {
	// tool for fetching dictionaries from gdd
	
	function dbProc(b) {
        console.log('dbproc ');
        if ( b.data ) {
			var da = b.data;
			console.log('dbproc loop ');
			for (k in da) {
				var dict = da[k];
				var s = 'insert into adept.dictionaries (dict_id,dict_name,base_class,case_sensitive,'
						+ 'last_updated,dict_source,filter_flag,state) values ('
						+ dict.dict_id + ',\'' + dict.name + '\',\'' + dict.base_classification + '\',\''
						+ dict.case_sensitive + '\',\'' + dict.last_updated + '\',\'' + dict.source
						+ '\',\'false\',\'active\')';
				if ( k == 0 ) { console.log('sql ' + s)}
				var drb = dbCall(s);
			}
		}
		return 'success';	
	}
    
	var dUrl = gdUrl + '/dictionaries?all';
	console.log(dUrl);
	var qd = require('request');
	var body = '';
	return new Promise(function(resolve, reject){
		qd.get(dUrl)
		.on ('response',function(response) {         		
		})
		.on ('data', function(chunk) {
			body += chunk;
		}).on ('end', function() {
			console.log('retrieved' + body);
			if (typeof(body) == "object" ) {
				console.log('typeo');
				var b = body;
			} else {
				var b = JSON.parse(body);
			}

			if ( b.success ) {
					console.log('success');
				try {
					resolve(dbProc(b.success));	
					//resolve(k);
				} catch {
					reject('error');
				}
			} else {
				reject('error');
			}		
		});		 
	});
}

async function fetchUserGroups(u, t) {

    if ( t == 'owner') {
		var s = 'select * from adept.group_membership('+u+') where owner_id='+u;
	} else if ( t == 'other') {
		var s = 'select * from adept.not_group_member('+u+')';
	} else {
		var s = 'select * from adept.group_membership('+u+')';
	}

	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}

}

async function createNewUserGroup(u,n,d,m) {

	var s = 'select * from adept.create_group('+u+',\''+n+'\',\''+d+'\',\''+m+'\')';
    
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		console.log('cngr '+JSON.stringify(b));
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			console.log('cngr success '+JSON.stringify(b.rows));
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
	
}

async function joinGroup(u,g) {

	var s = 'insert into adept.group_members (user_id, created, state, group_id  )' 
			+'values ('+u+',current_timestamp,\'new\','+g+')';
    console.log('New member '+s);

	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			console.log('cngr success '+JSON.stringify(b.rows));
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
	
}

async function exitGroup(u,g) {

	var s = 'delete from adept.group_members where user_id = '+u+' and group_id = '+g;
    
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		console.log('cngr '+JSON.stringify(b));
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			console.log('cngr success '+JSON.stringify(b.rows));
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
	
}

async function addObjectToGroup(u,g,t,o) {

	var s = 'insert into adept.group_objects (group_id,object_type, object_id, created, state )' 
			+'values ('+g+',\''+t+'\','+o+',current_timestamp,\'new\')';
    
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
	
}

async function addMemberToGroup(g,m) {

	var s = 'select * from adept.add_group_member ('+g+',\''+m+'\')';
			
	try {
		var z = await dbCall(s);
	
		if (typeof(z) == "object" ) {
			var b = z;
		} else {
			var b = JSON.parse(z);
		}
		
		var dx = {};
		dx.success = {};
		if ( b.rows ) {
			console.log('cngr success '+JSON.stringify(b.rows));
			dx.success.data =  b.rows;
			return dx;
		} else {
			return b;
		}
		
	} catch(e) {
		return e;
	}
	
}


router.get('/', async function(req, res) {
   var lp = '/adept';
   routelog(req, lp);
   res.sendFile(Path+'/public/adept-ssl.htm');
});

router.get('/getToken', async function(req, res) {

	var lp = '/adept/getToken';
	routelog(req, lp);
	var quark = req.query.q;
	var lib = req.query.p;

  	var pwh = sha512(lib,'5d097fe1065645c8');
 
  var px = await fetchAuth(quark, pwh.passwordHash, pwh.salt);
 
  if ( typeof(px) !== "object" ) {
	px = JSON.parse(px);
  }

  if ( px ) { 

	if ( px.rows.length > 0 ) {
		var dres = px.rows; 
		var kv = dres[0];

		var authtoken = 'A'+kv.apikey.substr(0,6) + 'E' + kv.password.substr(0,12); 
		console.log(' atk ' + authtoken);
		gAdeptKey.push(authtoken);
		var cms = {};

		cms.authtoken  = authtoken;
		cms.kv = authtoken;
		cms.agentrole = kv.role_id;
		cms.user_id = kv.user_id;

		res.send(cms);
	} else {
		res.send('{"authtoken": "Not authorized"}');	
	}
  
  } else {
	  res.send('{"authtoken": "Not authorized"}');	
  } 

  
});

router.get('/getUsers', async function(req, res ) {
	var lp = '/getUsers';
	routelog(req, lp);

	var utoken = req.query.t;
	var uid = req.query.u;

	var vex = gAdeptKey.indexOf(utoken);
    console.log('users '+utoken+' '+uid+ ' '+vex);
	if ( vex >= 0 ) {	
		var cur = await fetchUsers(utoken);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		}    
	}
  
});

router.get('/updateUser', async function(req, res ) {
	var lp = '/updateUser';
	routelog(req, lp);

	var utoken = req.query.t;
	var uid = req.query.u;
	var p = req.query.p;
	var v = req.query.v;

	var vex = gAdeptKey.indexOf(utoken);
    console.log('user update '+utoken+' '+uid+ ' '+vex+' '+p+' '+v);

	if ( vex >= 0 ) {	
		if ( p == 'role_id' || p == 'state' || p == 'password' ) {
			console.log('line 777 '+utoken+' '+uid+ ' '+vex+' '+p+' '+v);
			var cur = await updateUser(utoken,uid,p,v);
			if ( cur == null) {
				res.send('No response');	
			} else {
				res.send(cur);	
			}
		} else {
			res.send('Invalid Request');
		}    
	}
  
});

router.get('/createUser', async function( req, res ) {
	// registration
	var lp = '/adept/createUser';
	routelog(req, lp);

	var u = {};
	u.fname = req.query.f;
	u.lname = req.query.l;
	u.uname = req.query.u;
	u.pw = req.query.p;
	u.token = req.query.t;
	u.org = req.query.o;
	u.purp = req.query.d;
	u.em = req.query.em;
	u.rp = req.query.a;
  

	try {
		var cur = await createUser(u);
		res.send(cur);
	} catch(err) {
		res.send('User Created - not so much '+err);	
	}
	
});

router.get('/getFilteredDictionaries', async function( req, res) {
	var lp = '/adept/getFilteredDictionaries';
	routelog(req, lp);

	var type = req.query.t;
	if ( !type ) { type = 'all'; }
	console.log(' test ' + type);

	var cur = await getDict(type);
	if ( cur == null) {
		res.send('No response');	
	} else {
		res.send(cur);	
	} 
});

router.get('/getLocalDictionaries', async function( req, res) {
	var lp = '/adept/getLocalDictionaries';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await getLocalDict(user_id);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/getProcessLog', async function( req, res) {
	var lp = '/adept/getProcessLog';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await fetchProcessLog(user_id);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/getUserApps', async function( req, res) {
	var lp = '/adept/getUserApps';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await fetchUserApps(user_id);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/newUserApp', async function( req, res) {
	var lp = '/adept/newUserApps';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
    var ua = {};
	ua.aname = req.query.n;
	ua.did = req.query.d;
	ua.cores = req.query.c;
	ua.memory = req.query.m;
	ua.test_sets = req.query.s;
	ua.dict = req.query.i;

	console.log(' t' + token + ' ' + JSON.stringify(ua));
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await newUserApps(user_id, ua);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});



router.get('/getLocalDicTerms', async function( req, res) {
	var lp = '/adept/getLocalDicTerms';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var dict_id = req.query.dict_id;

	if ( gAdeptKey.includes(token) ) {
		var cur = await getLocalDicTerms(dict_id);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});


router.get('/getTestSets', async function( req, res) {
	var lp = '/adept/getTestSets';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;

	if ( gAdeptKey.includes(token) ) {
		var cur = await fetchTestSets(user_id);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	
});


router.get('/getCollections', async function( req, res) {
	var lp = '/adept/getCollections';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;

	if ( gAdeptKey.includes(token) ) {
		var cur = await fetchCollections(user_id);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/getCollection', async function( req, res) {
	var lp = '/adept/getCollection';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var col_id = req.query.c;

	if ( gAdeptKey.includes(token) ) {
		var cur = await fetchCollections(user_id, col_id);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/newCollection', async function( req, res) {
	var lp = '/adept/newCollection';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var cn = req.query.c;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await newCollection(user_id,cn);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/newLocalDictionary', async function( req, res) {
	var lp = '/adept/newLocalDictionary';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var dn = req.query.d;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await createNewLocalDict(user_id,dn);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});
router.get('/newSearchInCollection', async function( req, res) {
	var lp = '/adept/newSearchInCollection';
	routelog(req, lp);

	var token = req.query.t;
	var url = req.query.u;
	var term = req.query.d;
	var colid = req.query.i;
	var count = req.query.c;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await addSearchToCollection(colid, term, url, count);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/deleteCollection', async function( req, res) {
	var lp = '/adept/deleteCollection';
	routelog(req, lp);

	var token = req.query.t;
	var uid = req.query.u;
	var cid = req.query.c;

	if ( gAdeptKey.includes(token) ) {
		var cur = await delCollection(cid);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	}


});

router.get('/newRecordInCollection', async function( req, res) {
	var lp = '/adept/newRecordInCollection';
	routelog(req, lp);

	var token = req.query.t;
	var doi = req.query.d;
	var colid = req.query.i;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await addRecordToCollection(colid, doi);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

async function registerTS(u,c) {

    var cur = await fetchCollections(u,c);

	if ( cur == null ) {
		res.sent('Error - collection not found');
	} else {

		var jb = {}
		jb.user_id = u;
		jb.col_id = c;

		jb.data = cur.success;
		registerPost(jb)
		
	}

	var xddResponse = function(err, httpResponse, body) {
        if (err) {
			errObj = {"result": "Save error : " + err};
			console.log(' err response ' + stuff);
			
             res.send(errObj);
        } else {
            jbody = {"result": "Upload response: " + body};
			console.log(' response '+body);
            r.send(jbody);

        }
    }

	var registerPost = async function(jb,r) {
		xddRequest = require('request');
        var hurl = 'https://xdddev.chtc.io/api/adept_request_testset';

		var postlen = JSON.stringify(jb).length;
		var options = {
			url: hurl, 
			method: "POST",
			body : jb,
			headers: {
			  'sendImmediately': true,
			  contentType: "application/json",
			  contentLength: postlen
			}
		};

		xddRequest.post(options, xddResponse);
	}

}

router.get('/registerCollection', async function( req, res) {
	var lp = '/adept/registerCollection';
	routelog(req, lp);

	var token = req.query.t;
	var u = req.query.u;
	var colid = req.query.c;
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await addRecordToCollection(u, colid);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/loadDictionaries', async function( req, res) {
	var lp = '/adept/loadDictionaries';
	routelog(req, lp);
	var cur = await loadDict();
	res.send(cur);

});

router.get('/getUserGroups', async function( req, res) {
	var lp = '/adept/getUserGroups';
	routelog(req, lp);

	var token = req.query.t;
	var u = req.query.u;
	var type = req.query.type;

	if ( gAdeptKey.includes(token) ) {
		var cur = await fetchUserGroups(u,type);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	
});

router.get('/newUserGroup', async function( req, res) {
	var lp = '/adept/newUserGroup';
	routelog(req, lp);

	var token = req.query.t;
	var u = req.query.u;
	var n = req.query.n;
	var d = req.query.d;
	var m = req.query.m;

	if ( gAdeptKey.includes(token) ) {
		console.log('ng authorized '+u+' '+n+' '+' '+d+' '+m);
		var cur = await createNewUserGroup(u,n,d,m);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	
});

router.get('/joinGroup', async function( req, res) {
	var lp = '/adept/joinGroup';
	routelog(req, lp);

	var token = req.query.t;
	var u = req.query.u;
	var g = req.query.g;

	if ( gAdeptKey.includes(token) ) {
		console.log('join '+u+' '+g);
		var cur = await joinGroup(u,g);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	
});

router.get('/leaveGroup', async function( req, res) {
	var lp = '/adept/leaveGroup';
	routelog(req, lp);

	var token = req.query.t;
	var u = req.query.u;
	var g = req.query.g;

	if ( gAdeptKey.includes(token) ) {
		console.log('join '+u+' '+g);
		var cur = await exitGroup(u,g);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	
});

router.get('/addObjectToGroup', async function( req, res) {
	var lp = '/adept/addObjectToGroup';
	routelog(req, lp);

	var token = req.query.t;
	var u = req.query.u;
	var g = req.query.g;
	var type = req.query.type;
	var o = req.query.o;

	if ( gAdeptKey.includes(token) ) {
		console.log('ng authorized '+u+' '+g+' '+' '+type+' '+o);
		var cur = await addObjectToGroup(u,g,type,o);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	
});

router.get('/addMemberToGroup', async function( req, res) {
	var lp = '/adept/addObjectToGroup';
	routelog(req, lp);

	var token = req.query.t;
	var m = req.query.m;
	var g = req.query.g;


	if ( gAdeptKey.includes(token) ) {
		console.log('add mem authorized '+g+' '+m);
		var cur = await addMemberToGroup(g,m);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	
});


module.exports = router;


