/* Adept routes */

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var bodyParser = require('body-parser');
const https = require('https');
const nodemailer = require("nodemailer");
const { getMaxListeners } = require("process");
// This is the docker path
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
  });

var request = require('request');

var qbUrl = 'http://127.0.0.1:8082/query?q=';
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

// ADEPT Functions

async function createUser(uo) {
  
	var tdate = Date.now();
	var pwh = sha512(uo.pw,gNACL);

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

	var z = await dbCall(sqlStr);
	return z;

  }

async function dbCall(q) {
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

}

async function getLocalDict(u) {

	var s = 'select did as dict_id, name, source from adept.user_dictionaries where user_id ='+u;
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

async function getLocalDicTerms(u, d) {

	var s = 'select d.name, t.* from adept.dictionary_terms t, adept.user_dictionaries d '
			+ ' where t.did = d.did and d.did = '+d;

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
		console.log('Local Dictionary Terms error: '+e);
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

	async function insertApp(u,ao) {

		var s = 'insert into adept.user_applications (ua_id, user_id, app_name, app_key, app_desc,'
					+ ' docker_image, checksum, state, created, resources, github_repo, runtime, testset_id) values '
					+ ' ( nextval(\'adept.user_application_seq\')'
					+ ',' + u
					+ ',\''+ ao.aname + '\''
					+ ',\'0\''
					+ ',\''+ ao.desc +'\''
					+ ',\''+ ao.did + '\''
					+ ',\''+ ao.checksum +'\''
					+ ',\'new\''
					+ ',current_timestamp'
					+ ',\''+ ao.cores + '-' + ao.memory
					+ '\',\''+ ao.github_repo +'\''
					+ ',\''+ ao.runtime +'\''
					+  ','+ao.testset
					+ ') returning ua_id';
		
		try {
			var z = await dbCall(s);
			if (typeof(z) == "object" ) {
				var b = z;
			} else {
				var b = JSON.parse(z);
			}
			var ua_id = b.rows[0].ua_id;
			var nx = setupAppEmail(u,ao,ua_id);
			
			return(nx);

		} catch(e) {
			return e;
		}

	}

	async function setupAppEmail(u, ao, ua_id  ) {

        var s = 'select * from adept.users where user_id = '+u;
		try {
			var z = await dbCall(s);
			if (typeof(z) == "object" ) {
				var b = z;
			} else {
				var b = JSON.parse(z);
			}
			var user_email = b.rows[0].email;
			var estatus = sendAppEmail(u, user_email, ua_id, ao);
			return estatus;
		} catch(e) {
			return e;
		}
		
    }

	async function sendAppEmail(u,umail, ua_id, ao ) {

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
            user: "", 
            pass: "", 
            },
        });
        // On gmail, this works if the Account option - Less Secure apps - is turned on 
        var es = "<b>Application Registration Request</b></br>" + 
                "User: " + umail + " User Id " + u +"</br>" +
                "App Name: " + ao.aname + " App Docker ID " + ao.did + "</br>" +
                "Cores " + ao.cores + "Memory: " + ao.memory;

        let info = await transporter.sendMail({
            from: '', // sender address
            to: "", // list of receivers
            subject: "New Application Registration request", // Subject line
            text: "", 
            html: es
        });
        if ( info ) {
			
            updateAppStatus(u, ao, ua_id)
        }
        return info;
    }

	async function updateAppStatus(u, ao, ua_id  ) {

        var s = 'update adept.user_applications set state = \'pending\' where ua_id = '+ua_id;

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

	async function addAppResources(u,o,fk) {
	
		var s = 'insert into adept.user_app_resources (ur_id, user_id, app_id, res_type, res_id, state, created, instance_id) values ';
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

    // This starts execution
    insertApp(u, ao );
}

async function removeUserApp(apid) {
    if ( apid ) {
        var s = 'select * from adept.deleteApplication ('+apid+')';
       
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

async function execAppInstance(u,i,n,c,m,t,d) {

    async function insertAppInstance(u,i,n,c,m,t) {

		var ta = t.split(',');
        var tz = 'ARRAY[';
        
        for (k in ta) {
          if ( k == ta.length-1 ) {
             tz = tz+'\''+ta[k]+'\'';
          } else {
            tz = tz+'\''+ta[k]+'\',';
          }
        }
        tz = tz+']';
        
        var s = 'select * from adept.addNewInstance('+u+','+i+',\''+n+'\',\''+c+'\',\''+m+'\','+tz+')';
       

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
				
				var ax_id = b.rows[0].addnewinstance;   
				var axa = ax_id.split('-')[1];
				
				var z = await sendAppInstanceEmail(u,i,n,c,m,t, axa);
				dx.success.data =  b.rows;
				return dx;
			} else {
				return b;
			}
	
		} catch(e) {
			return e;
		}
		
    }

   async function sendAppInstanceEmail(u,i,n,c,m,t, ax_id ) {

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
            user: "", 
            pass: "", 
            },
        });
        // On gmail, this works if the Account option - Less Secure apps - is turned on 
        var es = "<b>Application Execution Request</b></br>" + 
                " User Id " + u +"App Run Id " + ax_id + "</br>" +
                "Notes: " + n + " Application ID " + i+ "</br>" +
                "Cores " + c + "Memory: " + m + "Test Sets : " + t ;

        let info = await transporter.sendMail({
            from: '', // sender address
            to: "", // list of receivers
            subject: "New Application Run Request", // Subject line
            text: "", 
            html: es
        });
        if ( info ) {
           
            updateAppInstanceStatus(u,i,n,c,m,t, ax_id)
        }
       
        return info;
    }

    async function updateAppInstanceStatus(u,i,n,c,m,t,ax_id  ) {
        
        var s = 'update adept.user_app_instance set state = \'active\' where ax_id = '+ax_id;
		
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

    insertAppInstance(u,i,n,c,m,t);
}


async function fetchAppHistory (a) {

	var s = 'select * from adept.app_instance_history where app_id = '+a;
	
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
	
	} else {
		var uv = v;
	}

	var s = 'update adept.users set '+ p + ' = ' + uv + ' where user_id = '+ u;

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
		var s = 'select * from adept.collection_group c, adept.collectionset('+u+') s' 
		+ ' where c.user_id = s.user_id and c.col_id = s.col_id';
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

async function createNewLocalDict(user_id,dn, dt) {

	var s = 'select * from adept.new_local_dictionary('+user_id+',\''+dn+'\',\''+dt+'\')';

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

async function  addNewLocalDictTerm(u,d, dt) {

	var s = 'insert into adept.dictionary_terms (dt_id, did, term, hits, edit_state, state) '
			+ ' values ( nextval(\'adept.dict_term_seq_id\'),' + d + ',\''+dt+'\',0,\'new\',\'active\')';

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

async function  updateLocalDictTerm(u,dtid, dval) {

	var s = 'update adept.dictionary_terms set term = \'' + dval + '\' where dt_id = ' + dtid;

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

async function  deleteLocalDictTerm(u, dt) {

	var s = 'delete from adept.dictionary_terms where dt_id = ' + dt;

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

async function  deleteLocalDict(u, dt) {

	var s = 'select * from adept.delete_local_dict(' + dt + ')';

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

async function delCollectionSearch(c) {
	if ( c ) {
		var s = 'delete from adept.collection_search where cs_id = '+c;
	
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

async function deleteRecordFromCollection(i, d) {
    // col_id, doi
    var s = 'delete from adept.collection_records where col_id = '+i+' and cr_id = '+d;
 
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


async function addRecordToCollection(i, d) {
    // col_id, doi
	var s = 'insert into adept.collection_records (col_id, ident, itype, state) '
			+ ' values ('+i+',\''+d+'\',\'doi\',\'active\')';

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
     
        if ( b.data ) {
			var da = b.data;
		
			for (k in da) {
				var dict = da[k];
				var s = 'insert into adept.dictionaries (dict_id,dict_name,base_class,case_sensitive,'
						+ 'last_updated,dict_source,filter_flag,state) values ('
						+ dict.dict_id + ',\'' + dict.name + '\',\'' + dict.base_classification + '\',\''
						+ dict.case_sensitive + '\',\'' + dict.last_updated + '\',\'' + dict.source
						+ '\',\'false\',\'active\')';
				
				var drb = dbCall(s);
			}
		}
		return 'success';	
	}
    
	var dUrl = gdUrl + '/dictionaries?all';

	var qd = require('request');
	var body = '';
	return new Promise(function(resolve, reject){
		qd.get(dUrl)
		.on ('response',function(response) {         		
		})
		.on ('data', function(chunk) {
			body += chunk;
		}).on ('end', function() {
		
			if (typeof(body) == "object" ) {
			
				var b = body;
			} else {
				var b = JSON.parse(body);
			}

			if ( b.success ) {

				try {
					resolve(dbProc(b.success));	
					
				} catch {
					reject('error');
				}
			} else {
				reject('error');
			}		
		});		 
	});
}


async function registerTestSet(u,c) {

	var xddResponse = function(err, httpResponse, body) {
      
      if (err) {
			errObj = {"result": "Save error : " + err};
			console.log(' register Test Set error ' + err);
			return errObj;
             
        } else {
            jbody = {"result": "Upload response: " + body};
            return jbody;
        }
        
    }

	var registerPost = async function(jb,r) {
	
	
    	var hurl = 'https://xdddev.chtc.io/api/adept_request_testset?api_key=123-ABC';
		var hburl = 'https://xdddev.chtc.io';
				
		var postlen = JSON.stringify(jb).length;
		var options = {
			hostname: 'xdddev.chtc.io',			
			path: '/api/adept_request_testset?api_key=123-ABC',
      		port: 443, 
			method: "POST",
			body : jb,
			headers: {
			  'sendImmediately': true,
			  'content-type': "application/json",
        	  'content-length': postlen

			}
		};

		const req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`)
			res.on('data', d => {
				process.stdout.write(d);
                saveTestSet(d);
				process.stdout.write('AFTER SAVE');
			})
		})
		req.on('error', error => {
			console.error(error)
		})
		req.write(JSON.stringify(jb))
		req.end()
	}

	var saveTestSet = async function(rds) {

		var d = JSON.parse(rds);

		var testset = d.success.data;
		var apikey = testset.api_key;
		var user_id = testset.user_id;
		var col_id = testset.col_id;
		
		var s = 'select * from adept.insert_testset('+user_id+','+col_id+',\''+apikey+'\')';
       
		var z = await dbCall(s);
    	return z;

	}

	var cur = await fetchCollections(u,c);

	if ( cur == null ) {
		res.sent('Error - collection not found');
	} else {

		var jb = {};
		jb.col_id = c;
		jb.user_id = u;
		jb.data = [];
		jb.data.push(cur.success.data[0]);
		
		try {
			var pr = await registerPost(jb);
		
		} catch(e) {
			console.log('register catch error '+e);
		}
	}			
}

async function registerDict(u,d) {

	var xddResponse = function(err, httpResponse, body) {
  
      if (err) {
			errObj = {"result": "Save error : " + err};
			console.log(' err response ' + err);
			return errObj;
           
        } else {
            jbody = {"result": "Upload response: " + body};
            return jbody;

        }
        
    }

	var registerPost = async function(jb,r) {
	
		var postlen = JSON.stringify(jb).length;
		var options = {
			hostname: 'xdddev.chtc.io',
			path: '/api/adept_request_testset?api_key=123-ABC',
      		port: 443, 
			method: "POST",
			body : jb,
			headers: {
			  'sendImmediately': true,
			  'content-type': "application/json",
        	  'content-length': postlen

			}
		};
     
		const req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`)
			res.on('data', d => {
				process.stdout.write(d);
                saveTestSet(d);
				process.stdout.write('AFTER SAVE');
			})
		})
		req.on('error', error => {
			console.error(error)
		});

		req.write(JSON.stringify(jb));
		req.end()
		

	}

	var saveTestSet = async function(rds) {

		var d = JSON.parse(rds);
	

		var testset = d.success.data;
		var apikey = testset.api_key;
		var user_id = testset.user_id;
		var col_id = testset.col_id;
		var s = 'select * from adept.insert_dictionary_testset('+user_id+','+col_id+',\''+apikey+'\')';
    
		var z = await dbCall(s);
    	return z;

	}

	var cur = await getLocalDicTerms(u,d);

	if ( cur == null ) {
		res.sent('Error - collection not found');
	} else {

		var SearchSets = [];

		for (k in cur.success.data ) {
			var dname =  cur.success.data[k].name;
			var ss = {
				"cs_id": cur.success.data[k].did,
				"col_desc": cur.success.data[k].name,
				"search_url": {
					"term": cur.success.data[k].term
				},
				"rec_count": 0
				}
			SearchSets.push(ss);
		}

		var jb = { "user_id": u,
					"col_id": d,
					"data": [
						{
							"col_id": d,
							"col_name": dname,
							"user_id": u,
							"proc_state": "new"
						}]
					};
		jb.data[0].search_set = SearchSets;

		try {
			var pr = await registerPost(jb);
		} catch(e) {
			console.log('register catch error '+e);
		}
	}
			
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

// START OFF ROUTES

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

	if ( vex >= 0 ) {	
		if ( p == 'role_id' || p == 'state' || p == 'password' ) {
		
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
	ua.did = req.query.i;
	ua.desc = req.query.d
	ua.cores = req.query.c;
	ua.memory = req.query.m;
	ua.checksum = req.query.s;
	ua.github_repo = req.query.g;
	ua.runtime = req.query.r;
	ua.testset = req.query.z;

	if ( gAdeptKey.includes(token) ) {
		var cur = await newUserApps(user_id, ua);
		if ( cur == null) {
			var nr = { Response : "No Response "}; 
            res.send(nr);   
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/delUserApp', async function( req, res) {
    var lp = '/adept/delUserApp';
    routelog(req, lp);

    var token = req.query.t;
    var app_id = req.query.a;

    if ( gAdeptKey.includes(token) ) {
        var cur = await removeUserApp(app_id);
        if ( cur == null) {
            res.send('No response');    
        } else {
            res.send(cur);  
        } 
    } else {
        res.send('Not authorized'); 
    }   
});

router.get('/runAppInstance', async function( req, res) {
    var lp = '/adept/runAppInstance';
    routelog(req, lp);

    var token = req.query.t;
    var u = req.query.u;
    var i = req.query.i;
    var n = req.query.n;
    var c = req.query.c;
    var m = req.query.m;
    var s = req.query.s;
    var d = req.query.d;

    if ( gAdeptKey.includes(token) ) {
        var cur = await execAppInstance(u,i,n,c,m,s);
        if ( cur == null) {
            res.send('{Response : "No response"}'); 
        } else {
            res.send(cur);  
        } 
    } else {
        res.send('{Response : "Not authorized"}');  
    }   

});

router.get('/getAppHistory', async function( req, res) {
    var lp = '/adept/getAppHistory';
    routelog(req, lp);
    
     var token = req.query.t;
     var a = req.query.a;
     
    if ( gAdeptKey.includes(token) ) {
        var cur = await fetchAppHistory(a);
        if ( cur == null) {
            res.send('{Response : "No response"}'); 
        } else {
            res.send(cur);  
        } 
    } else {
        res.send('{Response : "Not authorized"}');  
    }   
});


router.get('/getLocalDicTerms', async function( req, res) {
	var lp = '/adept/getLocalDicTerms';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var dict_id = req.query.d;

	if ( gAdeptKey.includes(token) ) {
		var cur = await getLocalDicTerms(user_id, dict_id);
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
    var colid = req.query.c;
    var memid = req.query.m;

	if ( gAdeptKey.includes(token) ) {
		//if ( typeof(memid) !== "undefined" ) {
		//	var cur = await fetchMemberCollections(memid);
		//} else {
			var cur = await fetchCollections(user_id, colid);
		//}
		
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
	var dt = req.query.dt
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await createNewLocalDict(user_id,dn, dt);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/newLocalDictTerm', async function( req, res) {
	var lp = '/adept/newLocalDictTerm';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var d = req.query.d;
	var dt = req.query.dt
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await addNewLocalDictTerm(user_id,d, dt);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/editLocalDictTerm', async function( req, res) {
	var lp = '/adept/editLocalDictTerm';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var dtid = req.query.d;
	var dval = req.query.dt
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await updateLocalDictTerm(user_id,dtid, dval);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/deleteLocalDictTerm', async function( req, res) {
	var lp = '/adept/delteLocalDictTerm';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var dt = req.query.dt
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await deleteLocalDictTerm(user_id, dt);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('Not authorized');	
	}	

});

router.get('/delLocalDict', async function( req, res) {
	var lp = '/adept/delteLocalDict';
	routelog(req, lp);

	var token = req.query.t;
	var user_id = req.query.u;
	var dt = req.query.d
	
	if ( gAdeptKey.includes(token) ) {
		var cur = await deleteLocalDict(user_id, dt);
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


router.get('/deleteCollectionSearch', async function( req, res) {
	var lp = '/adept/deleteCollectionSearch';
	routelog(req, lp);

	var token = req.query.t;
	var uid = req.query.u;
	var cid = req.query.c;
	var csid = req.query.s;

	if ( gAdeptKey.includes(token) ) {
		var cur = await delCollectionSearch(csid);
		if ( cur == null) {
			res.send('No response');	
		} else {
			res.send(cur);	
		} 
	}


});

router.get('/delRecordFromCollection', async function( req, res) {
    var lp = '/adept/delRecordFromCollection';
    routelog(req, lp);
 
    var token = req.query.t;
    var doi = req.query.d;
    var colid = req.query.i;

    if ( gAdeptKey.includes(token) ) {
        var cur = await deleteRecordFromCollection(colid, doi);
        if ( cur == null) {
            res.send('No response');    
        } else {
            res.send(cur);  
        } 
    } else {
        res.send('Not authorized'); 
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

router.get('/registerCollection', async function( req, res) {
	var lp = '/adept/registerCollection';
	routelog(req, lp);


	var token = req.query.t;
	var u = req.query.u;
	var colid = req.query.c;

	if ( gAdeptKey.includes(token) ) {

    	var cur = await registerTestSet(u, colid);
		if ( cur == null) {
			res.send('{"Data" : "No response"}');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('{"Data" : "Not Authorized"}');	
	}	

});

router.get('/loadDictionaries', async function( req, res) {
	var lp = '/adept/loadDictionaries';
	routelog(req, lp);
	var cur = await loadDict();
	res.send(cur);

});

router.get('/registerDictionary', async function( req, res) {
	var lp = '/adept/registerDictionary';
	routelog(req, lp);

	var token = req.query.t;
	var u = req.query.u;

	if ( gAdeptKey.includes(token) ) {

    	var cur = await registerDict(u, d);
		if ( cur == null) {
			res.send('{"Data" : "No response"}');	
		} else {
			res.send(cur);	
		} 
	} else {
		res.send('{"Data" : "Not Authorized"}');	
	}	

});

module.exports = router;


