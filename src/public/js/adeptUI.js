/* Adept Search tools 
   dev on test.geothermaldata.org
   GH - 10/15/20
*/
  
  // search results
  var gSRA = [];
  // publisher results
  var gPub = [{ "publisher": "p", "journals": 0, "articles": 0 }];
  // dataset return
  var gSet = [];
  // journals return
  var gJrn = [];
  var gjPage = 0;
  var gJSearch = "";
    
  var gDictList = [];
  var gTestSets = [];
  var gCollections = [];
  var gMemberCollections = [];
  var gSelCollection = {};
  var gMemberSelCollection = {};
  var gGrpSelColSearch =[];
   
  var gProcLog = [];
  var gApps = [];
  var gSelApp = {};
  var gGroups = [];
  var gOtherGroups=[];
  var gSelGrp = {};

  var gDLType = "";
  var gDict = {};
  var gSetInit = true;
  var gSelDict = {k : "", dict_id : "", count: 0 };
  var gdUrl='https://xdd.wisc.edu/api/v1';
  // find records header info
  var gFRHdr = {};

  // Article search terms
  var gSE = { term : "", 
              pubname: "", pubname_like: "", publisher: "", 
              title: "", title_like: "",
              dataset : "", lastname : "", firstname : "", 
              min_acquired: "", max_acquired: "",
              min_published: "", max_published: "",
              recent: "",
              max : "",   
              docid: "", doi: ""
            }
  var gT;
     
  var gSavedGuids=[];
							 
  var gKey = {"a":"b"};
  var gAuth = { "loginBtn" : "userLogin" };
  var gMenuSel = 's';
  var gVersions = [];
  var gEdState = 'off';
  var gkwid=-1;
 
  var gUser = {};
  var gUsers = [];
  var gSelUser = {};
  
  function showSeaHis() {

    $("#sHistoryItems").empty();
    var uflag = false;

    if ( gSelCollection && gSelCollection.col_k >= 0 ) {
      $("#shTitle").text("Saved Set Searches "+ gSelCollection.col_name);
      uflag = true;
      var k =gSelCollection.col_k;
      if ( gCollections[k].search_set ) { 
        for (z in  gCollections[k].search_set ) {
            var i = gCollections[k].search_set[z].cs_id;
            var u = gCollections[k].search_set[z].search_url;
            var c = gCollections[k].search_set[z].rec_count;

            var jst = JSON.parse(u);
            var pstr = '';
            var mStr = '';
            Object.keys(jst).forEach(key => {
              if ( key == 'term') {
                mStr = 'Search <b>'+jst[key]+'</b> ( '+c+' )';
              }
              pstr = pstr + key.toUpperCase() + ': ' + jst[key] + ' ';
            });
            var fa = $('<i class="fa fa-search" style="font-size:10px;"></i>')
            var st = $('<a id="sc-'+z+'" title="'+pstr+'" class="sh-item" onclick="selectHistoryItem(this);" >'+mStr+'</a>')
            .css("font-size","12px; ")
            .css("margin","4px 2px;")
            .css("background-color", "rgb(188, 204, 204)" );
            $("#sHistoryItems").append(fa);
            $("#sHistoryItems").append(st);
            $("#sHistoryItems").append('</br>');
        }
      }
      $("#SearchHistory").css("display","block");
    
    } 

    if ( gSelDict.count > 0 ) {
      if ( uflag ) {
        $("#sHistoryItems").append("<b>Dictionary "+ gSelDict.name + '</b></br>');
      } else {
        $("#shTitle").text("Dictionary "+ gSelDict.name);
        uflag = true;
      }
     
      var px = 0;
      Object.keys(gDict)
        .forEach(key => {
          var st = $('<a id="dl-'+key+'" class="sh-item" style="font-size:12px; margin: 2px 2px;" onclick="selectHistoryItem(this);" >'+key+'</a>'); 
          var rc = $('<span class="sh-item" style="font-size:12px; float: right; margin: 0px 80px;" " >( '+gDict[key]+' )</span></br>'); 
          if ( px < 300 ) { 
          $("#sHistoryItems").append(st);
          $("#sHistoryItems").append(rc);
          }    
          px++;
        });
        $("#SearchHistory").css("display","block");
    } else {
      if ( uflag ) {
        $("#sHistoryItems").append('<b>Search Term History</b></br>');
      } else {
        $("#shTitle").text('Search Term History');
      }
     
      
      for (k in gSearchHistory) {
        var hs = gSearchHistory[k];
      if ( hs ) {
          var st = '<i class="fa fa-trash-alt" id="cl-'+k+'" onclick="selHisDel(this)" style="font-size:9px;"></i><a id="sh-'+k
                    +'" class="sh-item" style="font-size:12px; margin: 2px 2px;" onclick="selectHistoryItem(this);" >'+hs+'</a></br>';
          $("#sHistoryItems").append(st);
      }
      }
      $("#SearchHistory").css("display","block");

    }
    
  }
 
  function kmu(o) {
	   for (var k in o) {
        if (o[k] == k) {
          return k;
        }
	   }
	   return null;
	}

  function userMenu() {
	
	if ( kmu(gKey) && gKey.agentRole == "1"  ) {
		$("#Cex").show();
		if ( gMenuSel == 's' ) {
			$("#Cex").show();
		} else if ( gMenuSel == 'r' ) {
			$("#widget-view").empty();
			recordTemplate(gT, gKey);
		} else if ( gMenuSel == 'm' ) {
			console.log('logged in whlie viewing map');
			
		}
		
	} else if ( kmu(gKey) && gKey.agentRole == "4"  ) {
		if ( gMenuSel == 's' ) {
			$("#Cex").hide();
		} else if ( gMenuSel == 'r' ) {
			$("#widget-view").empty();
			$("#leftMDRecord").show();
			recordTemplate(gT, gKey);
		} else if ( gMenuSel == 'm' ) {
			console.log('logged in while viewing map');
			
		}
	} else {
		// logging out
		if ( gMenuSel == 's' ) {
			$("#Cex").hide();
		} else if ( gMenuSel == 'r' ) {
			 $("#widget-view").empty();
			recordTemplate(gT, gKey);
		} else if ( gMenuSel == 'm' ) {
			console.log('logged in whie viewing map');	
		}
	}
	
}

  function selectHistoryItem(o) {
    // if its typeahead append, if its search history replace
    if (o.id.substr(0,2) == 'ta') {
      var tbx = o.text;
      var ng =  $("#gSearchBox").val(); 
      $("#gSearchBox").val(ng.slice(0,-gTApre.length)+tbx);
    } else if ( o.id.substr(0,2) == 'dl' ) {
      var tbx = o.id.substr(3);
      $("#gSearchBox").val(tbx);
    } else if ( o.id.substr(0,2) == 'sc' ) {
      var ix = o.id.substr(3);
      var u = gCollections[gSelCollection.col_k].search_set[ix].search_url;
      applySearch(u);



    } else {
      var tbx = o.text;
      $("#gSearchBox").val(tbx);
    }
    
    findRecords(0);
    $("#SearchHistory").css("display","none");
  }

  function selHisDel(o) {
    var k = o.id.substr(3);
    gSearchHistory.splice(k,1);
    var shs = gSearchHistory.sort().join('|');
    localStorage.setItem("adSearchHistory",shs);
    showSeaHis();
  }

  function clearHistory() {
    $("#gSearchBox").val('');
    gSearchHistory=[];
    localStorage.setItem("adSearchHistory","");
    $("#sHistoryItems").empty();
    clearSearch();
  }

  function showContact(o) {
    
  
    var h = $('<h4> Email: contact@geodeepdive.org </h4>')
                    .css("margin-top", "8px")
                    .css("margin-bottom", "10px")
                    .css("text-align", "center")
                    .css("padding","2px 2px");

    var sBtn =   $('<a id="surlbtn" class="res-tag" >Close</a>')
                    .css("font-size", "14px")
                    .css("margin-top", "6px")
                    .css("margin-left", "125px")
                    .css("padding","2px 2px")
                    .css("background-color", "#0971B2" )
                    .attr('onclick','closeUrl(this);');

    var conDiv = $('<div class="dijitTitlePaneTextNode" id="sdinx"></div>')
                    .css('background-color','#ffffff') 
                    .css('margin','auto')
                    .css("width", "98%")
                    .css("height", "96%")
                    .css('border-style','solid')
                    .css('border-color','#aaaaaa')
                    .css('position','relative');   
                     
    var urlDiv = $('<div class="dijitTitlePaneTextNode" id="showUrl"></div>')
                    .css('background-color','#cccccc')
                    .css('position','absolute')
                    .css('top','120px')
                    .css('margin','0')
                    .css('left','700px')
                    .css('width','300px')
                    .css('height','100px');            

    conDiv.append(h);             
    conDiv.append('</br>');
    conDiv.append(sBtn);
    urlDiv.append(conDiv);
    urlDiv.appendTo(document.body);

  }


  function closeUrl(o) {
    $("#showUrl").remove();
  }

  function showSearchUrl(o) {
    
    var srch=searchSettings();  
    var sUrl = gdUrl + '/articles?full_results';
    if ( srch.length )  {
      sUrl = sUrl + srch;
    }

    var zw = sUrl.length*7;
    if ( zw < 400 ) { zw = 400; }
    var zs = zw+'px';
    var h = $('<h5>Search Url</h5>')
                    .css("margin-top", "8px")
                    .css("margin-bottom", "10px")
                    .css("text-align", "center");
                    

    var p = $('<a href="'+sUrl+'" target="blank_" >'+sUrl+'</a>')
              .css("margin-left", "10px")
              .css("margin-bottom", "8px");

    var sBtn =   $('<a id="surlbtn" class="res-tag" >Close</a>')
                    .css("font-size", "12px")
                    .css("margin-top", "10px")
                    .css("margin-left", "160px")
                    .css("padding","2px 2px")
                    .css("background-color", "#0971B2" )
                    .attr('onclick','closeUrl(this);');

    var uriDiv = $('<div class="dijitTitlePaneTextNode" id="sdinx"></div>')
                  .css('background-color','#ffffff') 
                  .css('margin','auto')
                  .css("width", "98%")
                  .css("height", "96%")
                  .css('border-style','solid')
                  .css('border-color','#aaaaaa')
                  .css('position','relative');

    var urlDiv = $('<div class="dijitTitlePaneTextNode" id="showUrl"></div>')
                  .css('background-color','#cccccc')
                  .css('position','absolute')
                  .css('top','120px')
                  .css('margin','0')
                  .css('left','100px')
                  .css('width',zs)
                  .css('height','100px');
                

    uriDiv.append(h);             
    uriDiv.append(p);
    uriDiv.append('</br>');
    uriDiv.append(sBtn);
    urlDiv.append(uriDiv);
    urlDiv.appendTo(document.body);
   

  }


  function closeUrl(o) {
    $("#showUrl").remove();
  }

  function saveSearch(o) {

    var bp = $("#saveSearchBtn").position();
    var popSave = $('<div id="popSave"></div>')
                .css('top',bp.top)
                .css('left',bp.left)
                .css('width','250px')
                .css('background-color','rgb(208, 230, 240)')
                .css('border-radius','5px')
                .css('border-color','#0971B2')
                .css('border','1px')
                .css('position','absolute')
                .css('display','block');

    $("body").append(popSave);

    var saveLabel = $('<span>Select Set to Save Search To</span>')
              .css("font-family","calibri")
              .css("font-weight","bold")
              .css("margin","4px 4px")
              .css("font-size","12px");

    popSave.append(saveLabel);
    popSave.append('</br>');

    var selSet = $('<select id="selSearchSet"></select>')
                .css("font-family","calibri")
                .css("font-weight","bold")
                .css("border-style","solid 1px")
                .css("margin","4px 4px");

    popSave.append(selSet);

    var sBtn =  $('<a id="saveSearchBtn" class="res-tag" >Save</a>')
                .css("font-size", "12px")
                .css("margin", "2px")
                .css("padding","2px 2px")
                .css("background-color", "#0971B2")
                .attr('onclick','saveSearchSetup(this);');

    var sCan =  $('<a id="cancelSaveBtn" class="res-tag" >Cancel</a>')
                .css("font-size", "12px")
                .css("margin", "2px")
                .css("padding","2px 2px")
                .css("background-color", "#0971B2")
                .attr('onclick','cancelSaveSearch(this);');

    popSave.append(sBtn);
    popSave.append(sCan);

    var init = 0;
    if ( gCollections ) {
      for (z in gCollections ) {
        var so = $('<option value="'+gCollections[z].col_id+'">'+gCollections[z].col_name+'</option>')
                .css("font-family", "calibri");
        if ( init == 0 ) {so.attr("selected","selected"); }
        selSet.append(so);
      }
    }
    
}

function cancelSaveSearch(o) {
      $("#popSave").remove();
}

function saveSearchSetup(o) {
  var selSetId = $("#selSearchSet option:selected").val();   
  var found = false; 
  for (z in gCollections ) {
    if ( gCollections[z].col_id == selSetId ) {
      gSelCollection =  gCollections[z];
      gSelCollection.col_k = z;
      found = true;
      saveSearchToCollection(o);
      $("#popSave").remove();
    }
  }
  
}

  function OLDsaveSearch(o) {

    if ( kmu(gKey) ) {
      if ( gSelCollection.col_id ) {
        //var srch=searchSettings();
       // var srch=JSON.stringify(gSE);

       var srch = '?';
        var inx = 0;

        Object.keys(gSE).forEach(key => {
          if ( gSE[key].length > 0 ) {
            if ( inx == 0 ) {
              var sps = key+'='+gSE[key];
            } else {
              var sps = '&'+key+'='+gSE[key];
            }
            srch=srch+sps;
          }
        });

        var sUrl = gdUrl + '/articles?full_results';
        if ( srch.length )  {
          sUrl = sUrl + srch;
          console.log('Search URL '+sUrl);
        }
        sUrl = encodeURIComponent(sUrl);
        saveSearchToCollection(sUrl);

      } else {
        alert('Please select a set to save the search ');
      }
      
    } else {
      alert('Please log in to save search');
    }
  }

  function saveMD(o){
    // save individual record to collection

    if ( o.text == 'Save' ) {
      if ( kmu(gKey) ) {
        if ( gSelCollection.col_id ) {
          var oid = o.id.substr(3);
          var mdv = gSRA[oid];
          var doi = mdv.identifier[0].id;
          var id = mdv._gddid;
          var zx = saveRecordToCollection(id);
          o.text = 'Clear';
          o.style.backgroundColor= "#21b229";
        } else {
          alert('Please select a collection in My Data to save the record ');
        }
      } else {
        alert('Please log in to save record');
      }
    } else {
      // need to delete records here
       
      var oid = o.id.substr(3);
      var mdv = gSRA[oid];
      var doi = mdv.identifier[0].id;
      var id = mdv._gddid;
 
      var zx = deleteRecFromCollection(id);


      o.text = 'Save';
      o.style.backgroundColor="#0971b2";
    }

    
  }

  function getTA() {
    var tUrl = '/action/typeAhead?q='+gTApre;
    var jqxhr = $.get(tUrl, function() {
      console.log( "typeahead success ..." );
    })
    .done(function(data) { 
      if (typeof(data) == "object" ) {
        var dres = data;
      } else {
        var dres = JSON.parse(data);
      }
       var dx = dres.rows; 
       $("#shTitle").text("Keywords");
       $(".ta-item").each(function() { $(this).remove() })
       gTA = [];
       for (var i in dx) {
          var xtm = dx[i];
          var k = gSearchHistory.length + i;
          gTA.push(xtm.rex);

          var st = '<a id="ta-'+i+'" class="ta-item" style="font-size:12px;" onclick="selectHistoryItem(this);" >'+xtm.rex+'</a></br>';
          $("#sHistoryItems").append(st);
       }
       $("#SearchHistory").css("display","block");
    });

  }


function showSaved(o) {

  $("#rec-results").empty();

    var k = gSelCollection.col_k;
    var z = gSelCollection.sid;
    var so = gCollections[k].search_set[z].search_url;
 
  applySearch(so);
  findRecords(0);

}


function OLDshowSaved(o) {
    var sTerm =  $("#gSearchBox").val();
    var guidA=[];
    var showState = $("#shoSavBtn").text();
    var keez = Object.keys(localStorage);
    if ( showState == 'Saved' ) {
      $("#shoSavBtn").text('All');
      if ( sTerm ) {
        // this doesnt really work, search terms wont show up in saved record values!
        // just bring then all back
        for (k in keez) {
          var key = keez[k];
          if (key != "SearchHistory" && key != "gDataMapBounds") {
              guid = key.substr(3);
              guidA.push(guid);  
          }
        }      

      } else {
        for (k in keez) {
            var key = keez[k];
            if (key != "SearchHistory" && key != "gDataMapBounds") {
                guid = key.substr(3);
                guidA.push(guid);  
            }
        }
 
      }
      if (guidA) {
        var guidStr = guidA.join(',');
        findRecords(0,guidStr);
      } else {
        alert ('No locally bookmarked records found !');
      }
    } else {
      $("#shoSavBtn").text('Saved');
      findRecords(0);
    } 
   
 }

function searchData(yorn) {
    // Setup function
    
	  gMenuSel = 's';
  
    $("#leftSearch").show();
    $("#cb").show();
    $("#cb-title").html("Search Results");

    $("#leftUserData").hide();
    $("#rightUserData").hide();

    $( "#datepicker" ).datepicker();
    if ( !yorn ) {
      $("#rec-results").empty();
      findRecords(0);
    }
}

function savedData(o) {
  // after user login the My Data
  $("#leftSearch").hide();
  $("#cb").hide();
  $("#widget-box").hide();

  $("#leftUserData").show();
  $("#rightUserData").show();
  $("#rud-help").show();
  $("#rud-results").empty();
  
  if ( gUser.role_id == 1 ) {
    $("#ugbtn").show();
  } else {
    $("#ugbtn").hide();
  }
  $("#uploadbtn").hide();

}

function recentClk(o) {
  console.log(o.id);

  if ( gSE.recent == 'true' ) {
    o.text = "Recent - Off";
    gSE.recent = "";
  } else {
    o.text = 'Recent - Active';
    gSE.recent = "true";
  }


}

var searchSettings = function() {

  var searchStr = "";
 
  gSE.term = $("#gSearchBox").val();

  if ( $("#pubWildBtn").css("background-color") == "rgb(9, 113, 178)" ) { 
    gSE.pubname = $("#gPubName").val();  
    gSE.pubname_like = "";
  } else {
    gSE.pubname = "";
    gSE.pubname_like = $("#gPubName").val();
  }

  if ( $("#titleWildBtn").css("background-color") == "rgb(9, 113, 178)" ) {
    gSE.title = $("#gSearchTitle").val();  
    gSE.title_like = "";
  } else {
    gSE.title_like = $("#gSearchTitle").val();
    gSE.max = "500";
    gSE.title = "";
  }
 
  gSE.doi = $("#gSearchDOI").val();
  gSE.docid = $("#gSearchDocid").val();
  gSE.firstname = $("#gAFName").val();
  gSE.lastname = $("#gALName").val();

  gSE.min_acquired =  $("#mindA-datepicker").val() ;
  gSE.max_acquired =  $("#maxdA-datepicker").val() ;
  gSE.min_published = $("#mindP-datepicker").val() ;
  gSE.max_published =  $("#maxdP-datepicker").val();
 
  Object.keys(gSE).forEach(key => {
    if ( gSE[key] ) {
      if ( key == 'recent' && gSE[key] == 'true' ) {
        searchStr = searchStr+'&max=500&'+key;
      } else {
        searchStr = searchStr+'&'+key+'='+ gSE[key];
      }
    }
  });

  return searchStr;
}

var applySearch = function(o) {

  if ( o ) {
    clearSearch();
    //var jst = JSON.parse(o);
    if (typeof(o) == "object" ) {
      var jst = o;
    } else {
      var jst = JSON.parse(o);
    }

    Object.keys(jst).forEach(key => {
      gSE[key] = jst[key];
    });

  }

  if ( gSE.term ) { $("#gSearchBox").val( gSE.term ); }
  if ( gSE.title ) { $("#gSearchTitle").val( gSE.title ); }
  if ( gSE.pubname ) { $("#gPubName").val( gSE.pubname ); }

  if ( gSE.firstname )  { $("#gAFName").val(gSE.firstname); }
  if ( gSE.lastname )  { $("#gALName").val(gSE.lastname); }


}

var clearSearch = function(o) {
  $("#gSearchBox").val("");
  $("#gPubName").val("");
  $("#gSearchTitle").val("");
  $("#mindA-datepicker").val("");
  $("#maxdA-datepicker").val("");
  $("#mindP-datepicker").val("");
  $("#maxdP-datepicker").val("");
  $("#gSearchDOI").val("");
  $("#gSearchDocid").val("");
  $("#gAFName").val("");
  $("#gALName").val("");
  $(".npv").css("background-color","#ffffff");
  $(".nsv").css("background-color","#ffffff");
  $(".ndv").css("background-color","#ffffff");
  $("#recBtn").text("Recent - Off");

  Object.keys(gSE).forEach(key => {
    gSE[key] = "";
  });

}

var dtm =function(o) {
  if ( o.length ) {
    var k = o.split('-');
    return k[0]+'-'+k[2];
  } else {
    return o;
  }

}

function findRecords(page,g) {

  /*if (  init == true) {
    gSE.dict = gDefaultDict;
  }*/
  if ( !page ) { page = 0 }
  if ( page == 0 ) {
    var srch=searchSettings();
    gSearchType = 'text';
    
    if (  gSearchHistory.indexOf(gSE.term.trim()) == -1 ){
      gSearchHistory.push( gSE.term.trim() );
      var shs = gSearchHistory.sort().join('|');
      localStorage.setItem("adSearchHistory",shs);
    }
    var sUrl = gdUrl + '/articles?full_results';
    if ( srch.length )  {
      sUrl = sUrl + srch;
    }
    var dx =  new Date();
    console.log(sUrl + dx.getTime());
    $("#cb-title").html('Search Results for ( ' + spF(gSE.term) + ' ) ');
    $("#rec-results").css("background-color", "#ffffff").empty(); 
    var jqxhr = $.get(sUrl, function() {
      var ssu = 'success findrecords'; 
    })
    .done(function(data) { 
        //spinner.stop();
        //$("#rec-results").css("background-color", "white");
        console.log('-->> '+dx.getTime());
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        
        gSRA = dres.success.data;
        gFRHdr.resCount = dres.success.hits;
        gFRHdr.recRtn = gSRA.length;
        gFRHdr.nextPage = dres.success.next_page;

        if ( gSRA.length > 0 ) {
          findTemplate(page);
        } else {
          $("#cb-title").append(' - No records found </br>');
          $("#cb").show();
          $("#widget-box").hide();

        }
      
    });

  } else {
    findTemplate(page);
  }

  if ( init == true) {
    facetPub();
    facetSet();
    facetDict();
    init = false;
  }

}

function spF(x) {

  var fi = '<span class="spf">'+x+'</span>';
  return fi;

}

function findTemplate(page) {

  var gSp = page*pgSize;
  var displaying = gSp + pgSize;

  $("#cb").show();
  $("#widget-box").hide();
  var srx = '';
  if ( gSE.term ) { srx = 'Term '+ spF(gSE.term) }
  if ( gSE.pubname ) { srx = srx + ' Journal '+spF(gSE.pubname) }
  if ( gSE.pubname_like  ) { srx = srx + ' Journal* '+spF(gSE.pubname_like) }
  if ( gSE.title ) { srx = srx + ' Title '+spF(gSE.title) }
  if ( gSE.title_like  ) { srx = srx + ' Title* '+spF(gSE.title_like) }
  if ( gSE.lastname ) { srx = srx + ' Author '+ spF(gSE.firstname + ' ' +gSE.lastname) }

  $("#cb-title").html("Search Results for ( " + srx + " )</br>Displaying "+gSp+'-'+displaying +" of records: "+ gFRHdr.resCount)
    .css("height", "16px" )
    .css("padding","4px 4px")
    .css("color", "#222222")
    .css("margin", "4px")
    .css("font-size", "14px")
    .css("font-weight", "bold");

  var prv = $('<button class="arrow-button" id="pgPrev" onclick="pager(this)"> &lt; </button>');
  var pcnt = $('<span class="dijitTitlePaneTextNode" style="margin:5px" id="pgCnt">Page ' + sPage + '</span>');
  var pnxt = $('<button class="arrow-button" id="pgNext" onclick="pager(this)"> &gt; </button></br>');

  $("#cb-page").empty().css("margin-left","40px");
  $("#cb-page").append(prv);
  $("#cb-page").append(pcnt);
  $("#cb-page").append(pnxt);
  $("#cb-page").show();
  
  $("#rec-results").css("background-color", "#ffffff").empty(); 
  if ( gSRA.length > gSp ) {
    if ( gSRA.length > gSp+pgSize ) { 
      var mr = gSp+pgSize 
    } else {
      var mr = gSRA.length;
    }
    for (var i = gSp; i < mr; i++) {
      var xtm = gSRA[i];
      var gs = xtm._gddid;           
      var ct = xRClean(xtm.title);
    
      if ( xtm.link ) {
        var linkz =  xtm.link;
      }

     // var savd = localStorage.getItem('sr-'+gs);
      var bt = 'Save';
      var bc =  "#2191c2";
      

      if ( gSelCollection.record_set) {
            for ( z in gSelCollection.record_set ) {
                if ( gs == gSelCollection.record_set[z] ) {
                    bt = 'Clear';
                    bc = '#21b229'
                }
            } 
     }
    
      var sBtn =   $('<a id="sr-'+i+'" class="res-tag" >'+bt+'</a>')
                    .css("font-size", "14px")
                    .css("margin", "2px")
                    .css("padding","2px 2px")
                    .css("background-color", bc)
                    .attr('onclick','saveMD(this);');

      var cInfo = $('<a id="'+i+'" >'+ct+'</a>')
                  .css("height", "16px" )
                  .css("margin", "2px")
                  .css("padding","2px 2px")
                  .css("font-size", "18px")
                  .css("font-weight", "bold")           
                  .css("cursor","pointer")
                  .attr('onclick','javascript:mdView(this);');
                  
      var gLinks = $('<div>').css("margin", "10px" )
              .css("width", "700px");
      if ( linkz ) {
      
        if ( linkz.length == 1 ) {
          var ltype =linkz[0].type;
          var lurl = linkz[0].url;
        
          var rlab = $('<span>Link: </span>')
                .css("padding","2px")
                .css("margin","2px")
                .css("font-size", "12px");
          var rLL = $('<a href="'+ lurl + '" class="resource-item" target="_blank">' + ltype + '  ' + lurl + '</a></br>');

          gLinks.append(rlab);
          gLinks.append(rLL);
        } else {
          var rlab = $('<span>Links: </span>')
                      .css("padding","2px")
                      .css("margin","2px")
                      .css("font-size", "12px");
          var drl = $('<select id="rld-'+i+'">')
                      .attr("onchange","window.open(this.options[this.selectedIndex].value);")
                      .attr("onfocus","this.selectedIndex= -1;")
                      .css("width","440px");
                    
          for (i in linkz ) {
        
            var ltype = linkz[i].type;
            var lurl =  linkz[i].url;

            var rldo = $('<option title="'+lurl+'" value="'+lurl+'">'+ltype+' '+ lurl+ '</option>');
            drl.append(rldo);

          }
          gLinks.append(rlab);
          gLinks.append(drl);
          
        }
      }

      var cJ = $('<span>Publisher: ' + xtm.publisher+' Journal '+xRClean(xtm.journal)+' Vol: '+xtm.volume+' Pages: '+xtm.pages+'</span>')
                  .css("padding","5px 2px")
                  .css("margin","5px 5px")
                  .css("font-size", "14px");
    
      var idS = "";
      if ( xtm.identifier && xtm.identifier.length ) {
        for ( var k in xtm.identifier) {
          var rit =xtm.identifier[k].type;
          var rid =xtm.identifier[k].id;
          idS=idS+' '+rit+' : '+rid;
        }
      } else {
        console.log('missing id at '+i);
        idS = " Not Found";
      }
      var cGuid = $('</br><span>Identifier: '+idS+'</span>')
                  .css("padding","2px 2px")
                  .css("margin","5px 5px")
                  .css("font-size", "14px");

      var gCard = $('<div id ="gCard-' + i + '" class="g-item-card" />')
          .css("margin", "5px" )
          .css("padding","2px 2px")
          //.css("border","solid")
          .css("background-color", "white" )
          .hover(function() { 
              $(this).css("background-color", "powderblue"); 
              var mic =  'mid-'+$(this).attr("id").substr(6);              
            
            }, function() { 
                $(this).css("background-color", "white"); 
                var mic =  'mid-'+$(this).attr("id").substr(6);  
            });                    
      $(gCard).append(sBtn);        
      $(gCard).append(cInfo);
      $(gCard).append('</br>');
      $(gCard).append(cJ);

      $(gCard).append(cGuid);
      $(gCard).append(gLinks);
      $("#rec-results").append(gCard);           
    }
  } else {
    console.log('empty');
  }

}

function preview(o) {
    window.open(o.value);
}


  function xmlToJson(xml) {
	
    // Create the return object
    var obj = {};
  
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
  
    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  function pager(o) {
    if ( o.id == 'pgPrev') {
      if ( sPage > 0 ) {
        sPage--;
        findRecords(sPage);
      }
    }
    if ( o.id == 'pgNext') {
      sPage++;
      findRecords(sPage);
    }

  }

  function bactoSearch() {
    // add back btn event capture
    gMenuSel = 's'; 

    if ( $( "#pgjPrev" ).length ) {
      $( "#pgjPrev" ).remove();
      $( "#pgjPrev" ).remove();
      $( "#pgjCnt" ).remove();
    }

    $("#leftSearch").show();
    $("#cb").show();
    
    $("#widget-box").hide();
    $("#leftUserData").hide();
    $("#rightUserData").hide();

  }

  function xRClean(ds) {
    while(ds.charAt(0) == '"') { 
      ds = ds.substr(1); 
    }
    var Z = ds.charAt(ds.length-1);
    while(ds.charAt(ds.length-1) == '"') { 
      ds = ds.slice(0,-1); 
    }
    return ds;
  }

  function mdView(obj) {
    // view a single record
	  gMenuSel = 'r'; 
  	var guid = obj.id;
	
    $("#cb").hide();
  	$("#widget-box").show();
    $("#widget-view").empty();

    $("#leftUserData").hide();
    $("#rightUserData").hide();

    var mdv = gSRA[guid];
    
    if ( mdv ) {
      $("#widget-title").text('/ Dataset');
      recordTemplate(mdv);
    }
    
  }

  function topper() {
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth'
    });
  }

  // display detail record
  function recordTemplate(ro, gKey) {

    var gTitle = $('<div id="tidiv">')
          .css("margin", "4px" )
          .css("font-size", "16px" )
          .css("background-color", "slate" );
      
    gTitle.append('<h2 id="mdt" style="font-size: 16px; display: inline;" >'+ ro.title + '</h2>');

    var gResources =  $('<div id="resdiv">')
                  .css("margin", "2px" )
                  .css("background-color", "slate" );

    gResources.append('<h2 style="font-size: 14px; display: inline;">Resource Links</h2></br>');
    for ( var k in ro.link) {
        var rlink = ro.link[k].url;
        var rtype = ro.link[k].type;
        var rLL = $('<label class="md-label">'+rtype+'</label><a id="rn-'+k+'" href="'+rlink+'" class="resource-item" target="_blank">'+rlink+'</a>');
        gResources.append(rLL);
    }

    var gAuthor = $('<div id="mdAuthor" >')
                  .css("margin", "2px" )
                  .css("background-color", "slate" );

    gAuthor.append('<h2  style="font-size:14px; display: inline;" >Author</h2></br>');

    for ( var k in ro.author) {
        var rAuth = ro.author[k].name;
        var rAN = $('<a id="'+rAuth+'" onclick="authFind(this)" class="tag">' + rAuth + '</a>');
        gAuthor.append(rAN);
    }

    var gPubInfo = $('<div id="mdPub" >')
                  .css("margin", "2px" )
                  .css("background-color", "slate" );

    gPubInfo.append('<h2 style="font-size:14px; display: inline;" >Publication</h2></br>');
   
    gPubInfo.append('<label class="md-label">Publisher: </label><span id="pubname" class="md-value" >'+ ro.publisher + '</span></br>');
    var publink = $('<label class="md-label">Journal: </label><a id="'
    +ro.journal+'" onclick="pubFind(this)" class="tag">'+ro.journal+'</a></br>');
    gPubInfo.append(publink);
   
    gPubInfo.append('<label class="md-label">Type: </label><span id="mdtype" class="md-value" >'+ ro.type + '</span></br>');
    gPubInfo.append('<label class="md-label">Volume: </label><span id="mdvol" class="md-value" >'+ ro.volume + ' Number: ' + ro.number+'</span></br>');
    gPubInfo.append('<label class="md-label">Year: </label><span id="mdyear" class="md-value" >'+ ro.year + '</span></br>');
    gPubInfo.append('<label class="md-label">Pages: </label><span id="mdpages" class="md-value" >'+ ro.pages + '</span></br>');

    for ( var k in ro.identifier) {
      var rit = ro.identifier[k].type;
      var rid = ro.identifier[k].id;
      gPubInfo.append('<span id="ident-'+k+'" class="md-value" >'+ rit + ' : ' + rid +'</span></br>');
      if ( rit == 'doi') {
        var doix = rid;
      }
      if ( rit == 'docid') {
        var docid = rid;
      }

    }

    $("#widget-view").append('</br>');
    $("#widget-view").append(gTitle);
    $("#widget-view").append('</br>');
    $("#widget-view").append(gPubInfo);
    $("#widget-view").append('</br>');
    $("#widget-view").append(gAuthor);
    $("#widget-view").append('</br>');
    $("#widget-view").append(gResources);

    if ( gSE.term.length ) {
      var hla = getSnippets(doix);
    }

    if ( gSE.dict ) {
      if ( gSE.dict.length ) {
        var dta = getDictTerms(doix);
      }
    }
}

var getSnippets = function(doi) {

  var z = [];
  var sUrl = gdUrl+'/snippets?term='+gSE.term+'&doi='+doi+'&fragment_limit=10';

  var jqxhr = $.get(sUrl, function() {
    var ssu = 'success snippet'; 
  })
  .done(function(data) { 

        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        
        var saz = dres.success.data[0];
        if ( saz.highlight ) {
          var hla = saz.highlight;
          var snipDiv = $('<div id="mdSnippet" >')
                  .css("margin", "2px" )
                  .css("padding", "5px")
                  .css("background", "slate" );

          snipDiv.append('<h2 style="font-size:14px; margin-bottom: 10px" >Text Highlights</h2>');
          //snipDiv.append('</br>');

          for (k in hla) {
            var hls = $('<span>[ '+ hla[k] +' ]</span>').css("margin-top", "10px");
            snipDiv.append(hls);
            snipDiv.append('</br>');
          }
          $("#widget-view").append('</br>');
          $("#widget-view").append(snipDiv);

        }
        
  });

}

var getDictTerms = function(doi) {

  var z = [];
  var sUrl = gdUrl+'/articles?dict='+gSE.dict+'&doi='+doi;

  var jqxhr = $.get(sUrl, function() {
    var ssu = 'success known terms'; 
  })
  .done(function(data) { 

        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        
        var ktr = dres.success.data[0];

        if ( ktr.known_terms ) {
          var kto = ktr.known_terms[0];
          var kta = kto[gSE.dict];
          if ( kta.length > 0 ) {
            var ktDiv = $('<div id="mdKnownTerms" >')
                  .css("margin", "2px" )
                  .css("padding", "5px")
                  .css("background", "slate" );
          
            ktDiv.append('<h2 style="font-size:14px; margin-bottom: 10px" >Known terms in <i>'+gSE.dict+'</i> dictionary</h2>');

            for (k in kta) {
              var kts = $('<a id="'+ kta[k]+'" onclick="ktFind(this)" class="tag">' +  kta[k] + '</a>');
            //var kts = $('<span>[ '+ kta[k] +' ]</span>').css("margin-top", "10px");
              ktDiv.append(kts);
  
            }
            $("#widget-view").append('</br>');
            $("#widget-view").append(ktDiv);

          }
          

        }
        
  });

}

var ktFind = function(o) {

  if (o.id) {
    $("#gSearchBox").val(o.id);

  }

}
  // In record view, parse the author name and add to search 
  var authFind = function(o) {
    if ( o.id ) {
      var pn = o.id.split(',');
      var ln = pn[0];
      var fn = pn[1].trim();
      if ( fn.indexOf('.') > 1 ) {
        fn = fn.slice(0,-3);
      }

      $("#gAFName").val(fn);
      $("#gALName").val(ln);
      $("#search-tool-div").show();

    }
  }

  var pubFind = function(o) {
    if ( o.id ) {
      $("#gPubName").val(o.id);
      $("#search-tool-div").show();
    }
  }


var showSpinner = function(o)  {
    var target = $("#rec-results");
    var spinner = new Spinner(opts).spin(target);
}


var wildcard = function(o) {

    console.log($(o).css("background") + ' A  -' + $(o).css("background-color") + '- B ' + $(o).html() );

    if ( $(o).css("background-color") == "rgb(9, 113, 178)" ) {
      $(o).css("background-color", "green");
      $(o).html('<i class="fa fa-star-of-life"></i>');
    } else {
      $(o).css("background-color", "#0971B2");
      $(o).html('<i class="fa fa-equals"></i>');

    }
}

// acquires the list of publishers
var facetPub = function(o) {
  var pUrl = gdUrl+'/publishers?all';

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success pubrecords'; 
  })
  .done(function(data) { 

        $("#rec-results").css("background-color", "white");
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        gPub = dres.success.data;
        facetPubView();
        $("#PubList").hide();
  });

}

var optionView = function(o) {

  if ( o.id == 'opt-search-field') {
    $("#search-tool-div").toggle();
  } else if (  o.id == 'date-tool-div' ) {
    $("#date-select-div").toggle();
  } else if (  o.id == 'pubview' ) {
    $("#PubList").toggle();
  }  else if (  o.id == 'jrnView' ) {
     // not used currently
  } else if ( o.id =='setview') {
    $("#SetList").toggle();
  } else if ( o.id == 'dictview') {
    $("#DictList").toggle();
  }

}

// Publisher list functions
var facetPubView = function() {

  $(".npv-category").each(function() {
    $( this ).remove();
  })

  for (k in gPub) {
    var p = gPub[k].publisher;
    var j = gPub[k].journals;
    var a = gPub[k].articles;
    
    var pl = $('<a class="npv" id="'+p+'-'+j+'-'+a+'" style="cursor: pointer;" onclick="selectPub(this);" >' + p + '</a>')
        .css("font-size", "14px")
        .css("color", "#222222")
        .css("font-weight", "bold")
        .hover(function() { 
          var z = $( this ).attr('id').split('-');
          $( this ).text(z[0] + " Journals "+ z[1] + " Articles " + z[2]);  
          
        }, function() { 
          var z = $( this ).attr('id').split('-');
          $( this ).text(z[0]);  
        });

    var cax = $('<div class="npv-category" />')
    .css("margin-left", "11px")
    .css("display", "block")
    .css("height", "14px");
    cax.append(pl);
    $("#PubList").append(cax);
  }
  
}

var selectPub = function(o) {
  var otf = o.text;
  if ( otf.indexOf('Journal') > 0 ) {
      otf = otf.substr(0,otf.indexOf('Journal')-1)
  }
  if ( otf == gSE.publisher) {
    $(".npv").css("background-color","#ffffff");
    gSE.publisher = "";
  } else {
    var z = o.id.split('-');
    $(".npv").css("background-color","#ffffff");
    $(o).css("background-color", "yellow");
    gSE.publisher = z[0];
  }

  if ( gMenuSel == 'j' ) {
    journalView();
  }

}

var journalDict = function(o) {
  // not currently used - intended as journal typeahead 
  var pUrl = gdUrl+'/journals?all';
  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success  journal records'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        gJrn = dres.success.data;       
  });
}

var jSort = function(o) {
  if ( o.text == 'Journal' ) {
    o.text = 'Articles';
  } else {
    o.text = 'Journal';
  }
  gjPage = 0;
  journalTemplate();
}

var searchJrn = function() {
  gJSearch = $("#jstext").val();
  gjPage = 0;
  journalTemplate();
  /*
  if ( jsx ) {
    gJSearch = jsx;
    gjPage = 0;
    journalTemplate();
  } else {
    gJSearch = "";
  }*/

}
// Journal functions that build that right panel catalog
var journalView = function(o) {

  $("#cb").hide();
  $("#widget-box").show();
  $("#widget-view").empty();
  $("#widget-title").text('/ Publication Catalog');
  gMenuSel = 'j';
  gjPage = 0;
  gJSearch = "";

  $("#search-tool-div").hide();
  $("#date-select-div").hide();
  $("#PubList").show();
  $("#SetList").hide();
  $("#DictList").hide();
  
  if ( !$( "#jsBtn" ).length ) {
    var sby = $('<span>Sort By </span>')
          .css("margin", "3px 5px");
    var sortBtn =  $('<a id="jsBtn" class="arrow-button" >Journal</a>')
          .css("font-size", "11px")
          .css("margin", "2px 4px")
          .css("padding","2px 2px")
          .attr('onclick','jSort(this);');

    var selb = $('<span>Journal Search </span>')
          .css("margin", "2px 5px");
    var selc = $('<span id="sjrc"></span>')
          .css("margin", "2px 2px");
    var sbi = $('<input class="form-control" placeholder="Text" size=20 id="jstext">')
              .css("margin", "2px 0px");
    var sbx = $('<button id="searchBtn" class="arrow-button"></button>')
              .css("height","20px" )  
              .css("margin", "0px 5px")
              .attr("onclick", "searchJrn()")
              .html('<i class="fa fa-search"></i>');
   
    $("#widget-view").append(selb);
    $("#widget-view").append(sbi);
    $("#widget-view").append(sbx);
    $("#widget-view").append(selc);
    $("#widget-view").append(sby);
    $("#widget-view").append(sortBtn);
  }

  if ( !$( "#pgjPrev" ).length ) {
    var prv = $('<button class="arrow-button" id="pgjPrev" onclick="jpager(this)"> &lt; </button>')
              .css("margin", "30px 2px");
    var pcnt = $('<span class="dijitTitlePaneTextNode" style="margin:5px" id="pgjCnt">Page ' + gjPage + '</span>');
    var pnxt = $('<button class="arrow-button" id="pgjNext" onclick="jpager(this)"> &gt; </button></br>');

    $("#widget-view").append(prv);
    $("#widget-view").append(pcnt);
    $("#widget-view").append(pnxt);
  }

  if ( gJrn.length > 0 ) {
    journalTemplate();
  } else {
    var pUrl = gdUrl+'/journals?all';
    var jqxhr = $.get(pUrl, function() {
      var ssu = 'success  journal records'; 
    })
    .done(function(data) { 
  
          if (typeof(data) == "object" ) {
            var dres = data;
          } else {
            var dres = JSON.parse(data);
          }

          gJrn = dres.success.data;
          journalTemplate();
         
    });

  }

}

function jpager(o) {
  if ( o.id == 'pgjPrev') {
    if ( gjPage > 0 ) {
      gjPage--;
      journalTemplate();
   
    }
  }
  if ( o.id == 'pgjNext') {
    gjPage++;
    journalTemplate();
 
  }

}

var journalTemplate = function() {

  $( "#pgjCnt").text('Page '+ gjPage);
  if ( $( "#JournalList" ).length ) {
    $( "#JournalList" ).remove();
  }

  var jldiv = $('<div class="dijitTitlePaneTextNode" id="JournalList"></div>');
  var jT = $('<table id="jptab"></table>');
  var jth = $('<tr><th style="text-align:left">Journal</th><th style="text-align:left">Publisher</th><th>Articles</th><th>Years Covered</th></tr>');
  jT.append(jth);

  jldiv.append(jT);
  $("#widget-view").append(jldiv);

  var sortby = $("#jsBtn").text();

  if ( gJrn.length ) {
    gJrn.sort(function(a, b){

      if ( sortby == 'Journal' ) {
        if(a.journal < b.journal ) { return -1; }
        if(a.journal > b.journal ) { return 1; }
      }
      if ( sortby == 'Articles' ) {
        if(a.articles < b.articles) { return 1; }
        if(a.articles > b.articles ) { return -1; }
      }
      return 0;
    })
  }
  
  //var jpstart = gjPage*50;
  //var jpd = 0;
  var jpStart = gjPage*25;
  var jpEnd = jpStart+25;
  var jpd = 0;
  var tc = 0;
  for (k in gJrn) {
    if ( gSE.publisher ) {
      if ( gSE.publisher == gJrn[k].publisher ) {
        if ( gJSearch ) { 
          if ( gJrn[k].journal.toUpperCase().indexOf(gJSearch.toUpperCase()) > -1 ) {
            var df = true;
          } else {
            var df = false;   
          }
        } else {
          var df = true;
        }
      } else { df = false; }
    } else {
      if ( gJSearch ) { 
        if ( gJrn[k].journal.toUpperCase().indexOf(gJSearch.toUpperCase()) > -1 ) {
          var df = true;
        } else {
          var df = false;   
        }
      } else {
        var df = true;
      }
      
    }

    //if ( df == true && jpd < 50 && k > jpstart ) {
    if ( df ) {
      jpd++;
      tc++;
      if ( jpd >= jpStart && jpd < jpEnd ) {
          var tr = $('<tr></tr>');
          var pl = $('<a class="jrnv" id="'+k+'" style="cursor: pointer;" onclick="selectJrn(this);" >' + gJrn[k].journal + '</a>')
              .css("font-size", "12px")
              .css("color", "#222222")
              .css("font-weight", "bold");

          var j = $('<td id="jj-'+k+'" class="jtd"></td>')
                  .css("width","240px");
          j.append(pl);

          var p = $('<td id="jp-'+k+'" class="jtd">'+gJrn[k].publisher+'</td>')
                  .css("width","160px");
          var a = $('<td id="ja-'+k+'" class="jtd">'+gJrn[k].articles+'</td>')
                  .css("width","60px");
          
          var e = gJrn[k].eissn;

          //var i = $('<td id="ji-'+k+'" class="jtd">'+gJrn[k].issn+'</td>').css("width","80px");
          var y = gJrn[k].years_covered;
          var ys = y[0] + '-'+ y[y.length-1] + ' '+ y.length;
          var yx = $('<td id="jy-'+k+'" class="jtd">'+ys+'</td>').css("width","80px");

          tr.append(j);
          tr.append(p);
          tr.append(a);
          tr.append(yx);
         // tr.append(i);
          jT.append(tr);
        }
    }

  }

  $("#sjrc").text(tc);

  jldiv.append(jT);
  $("#widget-view").append(jldiv);
  
}

var selectJrn = function(o) {
  var jo = gJrn[o.id];

  if ( jo.journal == gSE.pubname) {
    $(o).css("background-color","#ffffff");
    $("#gPubName").val("");
    gSE.pubname = "";
  } else {
    $(".jrnv").css("background-color","#ffffff");
    $(o).css("background-color", "yellow");
    $("#gPubName").val(jo.journal);
    $("#search-tool-div").show();
    gSE.pubname = jo.journal;
  }

}

// Dataset functions
var facetSet = function(o) {
  var pUrl = gdUrl+'/sets?all';

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success set records'; 
  })
  .done(function(data) { 

        //$("#rec-results").css("background-color", "white");
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        gSet = dres.success.data;
        facetSetView();
        $("#SetList").hide();
  });

}

var facetSetView = function() {

  $(".nsv-category").each(function() {
    $( this ).remove();
  })
/*
  if ( gSetInit ) {
    var pl = $('<a class="nsv" id="geothermal" style="cursor: pointer;" onclick="selectSet(this);" >geothermal</a>')
        .css("font-size", "12px")
        .css("color", "#222222")
        .css("background-color", "yellow")
        .css("font-weight", "bold");
    var cax = $('<div class="nsv-category" />')
        .css("margin-left", "11px")
        .css("display", "block")
        .css("height", "14px");
        cax.append(pl);
        $("#SetList").append(cax);
    gSetInit = false;
  }
  */

  for (k in gSet) {
    var n = gSet[k].name;
    var j = gSet[k].description;
    var a = gSet[k].details;
    
    var pl = $('<a class="nsv" id="'+n+'" style="cursor: pointer;" onclick="selectSet(this);" >' + n + '</a>')
        .css("font-size", "12px")
        .css("color", "#222222")
        .css("font-weight", "bold");
    var cax = $('<div class="nsv-category" />')
        .css("margin-left", "11px")
        .css("display", "block")
        .css("height", "14px");
        cax.append(pl);
        $("#SetList").append(cax);
  }
}

function selectSet(o) {
  $(".nsv").css("background-color","#ffffff");
  if ( o.id == gSE.dataset) {
    gSE.dataset = "";
  } else {
    $(o).css("background-color", "yellow");
    gSE.dataset = o.id;
  }
}

// Dictionary facet functions
function facetDict() {

  var pUrl = gdUrl+'/dictionaries?all';
  pUrl = '/adept/getFilteredDictionaries';
  gDLType = 'Filtered';

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict records'; 
  })
  .done(function(data) { 

        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        gDictList = dres.success.data;
        gDictList.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        })
        facetDictView();
        if ( !init ) {
          $("#DictList").hide();
        }
  });

}

function facetDictView() {
  $(".ndv-category").each(function() {
    $( this ).remove();
  })

  for (k in gDictList) {
    var i =  gDictList[k].dict_id;
    var n =  gDictList[k].name;
    var s =  gDictList[k].source;
    //var a = gSet[k].details;
    
    var pl = $('<a class="ndv" id="'+k+'-'+i+'" style="cursor: pointer;" onclick="selectDict(this);" >' + n + '</a>')
        .css("font-size", "14px")
        .css("color", "#222222")
        .css("font-weight", "bold");
    if ( init == true && n == gDefaultDict) {
      pl.css("background-color", "yellow");
      gSelDict.k = k;
      gSelDict.name = n;
      gSelDict.dict_id = i;
      var defd = pl;
    }
    var cax = $('<div class="ndv-category" />')
        .css("margin-left", "14px")
        .css("display", "block")
        .css("height", "14px");
        cax.append(pl);
        $("#DictList").append(cax);
  }

  if ( init == true && defd) {
    getDicTerms(defd);
  }

}

function selectDict(o) {
  // key, dict_id
  var da = o.id.split('-');
 
  $(".ndx-dm").css("background-color","#ffffff");
  $(".ndv").css("background-color","#ffffff");

  if ( da[0] == gSelDict.k ) {
    gSelDict.k = "";
    gSelDict.name = "";
    gSelDict.dict_id = "";
    gSelDict.count = 0;
    gDict = {};
    gSE.dict = "";
   
  } else {
    $(o).css("background-color", "yellow");
    gSelDict.k = da[0];
    gSelDict.name = gDictList[da[0]].name;
    gSelDict.dict_id = da[1];
    getDicTerms(o);
    gSE.dict = gDictList[da[0]].name;
  }    

}

function getDicTerms(o, cb) {

  gDict = {};
  var pUrl = gdUrl+'/dictionaries?dict_id='+gSelDict.dict_id+'&show_terms';
  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        if ( dres.success.data[0].term_hits) {
          gDict = dres.success.data[0].term_hits
          //gDict = Object.keys(gDict).sort();
          gSelDict.count = Object.keys(gDict).length;
          if ( cb ) {
            cb();
          }
          
        }
  });

}

function divToggle(o) {
    if ( $(o).css("display") == "none") { 
      $(o).css("display","block");
    } else {
      $(o).css("display","none");
    }
 }


function logmein(o, cb) {

  var un = $("#luser").val();
  var pw =  $("#lpass").val();

  var xUrl = '/adept/getToken?q='+un+'&p='+pw;

  var jqxhr = $.get(xUrl, function() {
    var ssu = 'success gt'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
  
    if ( dres.authtoken == 'undefined' || dres.authtoken == 'Not authorized') {
      var pt = false;
    } else { pt = true; }

    if ( pt == true && dres.authtoken == dres.kv ) {
        gKey = {};
        gKey[dres.authtoken] = dres.kv;
        gKey.agentRole = dres.agentrole;
        $("#laname").text(un).css("font-size","12px")
            .css("font-family","Arial, Lucida Grande, sans-serif");
        $("#loginBtn").text("Logout");
        //$("#Cex").css("display","block");
        $("#loginDiv").hide();
        $("#myDataTab").show();
        $("#saveSetGrp").show();
        $("#saveSearchBtn").show();
        gUser.id = dres.user_id;
        gUser.role_id = dres.agentrole;
        if ( gUser.role_id == 1 ) {
          $("#ugBtn").show();
        } else {
          $("#ugBtn").hide();
        }
        getCollections('login');
        cb();
        return;
    } else {
      $("#loginBtn").text("Not Authorized");
        $("#loginDiv").hide();
        $("#myDataTab").hide();
        gKey = {"x":"z","agentRole":"99"};
        cb();
        alert('Invalid login');
    }
  });
  
}

function loginSelCol(o) {
  $("#selSavedSets").empty();

  if ( gCollections ) {
    var init=0;
    for (k in gCollections) {
      var i =  gCollections[k].col_id;
      var n =  gCollections[k].col_name;
      var s =  gCollections[k].search_set;
    
      if ( s ) {
        for (z in s ) {
          var so = $('<option value="'+k+'-'+i+'-'+z+'">'+n+'/'+s[z].col_desc+'</option>')
                  .css("font-family", "calibri");
          if ( init == 0 ) {so.attr("selected","selected"); }
          $("#selSavedSets").append(so);
        }
      } else {
        var so = $('<option value="'+k+'-'+i+'">'+n+'</option>')
                  .css("font-family", "calibri");
        if ( init == 0 ) {so.attr("selected","selected"); }
        $("#selSavedSets").append(so); 
      }
    
      // if a collection is already selected, load the record_set from gCollections
      // if its an init, setups up the selected collection from the first item in the gCollections list, adding the record_set
      if ( gSelCollection.col_id ) {
        for ( z in gCollections ) {
            if ( gCollections[z].col_id == gSelCollection.col_id ) {
                gSelCollection.record_set = gCollections[z].record_set;
            }
        }
      } else {
        if ( init == 0 ) {
            gSelCollection.col_id = i;
            gSelCollection.col_k = parseInt(k);
            gSelCollection.col_name = n;
            gSelCollection.sid = 0;
            gSelCollection.record_set = gCollections[k].record_set;
          }
      }

     
      init=1;
      //getGroupColSearches();

    }
  } else {
    var so = $('<option value="default" selected>Default</option>').css("font-family", "calibri");
    $("#selSavedSets").append(so);
  }
}

/*function getGroupColSearches() {

  var xUrl = '/adept/getGroupCollections?t='+kmu(gKey)+'&u='+gUser.id;
  var jqxhr = $.get(xUrl, function() {
    var ssu = 'success gt'; 
  })
  .done(function(data) { 

       if (typeof(data) == "object" ) {
          var dres = data;
       } else {
          var dres = JSON.parse(data);
       }
       gGrpSelColSearch = dres.success.data;
       if ( gGrpSelColSearch ) {
        showGrpColSearch();
       }
      
  });
}

function showGrpColSearch(o) {

  if ( gGrpSelColSearch ) {

    for (k in gGrpSelColSearch ) {
      var g =  gGrpSelColSearch[k].group_id;
      var gn =  gGrpSelColSearch[k].group_name;
      var i =  gGrpSelColSearch[k].col_id;
      var n =  gGrpSelColSearch[k].col_name;
      var s =  gGrpSelColSearch[k].search_set;

      for (x in s) {
        var si = s[x].cs_id;
        var cd = s[x].col_desc;
        var so = $('<option value="'+k+'-'+i+'-'+x+'-G">'+gn+'/'+n+'/'+cd+'</option>')
                  .css("font-family", "calibri")
                  .css("background","#7bb853");
        $("#selSavedSets").append(so);
      }
    }
  }

} */

function getSavedSetOpt(o) {
  var ov = o.value.split('-');
  var k = ov[0];
  var t = ov[1];
  var s = ov[2];
  k = parseInt(k);
  gSelCollection.col_id = t;
  gSelCollection.col_k = k;
  if ( ov.length == 4 ) {
    gSelCollection.type = 'group';
    gSelCollection.group_id = gGrpSelColSearch[k].group_id;
    gSelCollection.group_name = gGrpSelColSearch[k].group_name;
    gSelCollection.col_name =  gGrpSelColSearch[k].col_name;
    gSelCollection.sid = s;
    gSelCollection.sname = gGrpSelColSearch[k].search_set[s].col_desc;
    
  } else {

    gSelCollection.type = 'owner'; 
    gSelCollection.col_name = gCollections[k].col_name;
    gSelCollection.sid = s;
    gSelCollection.record_set = gCollections[k].record_set;


  }
  
}

function logmeinx(o, cb) {
  var un = $("#luser").val();
  var pw =  $("#lpass").val();
  //var fcp = o.id;

  var xUrl = '/action/getToken?q='+un+'&p='+pw;

  var jqxhr = $.get(xUrl, function() {
    var ssu = 'success gt'; 
  })
  .done(function(data) { 

       if (typeof(data) == "object" ) {
          var dres = data;
       } else {
          var dres = JSON.parse(data);
       }
      
        //for (var k in dres) {
        if ( dres.authtoken == dres.kv ) {
            gKey = {};
            gKey[dres.authtoken] = dres.kv;
			      gKey.agentRole = dres.agentrole;
            $("#laname").text(un).css("font-size","12px")
				.css("font-family","Arial, Lucida Grande, sans-serif");
            $("#loginBtn").text("Logout");
            //$("#Cex").css("display","block");
            $("#loginDiv").hide();
            cb();
            return;
        } else {
          gKey = {"x":"z","agentRole":"99"};
          cb();
        }
      });
}

var resetPw = function(o) {

  if ( $("#regDiv").is(":visible") ) {
    $("#regDiv").hide();
  } else {
    $("#regDiv").show();

    $("#loginDiv").hide();

    var rf = $("#regForm");
    rf.css("height","380px");

    var div1 = $('<div id="sendEm"></div>');

    var h = $('<h5>Have you forgotten your password ?</h5>')
                    .css("margin-top", "12px")
                    .css("color", "#0971B2")
                    .css("font-size", "18px")
                    .css("font-family","calibri")
                    .css("margin-bottom", "12px")
                    .css("text-align", "center");

    var em = $('<input class="form-control" placeholder="Email" size="30" id="rEmail">');

    var fpBtn = $('<a id="regBtn" class="tag" type="submit" onclick="sendResetPwEmail();" style="margin:4px;">Send</a>');  
    var labn = $('<span>Enter your email address and press send to receive a password reset security code</span></br>')
            .css("font-family","calibri")
            .css("font-size", "12px");

    div1.append(h);  
    div1.append(em);
    div1.append(fpBtn);
  
    div1.append('</br>');  
    div1.append(labn);

    rf.append(div1);

    var div2 = $('<div id="getCode"></div>');
    rf.append(div2);

    var div3 = $('<div id="finalSend"></div>');
    var cancelBtn = $('<a id="cancelBtn" class="tag" type="submit" onclick="cancelReg();" style="margin:4px;">Cancel</a>');

    div3.append(cancelBtn);
    rf.append(div3);
    /*
    rf.append(h);
    rf.append(labn);
    rf.append(rfn);
    rf.append('</br>');
    rf.append(rln);
    rf.append('</br>');
    rf.append(labc);
    rf.append(em);
    rf.append('</br><span>You will receive an email with a security code valid for 60 minutes. </span></br>')
          .css("font-family","calibri")
          .css("font-size","14px");

    rf.append(org);
    rf.append('</br>');
    rf.append(rdesc);
    rf.append('</br>');
    rf.append(labl);
    rf.append(unx);
    rf.append('</br><span></span></br>')
          .css("font-family","calibri")
          .css("font-size","11px");
    rf.append(pw);
    rf.append('</br>');
    rf.append(cpw);

    rf.append(pwi);
    rf.append(dbtn);
    rf.append(dsclm);
    rf.append('</br>');
    rf.append(bsp);
    */
    //rf.append(cancelBtn);
    
  }

}

var sendResetPwEmail = function(o) {
    
  var emx = $("#rEmail").val();
  var pUrl = '/adept/sendResetCode?em='+emx;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success cu'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    console.log(data);

    if ( data ) {
      //alert(data);
      ResetPwEmailForm(emx);
   } else {
      alert('An email will be sent to the address you supplied confirming your approval');
   }
  });

}

var ResetPwEmailForm = function(o) {

  var cbn = $("#sendEm");
  $("#regBtn").hide();
  var labl = $('<span id="lofi">Enter the reset code</span></br>')
    .css("display","none")
    .css("font-family","calibri")
    .css("font-size", "14px");  

  var unx = $('<input class="form-control" placeholder="Enter reset code" id="resetCode">');
  
  var verifyBtn = $('<a id="verifyBtn" class="tag" type="submit" onclick="resetPWform(this);" style="margin:4px;">Validate</a>');
  cbn.append(labl);     
  cbn.append(unx);
  cbn.append(verifyBtn);
  
}


var resetPWform = function(o) {

  if ( $("#upass").length ) {
    console.log('Done already');
  } else {
  //$("#sendEm").empty();
    var emx = $("#rEmail").val();
    var pwf = $("#getCode");
    var pw = $('<input id="upass" class="form-control" placeholder="Reset password" type="password">');
    var cpw = $('<input  id="cupass" class="form-control" placeholder="Confirm password" type="password">');

    var pwi = $('<span id="pwcl">Password must contain minimum of 8 characters with a number & special character</span>')
            .css("font-family","calibri")
            .css("font-size","12px");

    var pwBtn = $('<a id="verifyBtn" class="tag" type="submit" onclick="sendPW(this);" style="margin:4px;">Reset</a>');

    pwf.append(pw);
    pwf.append('</br>');
    pwf.append(cpw);
    pwf.append(pwBtn);
    pwf.append('</br>');
    pwf.append(pwi);
    pwf.append('</br>');
   
  } 

}

var sendPW = function(o) {
  var emx = $("#rEmail").val();
  var rsc = $("#resetCode").val();
  var pwx = $("#upass").val();
  var pUrl = '/adept/sendPWReset?em='+emx+'&p='+pwx+'&r='+rsc;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success cu'; 
  })
  .done(function(data) { 
    console.log(data);

    $("#getCode").empty();


    if ( data.Status ) {
      alert ('ERROR ' + data.Status);
    } else {
      alert('Password has been reset, try logging in ');
      $("#regForm").empty();
      $("#regDiv").hide();

    }
  });

}

var register = function(o) {

  if ( $("#regDiv").is(":visible") ) {
    $("#regDiv").hide();
  } else {
    $("#regDiv").show();
    $("#loginDiv").hide();

    var rf = $("#regForm");

    var h = $('<h5>NEW USER REGISTRATION</h5>')
                    .css("margin-top", "12px")
                    .css("color", "#0971B2")
                    .css("font-size", "16px")
                    .css("font-family","calibri")
                    .css("margin-bottom", "12px")
                    .css("text-align", "center");

    var labn = $('<span>Full Name </span></br>')
        .css("font-family","calibri")
        .css("font-size", "14px");                
    var rfn = $('<input class="form-control" placeholder="First Name" id="rFname">');
    var rln = $('<input class="form-control" placeholder="Last Name" size="30" id="rLname">');

    var labc = $('<span >Contact Info </span></br>')
        .css("font-family","calibri")
        .css("font-size", "14px");  
    var em = $('<input class="form-control" placeholder="Email" size="30" id="rEmail">');
    var org = $('<input class="form-control" placeholder="Institution" size="40" id="rOrg">');
    var rdesc = $('<input class="form-control" placeholder="Purpose" size="40" id="rDesc">');

    var labl = $('<span>Login Info</span></br>')
        .css("font-family","calibri")
        .css("font-size", "14px");  
    var unx = $('<input class="form-control" placeholder="User name" id="rUname">');
    var pw = $('<input id="upass" class="form-control" placeholder="Enter password" type="password">');
    var cpw = $('<input  id="cupass" class="form-control" placeholder="Confirm password" type="password">');
    
    var dbtn = $('<input id="disCB" type="checkbox">');
    var dsclm = $('<span id="stac">I have read and understand the Terms and Conditions of Use</span></br>')
          .css("font-family","calibri")
          .css("font-size","11px");

    var tosBtn = $('<a id="tosBtn" class="tag" onclick="viewTos();" style="margin:2px; ">Terms of Service</a>')
    var regBtn = $('<a id="regBtn" class="tag" type="submit" onclick="submitReg();" style="margin:4px;">Register</a>');
    var cancelBtn = $('<a id="cancelBtn" class="tag" type="submit" onclick="cancelReg();" style="margin:4px;">Cancel</a>');

    var bsp = $('<h5></h5>')
                    .css("margin-top", "8px")
                    .css("color", "#21b229")
                    .css("font-size", "16px")
                    .css("font-family","calibri")
                    .css("margin-bottom", "8px")
                    .css("text-align", "center");

    bsp.append(tosBtn);                
    bsp.append(regBtn);
    bsp.append(cancelBtn);

    rf.append(h);
    rf.append(labn);
    rf.append(rfn);
    rf.append('</br>');
    rf.append(rln);
    rf.append('</br>');
    rf.append(labc);
    rf.append(em);
    rf.append('</br><span id="emsp">A one-time email confirmation will be sent to this address</span></br>')
          .css("font-family","calibri")
          .css("font-size","11px");

    rf.append(org);
    rf.append('</br>');
    rf.append(rdesc);
    rf.append('</br>');
    rf.append(labl);
    rf.append(unx);
    rf.append('</br><span>NOTE - Leave blank to use email for login id.</span></br>')
          .css("font-family","calibri")
          .css("font-size","11px");
    rf.append(pw);
    rf.append('<span id="cpe" style="display:none; color: red">Password does not match</span></br>');
    rf.append(cpw);
    rf.append('</br><span>Password must contain minimum of 8 characters with a number & special character</span></br>')
      .css("font-family","calibri")
      .css("font-size","11px");
    rf.append(dbtn);
    rf.append(dsclm);
    rf.append('</br>');
    rf.append(bsp);
    //rf.append(cancelBtn);
    
  }


}

var submitReg = function(o) {

  var f = $("#rFname").val();
  var l = $("#rLname").val();
  var e = $("#rEmail").val();
  var o = $("#rOrg").val();
  var d = $("#rDesc").val();
  var u = $("#rUname").val();
 
  var p = $("#upass").val();
  var cp = $("#cupass").val();
  var valid = true;

  if ( $("#disCB").is((":not(:checked)")) ) {
    $("#stac").text('REQUIRED - I have read the Terms and Conditions of Use').css("color","red");
    valid = false;
  } else {
    $("#stac").text('I have read the Terms and Conditions of Use').css("color","black");
  }

  if ( valid && p.length < 8 ) {
    $("#cpe").text("Invalid Password");
    $("#cpe").show();
    valid = false;
  } 

  if ( valid && p !== cp ) {
    $("#cpe").text("Password confirmation does not match");
    $("#cpe").show();
    valid = false;
  }

  if ( valid && e.indexOf('@') < 2 ) {
    $("#emsp").text("Valid email is required").css("color","red");
    valid = false;
  }

  if ( valid && !e ) {
   // $("#rEmail").css("color","red");
    $("#emsp").text("Valid email is required").css("color","red");
    valid = false;
  }

  //if ( valid && !e && !u ) {
  //  $("#rUname").css("color","red");
  //  valid = false;
  //}

  var rUrl = '/adept/createUser?em='+e+'&u='+u+'&p='+p+'&f='+f+'&l='+l+'&o='+o+'&d='+d;
  console.log(rUrl);

  if ( valid ) {
    var jqxhr = $.get(rUrl, function() {
      var ssu = 'success cu'; 
    })
    .done(function(data) { 
      console.log(data);

      $("#regForm").empty();
      $("#regDiv").hide();
      if ( data.status ) {
        alert(data.status);
     } else {
       alert('An email will be sent to the address you supplied confirming your approval');
     }
    });
  }


}


var cancelReg = function(o) {
  $("#regForm").empty();
  $("#regDiv").hide();

}

var showLogin = function() {

  if (  $("#loginBtn").text() == "Logout" ) {
       gKey = { "a" : "b" };
       $("#loginBtn").text("Login");
       $("#laname").text("");
       $("#Cex").css("display","none");
  } else {
    $("#Cex").css("display","block");
    //TEMP FOR DEV - use toggle !!
    //toggleLogin();
  } 
}

var toggleLogin = function(o, cb) {
   
  if (  $(o).text() == "Logout" ) {
      gKey = { "a" : "b" };
      $("#laname").text("");
      $(o).text("Login");

      $("#Cex").css("display","none");
      $("#myDataTab").hide();
      $("#saveSetGrp").hide();
      $("#saveSearchBtn").hide();

      $("#leftUserData").hide();
      $("#rightUserData").hide();
      $("#rud-results").empty();
      $("#rud-help").show();
      $("#leftSearch").show();
      $("#cb").show();
      cb();
  } else {
    
    if ( $("#loginDiv").css("display") == "none") { 
      $("#loginDiv").css("display","block");
    
    } else {
      $("#loginDiv").css("display","none");
    }
  
  }

}

var viewTos = function(o) {
  //$("#loginDiv").hide();
  $("#tosDiv").toggle();
}

// My Data Functions

var dictionaryMan = function(o) {

  $("#rud-results").empty();
  $("#dm-dl-div").remove();
  gDLType = "Filtered";
  $("#rud-help").hide();
  var dmdiv = $('<div id="dmdiv"></div>') 
            .css('width','600px')
            .css('float','left')
            .css('display','block');
    
  var dmTx = $('<span>Dictionary Manager</span>').css('font-size','20px');
  var aphb = $('<a id="naBtn" class="res-tag" type="submit" onclick="helpToggle();" >?</a>')
              .css('font-size','12px')
              .css('background-color','rgb(33,145,194)')
              .css('margin','5px')
              .css('width','15px');

  var ahdiv = $('<div id="app-help-div"></div>')
              .css('display','none');
  var apin = $('<span></span>')
              .css('font-size','12px');
  ahdiv.append(apin);

  apin.append('<h3>About</h3>');
  apin.append('A dictionary is a list of keywords that can be used to identify sets of xDD documents that contain <b><i>one or more</i></b> ');
  apin.append(' of the listed keywords. Users must contact the xDD administrative team'); 
  apin.append(' <a href = "mailto: contact@geodeepdive.org">contact@geodeepdive.org</a> to create dictionaries with more complex set logic, such as <i>"includes X and Y, but excludes Z"</i>.  ');
  apin.append('<h3>View Existing Dictionaries</h3>');
  apin.append(' Users can view a list of pre-made dictionaries offered by the xDD team by clicking the <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">All</b> button. ');
  apin.append(' Many of these dictionaries were created for specific projects and are unlikely to hold terms of interest to other users, but users can click the <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">Filtered</b> button to see a curated list of dictionaries that is more likely to be generally useful. ');
  apin.append('<h3>Local Dictionaries</h3>');
  apin.append('Users can also create new, custom dictionaries through the ADEPT interface by clicking the <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">Local</b> button and filling out the resulting form.  ');
  apin.append('A dictionary made through this method is private and only visible to the user who created it from this pane. ');
  apin.append('A user can <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">request a test set</b> (e.g., a random sample of 200 documents containing one or more of the keywords in the dictionary) for any local, user-created dictionary. ');
  apin.append('A URL to the requested test-set will be accessible by navigating to the <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">Test Set</b> tab.');

  dmdiv.append(dmTx);
  dmdiv.append(aphb);
  dmdiv.append('</br>');
  dmdiv.append(ahdiv);
  dmdiv.append('</br>');

  $("#rud-results").append(dmdiv);
  var d = {};
  d.id = 'fdBtn';
  getDictList(d);
  
  dictManTemplate()
  
}

function getDictList(o) {

  if ( o.id == 'adBtn' ) {
    gDLType = 'All';
    var pUrl = gdUrl+'/dictionaries?all';
    $("#ndBtn").hide();
    $("#ddBtn").hide();
    $("#edBtn").hide();
    $("#rtsBtn").hide();

  }

  if ( o.id == 'fdBtn' ) {
    gDLType = 'Filtered';
    var pUrl = '/adept/getFilteredDictionaries';
    $("#ndBtn").hide();
    $("#ddBtn").hide();
    $("#edBtn").hide();
    $("#rtsBtn").hide();
  }

  if ( o.id == 'sdBtn'|| o.id == 'ddBtn' ) {
    pUrl = '/adept/getLocalDictionaries?t='+ kmu(gKey)+'&u='+gUser.id;
    gDLType = 'Local Saved';
    $("#ndBtn").show();
    $("#ddBtn").show();
    $("#edBtn").show();
    $("#rtsBtn").show();
  }
 
  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict records'; 
  })
  .done(function(data) { 

        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        gDictList = dres.success.data;
        gDictList.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });
        showDictList();


  });
  
}

var dictManTemplate = function(o) {
 
  var adBtn = $('<a id="adBtn" class="res-tag" type="submit" onclick="getDictList(this);">All</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');
  var fdBtn = $('<a id="fdBtn" class="res-tag" type="submit" onclick="getDictList(this);" >Filtered</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  var sdBtn = $('<a id="sdBtn" class="res-tag" type="submit" onclick="getDictList(this);">Local</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  var ndBtn = $('<a id="ndBtn" class="res-tag" type="submit" onclick="newDict();" >New</a>')
        .css('font-size','12px')
        .css('display','none')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');
  /*
  var udBtn = $('<a id="edBtn" class="res-tag" type="submit" onclick="uploadDict();" >Upload</a>')
        .css('font-size','12px')
        .css('display','none')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');
  */
  var rtBtn = $('<a id="rtsBtn" class="res-tag" type="submit" onclick="dicRequestTS();" >Request Test Set</a>')
        .css('font-size','12px')
        .css('display','none')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','120px');

  var ddBtn = $('<a id="ddBtn" class="res-tag" type="submit" onclick="delDict(this);" >Delete</a>')
        .css('font-size','12px')
        .css('display','none')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');


  $("#dmdiv").append(adBtn);
  $("#dmdiv").append(fdBtn);
  $("#dmdiv").append(sdBtn);
  $("#dmdiv").append(ndBtn);
  $("#dmdiv").append(ddBtn)
  //$("#dmdiv").append(udBtn);
  $("#dmdiv").append(rtBtn);
  $("#dmdiv").append('</br>');

  var dldiv = $('<div id="dm-dl-div">'+gDLType+'</br></div>')
  //$("#dmdiv").append('<div id="dm-dl-div">'+gDLType+'</br></div>')
        .css('width','180px')
        .css('height','420px')
        .css("overflow-x","hidden")
        .css("overflow-y", "scroll")
        .css('float','left')
        .css('display','block');
  $("#dmdiv").append(dldiv);
  
  var dthead = $('<div id="dm-th-div">Terms</div>')
        .css('width','400px')
        .css('height','20px')
        .css('background-color','rgb(230, 230, 230)')
        //.css("overflow-x","hidden")
        //.css("overflow-y", "scroll")
        .css('float','right')
        .css('display','block');

  var dtdiv = $('<div id="dm-term-div"></div>')
        .css('width','400px')
        .css('height','400px')
        //.css('background-color','rgb(238, 238, 238)')
        .css('border','solid 1px')
        .css("overflow-x","hidden")
        .css("overflow-y", "scroll")
        .css('float','right')
        .css('display','block');

  $("#dmdiv").append(dthead);
  $("#dmdiv").append(dtdiv);

  if ( gDictList.length ) {
    showDictList();
  }

  //$("#rud-results").append(dmdiv);

}

function showDictList() {
 
  $(".ndx-dm").each(function() {
    $( this ).remove();
  })

  $("#dm-term-div").empty();
  $("#dm-dl-div").text(gDLType);

  for (k in gDictList) {
    var i =  gDictList[k].dict_id;
    var n =  gDictList[k].name;
    var s =  gDictList[k].source;
    //var a = gSet[k].details;
    
    var pl = $('<a class="ndx-dm" id="'+k+'-'+i+'" onclick="selectDmDict(this);" >' + n + '</a>')
        .css("font-size", "14px")
        .css("color", "#222222")
        .css("cursor", "pointer")
        .css("font-weight", "bold");
    var cax = $('<div class="ndx-dm" />')
        .css("margin-left", "14px")
        .css("display", "block")
        .css("height", "14px");
        cax.append(pl);
        $("#dm-dl-div").append(cax);
  }
}

function selectDmDict(o) {
  // key, dict_id
  var da = o.id.split('-');
 
  $(".ndx-dm").css("background-color","#ffffff");
  $("#dm-term-div").empty();
  $("#dm-th-div").empty();
  //$("#dm-term-div").append('<h5>Terms</h5>');

  if ( da[0] == gSelDict.k ) {
    gSelDict.k = "";
    gSelDict.name = "";
    gSelDict.dict_id = "";
    gSelDict.count = 0;
    gDict = {};
    gSE.dict = "";
   
  } else {
    $(o).css("background-color", "yellow");
    gSelDict.k = da[0];
    gSelDict.name = gDictList[da[0]].name;
    gSelDict.dict_id = da[1];
    dmDicTerms(o);
  }
}
var delDict = function(o) {

  if ( gSelDict.dict_id.length ) {
    var pUrl ='/adept/delLocalDict?t='+ kmu(gKey)+'&u='+gUser.id+'&d='+gSelDict.dict_id;
    var jqxhr = $.get(pUrl, function() {
      var ssu = 'success dict terms'; 
    })
    .done(function(data) { 
          if (typeof(data) == "object" ) {
            var dres = data;
          } else {
            var dres = JSON.parse(data);
          }
          var dl = dres.success.data[0].delete_local_dict
          if ( dl == "dictionary deleted" ) {
            getDictList(o);
            alert(dl+' '+gSelDict.name);
          } else {
            alert(dl+' '+gSelDict.name);
          }
        });
  }

}


var dmDicTerms = function() {

  gDict = {};
  if ( gDLType == 'Local Saved') {
    var pUrl ='/adept/getLocalDicTerms?t='+ kmu(gKey)+'&u='+gUser.id+'&d='+gSelDict.dict_id;
  } else if ( gDLType == 'Filtered') {
    var pUrl = gdUrl+'/dictionaries?t='+ kmu(gKey)+'&dict_id='+gSelDict.dict_id+'&show_terms';
  } else {
    var pUrl = gdUrl+'/dictionaries?t='+ kmu(gKey)+'&dict_id='+gSelDict.dict_id+'&show_terms';
  }
  
  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.error ) {
          alert( 'Data Retrieval error ' + dres.error.message );
        } else if ( gDLType == 'Local Saved') {
          gDict = dres.success.data;
          dlTermView();
        } else if ( dres.success.data[0].term_hits) { 
          gDict = dres.success.data[0].term_hits
          gSelDict.count = Object.keys(gDict).length;
          dmTermView();
        } 
  });

}
var dmTermView = function() {

  $("#dm-term-div").empty();
  $("#dm-th-div").empty();
  var dmhdr = $('<span>'+gSelDict.name+' ( '+ gSelDict.count + ' )</span>').css("margin","4px");
  var nb = $('<a class="tag" id="ntBtn" onclick="newDictTerm(this);" >+</a>')
          .css("font-size", "12px")
          .css("color", "#222222")
          .css("font-weight", "bold");
  $("#dm-th-div").append(dmhdr);
//  $("#dm-th-div").append(nb);

  var kt = $('<table id="kdt" style="border: none; background-color: white;"></table>');

  $("#dm-term-div").append(kt);
  var px = 0;
  if ( gSelDict.count > 500 ) {

  }
  Object.keys(gDict)
    .forEach(key => {
      var kr = $('<tr></tr>');
      var dxt = '<a id="kdel-'+key+'" class="sh-item" style="font-size:12px; font-family: calibri; margin: 2px 2px;" onclick="dmt-del(this);" > x </a>';
      var tx = $('<td></td>');
      tx.append(dxt);
      var tkt = $('<td width="50%" style="border: none; background-color: white;"></td>');
      var st = '<a id="dml-'+key+'" class="sh-item" style="font-size:12px; margin: 2px 2px;" onclick="dmt-Edit(this);" >'+key+'</a>'; 
      tkt.append(st);

      var tc = $('<td style="border: none; background-color: white;"><span style="font-size:12px; font-family: calibri">'+ key +'</span></td>');
      
      var tn = $('<td style="border: none; background-color: white;"><span style="font-size:12px; font-family: calibri">'+ gDict[key] +'</span></td>');

      if ( px < 500 ) {
        //kr.append(tx);
        //kr.append(tkt);
        kr.append(tc);
        kr.append(tn);
        kt.append(kr);
      } else {
        return
      }
      //if ( px < 500 ) { 
      //  $("#dm-term-div").append(st);
     // }    
      px++;
    });
    $("#dm-term-div").append(kt);
}

var dlTermView = function(o) {

  $("#dm-term-div").empty();
  $("#dm-th-div").empty();
  var dmhdr = $('<span>'+gSelDict.name+'</span>').css("margin","4px");
  var nb = $('<a class="tag" id="ntBtn" onclick="newLocalDictTerm(this);" >+</a>')
          .css("font-size", "12px")
          .css("color", "#222222")
          .css("font-weight", "bold");
  $("#dm-th-div").append(dmhdr);
  $("#dm-th-div").append(nb);

  var kt = $('<table id="kdt" style="border: none; background-color: white;"></table>');
  
  for (k in gDict ) {
    var kr = $('<tr></tr>');
    //var dxt = '<a id="kdel-'+k+'" class="sh-item" style="font-size:12px; font-family: calibri; margin: 2px 2px;" onclick="dlDel(this);" > x </a>';
    var dxt = '<i id="kdel-'+gDict[k].dt_id+'" class="fa fa-trash-alt" id="ds-225" onclick="deleteLocalDictTerm(this)" style="color: rgb(33, 145, 194);"></i>'
    var tx = $('<td></td>');
    tx.append(dxt);
  
    var st = '<a id="dle-'+gDict[k].dt_id+'" class="sh-item" style="font-size:12px; margin: 2px 2px;" onclick="editLocalDictTerm(this);" >'+gDict[k].term+'</a>'; 
    var tc = $('<td></td>');
    tc.append(st);

    kr.append(tx);
    kr.append(tc);
    kt.append(kr);
  }
  $("#dm-term-div").append(kt);

}

var newDict = function(o) {

  $("#dm-term-div").empty();
  $(".ndx-dm").css("background-color","#ffffff");
  gSelDict.k = "";
  gSelDict.name = "";
  gSelDict.dict_id = "";
  gSelDict.count = 0;

  var cni = $('<input class="form-control" placeholder="Dictionary Name" size=25 id="dictname">')
              .css("margin", "2px 0px");

  var tta = $('<textarea rows="8" cols="40" id="dictTerms" placeholder="Paste comma delimited Terms">');

  var csBtn = $('<a id="csBtn" class="res-tag" type="submit" onclick="createNewDict(this);">Save</a>')
              .css('font-size','12px')
              .css('background-color','rgb(33,145,194)')
              .css('margin','5px')
              .css('width','80px');

  var cxBtn = $('<a id="cxBtn" class="res-tag" type="submit" onclick="cancelNewDict(this);">Cancel</a>')
              .css('font-size','12px')
              .css('background-color','rgb(33,145,194)')
              .css('margin','5px')
              .css('width','80px');

  $("#dm-term-div").append(cni);
  $("#dm-term-div").append('</br>');
  $("#dm-term-div").append(tta);
  $("#dm-term-div").append('</br>');
  $("#dm-term-div").append(csBtn);
  $("#dm-term-div").append(cxBtn);

}

var createNewDict = function(o) {
  var dn = $("#dictname").val();
  var dt = $("#dictTerms").val();

  var pUrl = '/adept/newLocalDictionary?t='+ kmu(gKey)+'&u='+gUser.id+'&d='+dn+'&dt='+dt;
  //var pUrl = '/adept/newLocalDictionary?t='+ kmu(gKey)+'&u='+gUser.id+'&d='+dn;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        $("#dm-term-div").empty();
        var o = {};
        o.id = 'sdBtn';
        getDictList(o);

        /*
        var k = gDictList.length;
        var i = 0;
        var pl = $('<a class="ndx-dm" id="'+k+'-'+i+'" onclick="selectDmDict(this);" >' + dn + '</a>')
              .css("font-size", "14px")
              .css("color", "#222222")
              .css("cursor", "pointer")
              .css("font-weight", "bold");
        var cax = $('<div class="ndx-dm" />')
              .css("margin-left", "14px")
              .css("display", "block")
              .css("height", "14px");
        cax.append(pl);
        $("#dm-dl-div").append(cax);

        $("#dictname").remove();
        $("#csBtn").remove();
        if ( dres.success.data ) {
          gTestSets = dres.success.data;
          if ( gTestSets.length ) {
            showTestSetList();
          } else {
            // empty it out
          }
        }
        */
  });
}

var cancelNewDict = function(o) {

  $("#dm-term-div").empty();

}

var newLocalDictTerm = function(o) {

  var cni = $('<input class="form-control" placeholder="Enter Term" size=25 id="dictTerm">')
      .css("margin", "2px 0px");
  var csBtn = $('<a id="cvBtn" class="res-tag" type="submit" onclick="saveNewDT(this);">Add</a>')
      .css('font-size','11px')
      .css('background-color','rgb(33,145,194)')
      .css('margin','5px')
      .css('width','40px');
  $("#dm-term-div").prepend(csBtn);
  $("#dm-term-div").prepend(cni);

}

var saveNewDT = function(o) {

  var tv = $("#dictTerm").val();
  var pUrl ='/adept/newLocalDictTerm?t='+ kmu(gKey) +'&u='+gUser.id+'&d='+gSelDict.dict_id+'&dt='+tv;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success users'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    dmDicTerms();
  });
}

var editLocalDictTerm = function(o) {
  var dtx = o.id.split('-');
  var dtid= dtx[1];
  var cni = $('<input class="form-control" placeholder="Enter Term" size=25 id="dictTerm">')
      .css("margin", "2px 0px");
  var csBtn = $('<a id="cvBtn" class="res-tag" type="submit" onclick="saveEditDT('+dtid+');">Edit</a>')
      .css('font-size','11px')
      .css('background-color','rgb(33,145,194)')
      .css('margin','5px')
      .css('width','40px');
  $("#dm-term-div").prepend(csBtn);
  $("#dm-term-div").prepend(cni);

}

var saveEditDT = function(o) {
  
  var tv = $("#dictTerm").val();
  var pUrl ='/adept/editLocalDictTerm?t='+ kmu(gKey) +'&u='+gUser.id+'&d='+o+'&dt='+tv;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success users'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    dmDicTerms();
  });
}

var deleteLocalDictTerm = function(o) {
  var dtx = o.id.split('-');
  var dtid= dtx[1];

  var pUrl ='/adept/deleteLocalDictTerm?t='+ kmu(gKey) +'&u='+gUser.id+'&dt='+dtid;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success users'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    dmDicTerms();
  });

}

var dicRequestTS = function(o) {

  var pUrl ='/adept/registerDictionary?t='+ kmu(gKey) +'&u='+gUser.id+'&d='+gSelDict.dict_id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success reg dict'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    alert('Most requests will be available within a few seconds, please go to Test Sets');
  
  });
}

var userMan = function(o) {

  $("#rud-results").empty();
  $("#rud-help").hide();
  
  var umdiv = $('<div id="umdiv"></div>');
  var umTx = $('<h3>Manager Users</h3>');

  var uhdrdiv = $('<div id="uhdr-div"></div>')
        .css('width','800px')
        .css('height','60px')
        .css('display','block');
  
  var unBtn = $('<a id="unBtn" class="res-tag" type="submit" onclick="usReset(this);">Reset Password</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','100px');

  var usBtn = $('<a id="unBtn" class="res-tag" type="submit" onclick="uChgStatus(this);">Status</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  var urBtn = $('<a id="unBtn" class="res-tag" type="submit" onclick="uChgRole(this);">Role</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  var rp = $('<input id="pwreset" type="text" size="30" value="">');
       
  uhdrdiv.append(unBtn);
  uhdrdiv.append(usBtn);
  uhdrdiv.append(urBtn);
  uhdrdiv.append('</br>');
  uhdrdiv.append(rp);

  rp.hide();
  var utdiv = $('<div id="utab-div"></div>')
        .css('width','800px')
        .css('display','block');

  umdiv.append(umTx);
  umdiv.append(uhdrdiv);
  umdiv.append(utdiv);
  $("#rud-results").append(umdiv);
  umTemplate();

}


var umTemplate = function() {

  var umT = $('<table id="umtab"></table>');
  var umth = $('<tr><th style="text-align:left">User</th><th style="text-align:left">Email</th><th>Status</th><th>Created</th><th>Role</th></tr>');
  umT.append(umth);
  $("#utab-div").append(umT);

  var pUrl ='/adept/getUsers?t='+ kmu(gKey) +'&u='+gUser.id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success users'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        gUsers = dres.success.data;
        showUsers();

  });

}

var showUsers = function() {

  for (k in gUsers) {
    var u =  gUsers[k].user_id;
    var f =  gUsers[k].first_name;
    var l =  gUsers[k].last_name;
    var e =  gUsers[k].email;
    var r =  gUsers[k].role_id;
    var o =  gUsers[k].org_name;
    var c =  gUsers[k].created;
    var s =  gUsers[k].state;
    
    if ( r == 1 ) {
      var rn = 'admin';
    } else {
      var rn = 'application';
    }

    var tr = $('<tr></tr>');

    var userx = $('<a class="tsx-dm" id="'+k+'" onclick="selectUser(this);" >' + f + ' ' + l + '</a>')
        .css("font-size", "14px")
        .css("color", "#222222")
        .css("cursor", "pointer")
        .css("font-weight", "bold");

    var t1 = $('<td id="ut1-'+k+'" class="jtd"></td>')
            .css("width","140px");
    t1.append(userx);

    var t2 = $('<td id="ut2-'+k+'" class="jtd">'+ e +'</td>')
          .css("width","220px");

    var t3 =  $('<td id="ut3-'+k+'" class="jtd">' + s + '</td>')
          .css("width","80px");

    var t4 =  $('<td id="ut4-'+k+'" class="jtd">'+ c +'</td>')
          .css("width","160px");

    var t5 =  $('<td id="ut5-'+k+'" class="jtd">' + rn + '</td>')
          .css("width","160px");

    tr.append(t1);
    tr.append(t2);
    tr.append(t3);
    tr.append(t4);
    tr.append(t5);
  
    $("#umtab").append(tr);

  }
}

var selectUser = function(o) {

  var sid = o.id;
  gSelUser = gUsers[sid];

  for (k in gUsers) {
    $("#ut1-"+k).css("background-color","white");
    $("#ut2-"+k).css("background-color","white");
    $("#ut3-"+k).css("background-color","white");
    $("#ut4-"+k).css("background-color","white");
    $("#ut5-"+k).css("background-color","white");
  }

  // if clicks on selected user deselect
  if ( gSelUser.user_id !== sid ) {
    $("#ut1-"+sid).css("background-color","yellow");
    $("#ut2-"+sid).css("background-color","yellow");
    $("#ut3-"+sid).css("background-color","yellow");
    $("#ut4-"+sid).css("background-color","yellow");
    $("#ut5-"+sid).css("background-color","yellow");
  } else {
    gSelUser = {};
  }


  //for (k in gUsers) {
  //   if ( gUsers[k].user_id == sid) {
  //    gSelUser = gUsers[k];
  //   }
  //}

  //console.log(JSON.stringify(gSelUser));

}

var uChgStatus = function(o) {

  for (k in gUsers) {
     if ( gUsers[k].user_id == gSelUser.user_id) {
        var nk = k;
     }
  }

  if ( typeof(gSelUser.user_id) !== 'undefined' ) {
    if (  gSelUser.state == 'active' ) {
      var nuState = 'inactive';
    } else {
      var nuState = 'active';
    }
    $("#ut3-"+nk).text(nuState);
    gSelUser.state = nuState;

    updateUser(gSelUser.user_id,'state',nuState);
  } else {
    alert('Select a user');
  }
}


var uChgRole = function(o) {

  for (k in gUsers) {
    if ( gUsers[k].user_id == gSelUser.user_id) {
       var nk = k;
    }
 }

  if ( typeof(gSelUser.role_id) !== 'undefined' ) {
    if (  gSelUser.role_id == 1 ) {
      var nuRole = 2;
      $("#ut5-"+nk).text('application');
    } else {
      var nuRole = 1;
      $("#ut5-"+nk).text('admin');
    }
    gSelUser.role_id = nuRole;

    if ( gSelUser.user_id == gUser.id && nuRole == 2 ) {
      alert('Cannot demote yourself from admin status !');
    } else {
      updateUser(gSelUser.user_id,'role_id',nuRole);
    }
  }
}

var usReset = function(o) {

  if ( typeof(gSelUser.role_id) !== 'undefined' ) {
    if ( $("#pwreset").is(':hidden') ) {
      $("#pwreset").show();
      o.text = 'Save Password';
    } else {
      var pzx = $("#pwreset").val();
      if ( pzx.length > 8 ) {
        updateUser(gSelUser.user_id, 'password', pzx );
        $("#pwreset").hide();
        o.text = 'Reset Password';
      } else {
        alert('Invalid password');
      }
    }
  } else {
    alert('Select a user');
  }

}


var updateUser = function(u,p,v) {

  var pUrl ='/adept/updateUser?t='+ kmu(gKey) +'&u='+u+'&p='+p+'&v='+v;
  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success user update'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          console.log('user succesfully changed')
        }
  });

}

var testSetMan = function(o) {

  $("#rud-results").empty();
  $("#rud-help").hide();

  var tsdiv = $('<div id="tsdiv"></div>')
  .css('width','600px')
  .css('float','left')
  .css('display','block');
  var tsTx = $('<span>Test Set Manager</span>').css('font-size','20px');

  var aphb = $('<a id="naBtn" class="res-tag" type="submit" onclick="helpToggle();" >?</a>')
      .css('font-size','12px')
      .css('background-color','rgb(33,145,194)')
      .css('margin','5px')
      .css('width','15px');

  var ahdiv = $('<div id="app-help-div"></div>')
      .css('display','none');
  var apin = $('<span></span>')
      .css('font-size','12px');
  ahdiv.append(apin);

  apin.append('<h3>About</h3>');
  apin.append('ADEPT defines a <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">Test Set</b> as a random sample of 200 documents from its library that meet a particular set of search criteria. ');
  apin.append(' Users can request the creation of a new test set from the <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">Dictionaries</b> tab or the  <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">Saved Sets</b> tab. '); 
  apin.append(' Once requested, a URL to the test-set will be recorded below.  ');
  apin.append(' Please note that there may be a 30-90 second delay between requesting a test set and its appearance below.');
  apin.append('<br></br>');
  apin.append(' The principal purpose of a test set is to provide users with a realistic example of the data input that goes into a xDD application. ');
  apin.append(' More information about how a test-set can be used in an xDD application can be found <a href=" https://github.com/UW-xDD/xdd-docker-recipe#objective "style="color:#0000FF;">here</a>.');


  tsdiv.append(tsTx);
  tsdiv.append(aphb);
  tsdiv.append('</br>');
  tsdiv.append(ahdiv);
  tsdiv.append('</br>');

  $("#rud-results").append(tsdiv);
  tsTemplate();

}

var tsTemplate = function() {


  var tldiv = $('<div id="tslist-div">Test Sets</br></div>')
            .css('width','180px')
            .css('height','420px')
            .css("overflow-x","hidden")
            .css("overflow-y", "scroll")
            .css('float','left')
            .css('display','block');

  var txdiv = $('<div id="txlist-div"></div>')
            .css('width','10px')
            .css('float','left')
            .css('display','block');

  
  var tsdv = $('<div id="ts-detail-div"></div>')
            .css('width','400px')
            .css('margin', '10px 2px')
            .css("border","solid 0px")
            .css("overflow-x","hidden")
            .css('float','right')
            .css('display','block');

  
  $("#tsdiv").append(tldiv);
  $("#tsdiv").append(tsdv);

  getTestSets();
  
}

var getTestSets = function() {
 
  var pUrl ='/adept/getTestSets?t='+ kmu(gKey) +'&u='+gUser.id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          gTestSets = dres.success.data;
          if ( gTestSets.length  ) {
            showTestSetList();
          } else {
            // empty it out
          }
        }

  });

}

var showTestSetList = function() {

  $(".tsx-dm").each(function() {
    $( this ).remove();
  })

  $("#tslist-div").text("Select Test Set");

  for (k in gTestSets) {
    var t =  gTestSets[k].ts_id;
    var c =  gTestSets[k].col_id;
    var n =  gTestSets[k].ts_name;
    
    var pl = $('<a class="tsx-dm" id="'+k+'-'+t+'" onclick="selectTestSet(this);" >' + n + '</a>')
        .css("font-size", "14px")
        .css("color", "#222222")
        .css("cursor", "pointer")
        .css("font-weight", "bold");
    var cax = $('<div class="tsx-dm" />')
        .css("margin-left", "14px")
        .css("display", "block")
        .css("height", "14px");
        cax.append(pl);
        $("#tslist-div").append(cax);
  }

}

var selectTestSet = function(o) {

  var tid = o.id.split('-');
  var k = tid[0];
  var t = tid[1];

  $("#ts-detail-div").empty();

  var tsn = $('<span><b>Name:</b> '+gTestSets[k].ts_name+'</span>');
  var urlx = '<a href="'+gTestSets[k].ts_url+'" target="blank_" >'+gTestSets[k].ts_url+'</a>'
  var tsu = $('<span><b>Url:</b> '+urlx+'</span>');
  var d = new Date(gTestSets[k].created);
      d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) 
        + "-" + ('0' + d.getDate()).slice(-2);
  var tsd = $('<span><b>Created:</b> '+d+'</span>');




  $("#ts-detail-div").append(tsn);
  $("#ts-detail-div").append('</br>');
  $("#ts-detail-div").append(tsu);
  $("#ts-detail-div").append('</br>');
  $("#ts-detail-div").append(tsd);

}

var tsCyverseSync = function(o) {

}

var appMan = function(o) {

  $("#rud-results").empty();
  $("#rud-help").hide();

  var aphdr = $('<div id="app-hdr-div"></div>');
  var apdiv = $('<div id="app-man-div"></div>');

  var apTx = $('<span>Application Manager</span>')
          .css('font-size','20px');

  var aphb = $('<a id="naBtn" class="res-tag" type="submit" onclick="helpToggle();" >?</a>')
              .css('font-size','12px')
              .css('background-color','rgb(33,145,194)')
              .css('margin','5px')
              .css('width','15px');

  var ahdiv = $('<div id="app-help-div"></div>')
              .css('display','none');
  var apin = $('<span></span>')
              .css('font-size','12px');
  ahdiv.append(apin);

  apin.append('</br>');
  apin.append('ADEPT defines an xDD application as a dockerized set of machine-learning scripts for the purpose of bulk text data-mining. ');
  apin.append('xDD administrators need to monitor whether a submitted application is'); 
  apin.append('   1) respectful of the ADEPT <a href="https://github.com/ngds/ADEPT_frontend/blob/main/TOS.md#terms-of-service"style="color:#0000FF;"> Terms of Service</a> and will work properly on ADEPT\'s high-throughput computing infrastructure.  ');
  apin.append('More details on how to build an xDD application using docker can be found <a href="https://github.com/UW-xDD/xdd-docker-recipe#objective"style="color:#0000FF;">here</a>.');
  apin.append('<h3>Application Review Request and Approval Process</h3>');
  apin.append(' Users can use the applications tab to request that an xDD administrator review and approve an application by clicking on the new button');
  apin.append(' and filling out the application submission form. Users can expect approval or rejection of their submission within 7 business days and');
  apin.append(' can check on the status of the approval request from the applications tab.')
  apin.append('<h3>Application Run Request and Obtaining Results</h3>');
  apin.append('Once an application has been approved by xDD administrators, a user can request that it be deployed at scale on the actual ');
  apin.append('xDD corpus by clicking on the application name in the Application Manager table and filling out the generated form.');

  var naBtn = $('<a id="naBtn" class="res-tag" type="submit" onclick="newApplication();" >New</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');


  aphdr.append(apTx);
  aphdr.append(aphb);
  aphdr.append('</br>');
  aphdr.append(ahdiv);
  aphdr.append('</br>');
  aphdr.append(naBtn);


  $("#rud-results").append(aphdr);
  $("#rud-results").append(apdiv);
  getApps();

}

var helpToggle = function(o) {
  
  $("#app-help-div").toggle();
}

var getApps = function(o) {

  var pUrl ='/adept/getUserApps?t='+ kmu(gKey) +'&u='+gUser.id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          gApps = dres.success.data;
          if ( gApps.length ) {
            showAppTemplate();
          } else {
            // empty it out
          }
        }

  });
}

var selectApp = function(o) {

  var old_id = gSelApp.ua_id;
  var aid = o.id;
  gSelApp = gApps[aid];
  $("#app-div-detail").remove();

  for (k in gApps) {
    $("#ar-"+k).hide();
    $("#gaBtn").hide();
    $("#ab-"+k).css("background-color","white");
    $("#a-"+k).css("background-color","white");
    $("#b-"+k).css("background-color","white");
    $("#c-"+k).css("background-color","white");
    $("#d-"+k).css("background-color","white");
    $("#e-"+k).css("background-color","white");
    $("#f-"+k).css("background-color","white");
    $("#m-"+k).css("background-color","white");
    $("#z-"+k).css("background-color","white");

  }

  // if clicks on selected user deselect
  if ( gSelApp.ua_id !== old_id ) {
    $("#ar-"+aid).show();
    $("#ab-"+aid).css("background-color","yellow");
    $("#a-"+aid).css("background-color","yellow");
    $("#b-"+aid).css("background-color","yellow");
    $("#c-"+aid).css("background-color","yellow");
    $("#d-"+aid).css("background-color","yellow");
    $("#e-"+aid).css("background-color","yellow");
    $("#f-"+aid).css("background-color","yellow");
    $("#m-"+aid).css("background-color","yellow");
    $("#z-"+aid).css("background-color","yellow");
    $("#gaBtn").show();
  
    showAppDetails();

  } else {
    gSelApp = {};
    for (k in gApps) {
      $("#ar-"+k).show();
    }
    $("#app-tab-detail").remove();
    $("#app-div-history").remove();
  }
}

var deleteApp = function(o) {
  var apx = o.id.split('-')[1];
  var appid = gApps[apx].ua_id;
  var pUrl ='/adept/delUserApp?t='+ kmu(gKey) +'&a='+appid;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {

          getApps();
         
        }

  });

}

var addAppToGroup = function(o) {

  var u =  gUser.id;
  var pUrl ='/adept/getUserGroups?t='+ kmu(gKey) +'&u='+u+'&type=owner';

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }

    $("#selGrp").html('');

    for (k in dres.success.data ) {
      var o = $('<option value="'+ dres.success.data[k].group_id +'" >'+dres.success.data[k].group_name+'</option>'); 
      $("#selGrp").append(o);
    }
    $("#selGrp").show();

    $("#gaBtn").text("Save");
    $("#gaBtn").attr("onclick","saveObjToGroup('application')");
    
  });
}
var addDataSet = function(o) {

  var testSetId = $("#selTestSet option:selected").val();
  var testSetName = $("#selTestSet option:selected").text();

  gSelApp.test_set_list.push(testSetId);
  $("#selResources").append("Testset: "+testSetName+ ",");

}

var addDict = function(o) {

  var dictId = $("#selDict option:selected").val();
  var dictName = $("#selDict option:selected").text();

  gSelApp.dict_list.push(dictId);
  $("#selResources").append("Dictionary : "+dictName+ ",");

}

var showAppDetails = function() {
  $("#app-div-history").remove();
  var ns = $('<div id="app-div-detail"></div>');

  var shBtn = $('<a id="hBtn" class="res-tag" type="submit" onclick="getAppHistory();" >Show History</a>')
    .css('font-size','12px')
    .css('background-color','rgb(33,145,194)')
    .css('margin','5px')
    .css('width','100px');
  ns.append(shBtn);
  var sad = $('<div id="app-div-form"></div>');
  ns.append(sad);
  $("#app-man-div").append(ns);


  sad.append('</br><b>Send Application to Process Queue</b></br>');
  sad.append('</br>Notes  ');
  var an = $('<input class="form-control" placeholder="Execution Notes" id="eNotes">');
  sad.append(an);

  sad.append('</br>Cores  ');
  var ac = $('<input class="form-control" placeholder="CPU Cores" id="eCores">');
  sad.append(ac);
  
  sad.append('</br>Memory  ');
  var am = $('<input class="form-control" placeholder="Ram GB" id="eMem">');
  sad.append(am);
  
  sad.append('</br>Test Sets  ');

  var sTs = $('<select id="selTestSet"></select>')
          .css("font-family","calibri")
          .css("border-style","solid 1px")
          .css("border-color","rgb(132, 155, 165)")
          .css("margin","4px 4px");

  appTestSetSelect(sTs);
  sad.append(sTs);

  var nrBtn = $('<a id="nrBtn" class="res-tag" type="submit" onclick="addDataSet();" >Add</a>')
              .css('font-size','12px')
              .css('background-color','rgb(33,145,194)')
              .css('margin','5px')
              .css('width','80px');
  sad.append(nrBtn);

  sad.append('</br>Resources: <span id="selResources" ></span>'); 
  sad.append('</br>');

  var nxBtn = $('<a id="nxBtn" class="res-tag" type="submit" onclick="runApplication();" >Execute</a>')
  .css('font-size','12px')
  .css('background-color','rgb(33,145,194)')
  .css('margin','5px')
  .css('width','80px');
  sad.append(nxBtn);

  var cxBtn = $('<a id="cxBtn" class="res-tag" type="submit" onclick="clearApplication();" >Clear</a>')
  .css('font-size','12px')
  .css('background-color','rgb(33,145,194)')
  .css('margin','5px')
  .css('width','80px');
  sad.append(cxBtn);
  sad.append('</br>');


  gSelApp.test_set_list = [];
  gSelApp.dict_list = [];


}

var runApplication = function() {

  var n = $("#eNotes").val();
  var i = gSelApp.ua_id;
  var c = $("#eCores").val();
  var m  = $("#eMem").val();
  var t = gSelApp.test_set_list.join();
  var d = gSelApp.dict_list.join();

  var pUrl ='/adept/runAppInstance?t='+ kmu(gKey) + '&u='+gUser.id+'&i='+i+'&n='+n+'&c='+c+'&m='+m+'&s='+(t)+'&d='+(d);

  var jqxhr = $.get(pUrl, function() {
      var ssu = 'email Ian '; 
    })
    .done(function(data) { 
      if (typeof(data) == "object" ) {
        var dres = data;
      } else {
        console.log(data);
      }
      getAppHistory();
  });
}

var clearApplication = function(o) {

  $("#eNotes").val("");
  $("#eCores").val("");
  $("#eMem").val("");
  $("#selResources").empty();
  gSelApp.test_set_list = [];
  gSelApp.dict_list = [];
}


var getAppHistory = function(o) {
  
  if ( $("#app-tab-process").length  ) {
    $("#app-div-history").remove();
    $("#app-div-form").show();
    $("#hBtn").text("Show History");
    return;
  } 
  var pUrl ='/adept/getAppHistory?t='+ kmu(gKey) + '&a='+gSelApp.ua_id;
  var jqxhr = $.get(pUrl, function() {
      var ssu = 'email Ian '; 
    })
    .done(function(data) { 
      if (typeof(data) == "object" ) {
        var dres = data;
      } else {
        var dres = JSON.parse(data);
      }
        gSelApp.history = dres.success.data;
        $("#hBtn").text("Hide History");
        $("#app-div-form").hide();
        showAppHistory();
        
      
  });

}
var showAppHistory = function(o) {
   
  $("#app-div-history").remove();
  
  var sad = $('<div id="app-div-history"></div>');
  
  $("#app-div-detail").append(sad);

  var px = $('<table id="app-tab-process"></table>');
  var tr = $('<tr></tr>')
  var tb = $('<th width="30px">Instance</th>');
  var tc = $('<th width="80px">Last Run Date</th>');
  var td = $('<th width="140px">Notes</th>');
  var te = $('<th width="30px">Status</th>');
  var tf = $('<th width="80px">Test Sets</th>');
  var tl = $('<th width="120px">Link to Result</th>');

  sad.append(px);
  px.append(tr);
  tr.append(tb);
  tr.append(tc);
  tr.append(td);
  tr.append(te);
  tr.append(tf);
  tr.append(tl);

  for (k in gSelApp.history ) {
    var tr = $('<tr></tr>');
    var tb = $('<td>'+k+'</td>');
    var d = new Date(gSelApp.history[k].created);
      d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) 
        + "-" + ('0' + d.getDate()).slice(-2);
    var tc = $('<td>'+d+'</td>');
    var td = $('<td>'+gSelApp.history[k].proc_notes+'</td>');
    var te = $('<td>'+gSelApp.history[k].state+'</td>');
    var tf = $('<td>'+gSelApp.history[k].test_sets+'</td>');
    var urlx = '<a href="'+gSelApp.history[k].output_link+'" target="blank_" >'+gSelApp.history[k].output_link+'</a>'
    var tl = $('<td>'+urlx+'</td>');
    tr.append(tb);
    tr.append(tc);
    tr.append(td);
    tr.append(te);
    tr.append(tf);
    tr.append(tl);
    px.append(tr);
  }

}



var newApplication = function(o) {
  if ( $("#aName").length ) {
  	return;
  }
  var am = $("#app-man-div");
  $("#app-div-detail").remove();
  $("#apptab").hide();
  var ad = $('<div id="new-app-div"></div>');
  am.append(ad);

  var an = $('<input class="form-control" placeholder="Application Name" id="aName" style="background-color: #EEE8B7">');
  //var adl = $('<input class="form-control" placeholder="Date Limit" id="aDateLim">');
  var adid = $('<input class="form-control" placeholder="Docker Id" id="aDID" style="background-color: #EEE8B7">');
  var csum = $('<input class="form-control" placeholder="Checksum" id="aChecksum" style="background-color: #EEE8B7">');
  var sApT = $('<textarea rows="5" cols="50" id="AppDesc" placeholder="Application Description" style="background-color: #EEE8B7">');
  //var sApT = $('<input class="form-control" placeholder="Application Description" id="AppDesc">');
  var aco = $('<input class="form-control" placeholder="Cores" id="aCores" style="background-color: #EEE8B7">');
  var ame = $('<input class="form-control" placeholder="Memory" id="aMemory" style="background-color: #EEE8B7">');
  var gitre = $('<input class="form-control" placeholder="Github" id="aGithub">');
  var runti = $('<input class="form-control" placeholder="Runtime" id="aRuntime">');
  
  ad.append('</br>');
  ad.append(an);
  ad.append('</br>');
  ad.append(sApT);
  ad.append('</br>Application Identifier and Version</br>');
  ad.append(adid);
  ad.append('</br>');
  ad.append(csum);
  ad.append('</br>Resources Required to Execute</br>');
  ad.append(aco);
  ad.append('</br>');
  ad.append(ame);
  ad.append('</br>');
  ad.append(gitre);
  ad.append('</br>');
  ad.append(runti);
  ad.append('</br>');
  ad.append('<span>Default Test Set </span>');


  var sQ = $('<select id="selTestSets"></select>')
            .css("font-family","calibri")
            .css("border-style","solid 1px")
            .css("border-color","rgb(132, 155, 165)")
            .css("margin","4px 4px");

  appTestSetSelect(sQ);
  ad.append(sQ);

  var saveBtn = $('<a id="saveAppBtn" class="res-tag" type="submit" onclick="SaveNewApp();" >Save & Register</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','120px');

  var cancelBtn = $('<a id="cancelAppBtn" class="res-tag" type="submit" onclick="cancelNewApp();" >Cancel</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  ad.append('</br>');
  ad.append(saveBtn);
  ad.append(cancelBtn);    

}


var appTestSetSelect = function(sb) {

  var pUrl ='/adept/getTestSets?t='+ kmu(gKey) +'&u='+gUser.id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          gTestSets = dres.success.data;
          if ( gTestSets.length  ) {
            for( k in gTestSets) {
              var ox = $('<option value="'+ gTestSets[k].ts_id + '" selected>' + gTestSets[k].ts_name + '</option>');
              sb.append(ox);
            }           
          }
        }
  });
}


var appDictSelect = function(sb) {

  pUrl = '/adept/getFilteredDictionaries?t='+ kmu(gKey)+'&u='+gUser.id;
  gDLType = 'Local Saved';

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict records'; 
  })
  .done(function(data) { 

        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        gDictList = dres.success.data;
        
        if ( gDictList.length  ) {
          for( k in gDictList) {
            var ox = $('<option value="'+ gDictList[k].dict_id + '" selected>' + gDictList[k].name + '</option>');
            sb.append(ox);
          }           
        }
    });
}

var SaveNewApp = function() {

  var an = $("#aName").val();
  var csum =  $("#aChecksum").val();
  var adid =  $("#aDID").val();
  var sApT =  $("#AppDesc").val();
  var aco =  $("#aCores").val();
  var ame =  $("#aMemory").val();
  var gitre =  $("#aGithub").val();
  var runti =  $("#aRuntime").val();


  var sts =  $("#selTestSets option:selected").val();

  pUrl = '/adept/newUserApp?t='+ kmu(gKey)+'&u='+gUser.id+'&n='+an+'&d='+sApT+'&i='+adid+'&c='+aco+'&m='+ame+'&s='+csum+'&g='+gitre+'&r='+runti+'&z='+sts;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict records'; 
  })
  .done(function(data) { 

    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }

    $("#apptab").show();
    $("#apptab").empty();
    $("#new-app-div").remove();
    getApps();
       
  });


}

var cancelNewApp = function() {

  $('#new-app-div').remove();
  $("#apptab").show();

}

var showAppTemplate = function() {

  $("#app-man-div").empty();
  
    var pt = $('<table id="apptab"></table>')
    var tr = $('<tr></tr>')
    var tm = $('<th></th>');
    var ta = $('<th width="160px">Application</th>');
    var tb = $('<th width="110px">Description</th>');
    var tc = $('<th width="110px">Docker Image</th>');
    var td = $('<th width="80px">Cores/Memory</th>');
    var te = $('<th width="80px">Timestamp</th>');
    var tf = $('<th width="70px">Status</th>');
    var tz = $('<th width="70px">Test Set</th>');

    tr.append(tm);
    tr.append(ta);
    tr.append(tb);
    tr.append(tc);
    tr.append(td);
    tr.append(te);
    tr.append(tf);
    tr.append(tz);
    pt.append(tr);
  
    for (k in gApps) {
      var i =  gApps[k].ua_id;
      var n =  gApps[k].app_name;
      var t =  gApps[k].app_desc;
      var l =  gApps[k].docker_image;
      var r =  gApps[k].resources;
      var z =  gApps[k].default_ts_id;
      var y =  gApps[k].default_testset;

      var c =  new Date(gApps[k].created);

      c = c.getFullYear() + "-" + ('0' + (c.getMonth() + 1)).slice(-2) 
              + "-" + ('0' + c.getDate()).slice(-2);

      var s = gApps[k].state;
  
      var ak = gApps[k].app_key;
  
      var tr = $('<tr id="ar-'+k+'"></tr>');

      var appD = $('<a class="tsx-dm" id="appdel-'+k+'" onclick="deleteApp(this);" ><i class="fa fa-trash"></i></a>')
            .css("font-size", "14px")
            .css("color", "#196fa6")
            .css("cursor", "pointer")
            .css("margin", "4px 4px")
            .css("font-weight", "bold");
      var tm = $('<td id="m-'+k+'"></td>');
      tm.append(appD);

      var appx = $('<a class="tsx-dm" id="'+k+'" onclick="selectApp(this);" >' + n + '</a>')
            .css("font-size", "14px")
            .css("color", "#222222")
            .css("cursor", "pointer")
            .css("font-weight", "bold");

  
      var ta = $('<td id="a-'+k+'"></td>');
      ta.append(appx);

      var tb = $('<td id="b-'+k+'">'+t+'</td>');
      var tc = $('<td id="c-'+k+'">'+l+'</td>');
      var td = $('<td id="d-'+k+'">'+r+'</td>');
      var te = $('<td id="e-'+k+'">'+c+'</td>');
      var tf = $('<td id="f-'+k+'">'+s+'</td>');
      var tz = $('<td id="z-'+k+'">'+y+'</td>');
      
      tr.append(tm);
      tr.append(ta);
      tr.append(tb);
      tr.append(tc);
      tr.append(td);
      tr.append(te);
      tr.append(tf);
      tr.append(tz);
      pt.append(tr);
  
    }
  
    $("#app-man-div").append(pt);

}


var grpMan = function(o) {

  $("#rud-results").empty();
  $("#rud-help").hide();

  var gphdr = $('<div id="grp-hdr-div"></div>');
  var gpdiv = $('<div id="grp-man-div"></div>');

  var apTx = $('<h5>Group Manager</h5>');
  var naBtn = $('<a id="ngBtn" class="res-tag" type="submit" onclick="newGroup();" >New</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');
  
  var egBtn = $('<a id="egBtn" class="res-tag" type="submit" onclick="editGroup();" >Edit</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  var rgBtn = $('<a id="rgBtn" class="res-tag" type="submit" onclick="delGroup();" >Remove</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('display', 'none')
        .css('width','80px');

  var amBtn = $('<a id="amBtn" class="res-tag" type="submit" onclick="addMemberToGroup();" >Add Member</a>')
        .css('display','none')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  var amBox = $('<input class="form-control" id="amBox" placeholder="User email">')
        .css("display", "none")
        .css("font-size", "11px");

  var jgBtn = $('<a id="jgBtn" class="res-tag" type="submit" onclick="joinGroup();" >Join</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');
  
  var sG = $('<select id="selxGrp"></select>')
        .css("font-family","calibri")
        .css("font-weight","bold")
        .css("border-style","solid 1px")
        .css("margin","4px 4px");

  gphdr.append(apTx);
  gphdr.append(naBtn);
  gphdr.append(rgBtn);
  gphdr.append(amBtn);
  gphdr.append(amBox);
  gphdr.append(jgBtn);
  gphdr.append(sG);
  $("#rud-results").append(gphdr);
  $("#rud-results").append(gpdiv);
  getOtherGroups();
  getGroups();

}

var getGroups = function(o) {
  var gType = o;
  var pUrl ='/adept/getUserGroups?t='+ kmu(gKey) +'&u='+gUser.id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          gGroups = dres.success.data;
          if ( gGroups.length ) {
            if ( gType == 'colset' ) {
              if ( gGroups.length ) {
                for (k in gGroups ) {
                  var ot = gGroups[k].group_name + ' - '+ gGroups[k].owner_name;
                  var opt = $('<option value="'+ gGroups[k].group_id +'" >'+ot+'</option>'); 
                  $("#selxGrp").append(opt);
                }
              } else {
                $("#selxGrp").empty();
              }
            } else {
              showGroupTemplate();
            }
            
          } else {
            // empty it out
          }
        }

  });
}

var getOtherGroups = function(o) {

  var pUrl ='/adept/getUserGroups?t='+ kmu(gKey) +'&u='+gUser.id+'&type=other';
  $("#selxGrp").empty();
  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success dict terms'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          gOtherGroups = dres.success.data;
          if ( gOtherGroups.length ) {
            for (k in gOtherGroups ) {
              var ot = gOtherGroups[k].group_name + ' - '+ gOtherGroups[k].owner_name;
              var o = $('<option value="'+ gOtherGroups[k].group_id +'" >'+ot+'</option>'); 
              $("#selxGrp").append(o);
            }
           
          } else {
            // empty it out
          }
        }

  });
}

var delGroup = function(o) {

  if ( gSelGrp.gtype == 'member') {

    var pUrl ='/adept/leaveGroup?t='+ kmu(gKey) +'&u='+gUser.id+'&g='+gSelGrp.group_id;
   
    var jqxhr = $.get(pUrl, function() {
      var ssu = 'success leave group'; 
    })
    .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        $("#jgBtn").show();
        $("#selxGrp").show();
        getOtherGroups();
        getGroups();

    });

  } else {
    alert('Are you sure you want to delete this group ?');

  }
}

var joinGroup = function(o) {
  var gid = $("#selxGrp").val();
  if ( typeof(gid) == "undefined") {
    alert('Select a group to join');
  } else {
   
    var pUrl ='/adept/joinGroup?t='+ kmu(gKey) +'&u='+gUser.id+'&g='+gid;
   
    var jqxhr = $.get(pUrl, function() {
      var ssu = 'success dict terms'; 
    })
    .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        getOtherGroups();
        getGroups();

    });

  }
 

}

var showGroupTemplate = function() {

  $("#grp-man-div").empty();
  $("#rgBtn").hide();
  var pt = $('<table id="grptab"></table>')
  var tr = $('<tr></tr>')
  
  var ta = $('<th width="100px">Group</th>');
  var tb = $('<th width="80px">Owner</th>');
  var tc = $('<th width="60px">Type</th>');
  var td = $('<th width="60px">Created</th>');
  var te = $('<th width="50px">Status</th>');
  var tf = $('<th width="120px">Notes</th>');
  var tg = $('<th width="140px">Members</th>');
    
  tr.append(ta);
  tr.append(tb);
  tr.append(tc);
  tr.append(td);
  tr.append(te);
  tr.append(tf);
  tr.append(tg);
  pt.append(tr);

  for (k in gGroups) {
      var i =  gGroups[k].group_id;
      var n =  gGroups[k].group_name;
      var o =  gGroups[k].owner_name;
      var t =  gGroups[k].gtype;
     
      var c = new Date(gGroups[k].created);
      var s = gGroups[k].state;
      var l =  gGroups[k].notes;
      var mo = gGroups[k].members;

      c = c.getFullYear() + "-" + ('0' + (c.getMonth() + 1)).slice(-2) 
            + "-" + ('0' + c.getDate()).slice(-2);
       
      if (typeof(mo) == "object" ) {
        var dx = mo;
      } else {
        var dx = JSON.parse(mo);
      }
    
      var tr = $('<tr id="gr-'+k+'"></tr>')
      
      var ta = $('<td id="a-'+k+'"></td>');
      var appg = $('<a class="tsx-dm" id="grpsel-'+k+'" onclick="selectGrp(this);" >' + n + '</a>')
            .css("font-size", "12px")
            .css("color", "#222222")
            .css("cursor", "pointer")
            .css("font-weight", "bold");
      ta.append(appg);

      var tb = $('<td id="b-'+k+'">'+o+'</td>');
      var tc = $('<td id="c-'+k+'">'+t+'</td>');
      var td = $('<td id="d-'+k+'">'+c+'</td>');
      if ( t == 'owner') {
        var gsc =  $('<a class="tsx-dm" id="gstate-'+k+'" onclick="chgGrpState(this);" >' + s + '</a>')
              .css("font-size", "12px")
              .css("color", "#222222")
              .css("cursor", "pointer")
              .css("font-weight", "bold");
        var te = $('<td id="e-'+k+'"></td>');
        te.append(gsc);

        var gn = $('<input class="form-control" id="gNote-'+k+'">')
            .css("display", "none")
            .css("font-size", "11px")
            .css("color", "#222222")
            .css("cursor", "pointer")
            .css("font-weight", "bold");

        var gnc =  $('<a class="tsx-dm" id="gnc-'+k+'" onclick="chgGrpNote(this);" >' + l + '</a>')
              .css("font-size", "11px")
              .css("color", "#222222")
              .css("cursor", "pointer")
              .css("font-weight", "bold");
        var tf = $('<td id="f-'+k+'"></td>');
        tf.append(gnc);
        tf.append(gn);

        var tg = $('<td id="g-'+k+'"></td>');
        for ( z in mo ) {

          var gmx = $('<i class="fa fa-trash-alt" id="dgm-'+i+'-'+mo[z].user_id+'" onclick="delGrpMember(this)"></i>')
              .css("margin","3px;")
              .css("font-size", "10px;")
              .css('color','rgb(33,145,194)');
          tg.append(gmx);
          tg.append(mo[z].email);
          tg.append('</br>');
           
        }
        
      } else {
        var te = $('<td id="e-'+k+'">'+s+'</td>');
        var tf = $('<td id="f-'+k+'">'+l+'</td>');
        var m = '';
        for (z in mo) {
          if ( m.length > 1 ) { var sep = '</br>'; } else { var sep = ''; }
          m = m + sep + mo[z].email;
        }
        var tg = $('<td id="g-'+k+'">'+m+'</td>');
      }
     
  
      tr.append(ta);
      tr.append(tb);
      tr.append(tc);
      tr.append(td);
      tr.append(te);
      tr.append(tf);
      tr.append(tg);
      pt.append(tr);
  
  }

  $("#grp-man-div").append(pt);

}

var chgGrpNote = function(o) {

  var gid = '#gNote-'+o.id.split('-')[1];
  if ( $(o).text() == 'Save' ) {
    $(o).text($(gid).val());
    $(o).removeClass("tag");
    $(gid).val("");
    $(gid).hide();
  } else {
    $(gid).val($(o).text() );
    $(o).text("Save");
    $(o).addClass("tag");
    $(gid).show();
  }

}

var chgGrpState = function(o) {

  if ( $(o).text() == 'new') {
    $(o).text("active");
  } else if ( $(o).text() == 'active' ) {
    $(o).text("inactive");
  } else if ( $(o).text() == 'inactive' ) {
    $(o).text("active");
  }

}

var selectGrp = function(o) {

    if ( typeof(gSelGrp) !== 'undefined' && typeof(gSelGrp.group_id) !== 'undefined' ) {
      var old_id = gSelGrp.group_id;
    } else {
      var old_id = -1;
    }
    
    var aid = o.id.split('-')[1];
    gSelGrp = gGroups[aid];
    $("#rgBtn").show();
    $("#jgBtn").hide();
    $("#selxGrp").hide();
    if ( gSelGrp.gtype == 'member') {
      $("#rgBtn").text('Leave Group');
    } else {
      $("#rgBtn").text('Remove');

    }

    $("#grpDetailTab").remove();
    $("#doga").remove();

    for (k in gGroups) {
      $("#gr-"+k).hide();
      $("#a-"+k).css("background-color","white");
      $("#b-"+k).css("background-color","white");
      $("#c-"+k).css("background-color","white");
      $("#d-"+k).css("background-color","white");
      $("#e-"+k).css("background-color","white");
      $("#f-"+k).css("background-color","white");
      $("#g-"+k).css("background-color","white");
  
    }
  
   
    // if clicks on selected user deselect
    if ( gSelGrp.group_id !== old_id ) {
      $("#gr-"+aid).show();
      $("#a-"+aid).css("background-color","yellow");
      $("#b-"+aid).css("background-color","yellow");
      $("#c-"+aid).css("background-color","yellow");
      $("#d-"+aid).css("background-color","yellow");
      $("#e-"+aid).css("background-color","yellow");
      $("#f-"+aid).css("background-color","yellow");
      $("#g-"+aid).css("background-color","yellow");
      if ( gSelGrp.gtype == 'owner' ) {
        $("#amBtn").show();
        $("#amBox").show();
      }

      showGroupDetails();

    } else {

      $("#amBtn").hide();
      $("#amBox").hide();
      $("#jgBtn").show();
      $("#selxGrp").show();
      gSelGrp = {};
      for (k in gGroups) {
        $("#gr-"+k).show();
      }
    }

}

var showGroupDetails = function(o) {

  var pUrl ='/adept/getGroupObjects?t='+ kmu(gKey) +'&g='+gSelGrp.group_id;
   
  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success leave group'; 
  })
  .done(function(data) { 
      if (typeof(data) == "object" ) {
        var dres = data;
      } else {
        var dres = JSON.parse(data);
      }
      gSelGrp.objects = dres.success.data;
      
      selGrpTemplate();


  });
}

var selGrpTemplate = function() {


  var pt = $('<table id="grpDetailTab"></table>')
  var tr = $('<tr></tr>')
  
  var ta = $('<th width="80px">Type</th>');
  var tb = $('<th width="160px">Name</th>');
  var tc = $('<th width="80px">Created</th>');
  var td = $('<th width="50px">Status</th>');

  tr.append(ta);
  tr.append(tb);
  tr.append(tc);
  tr.append(td);

  pt.append(tr);

  for (k in gSelGrp.objects) {
    var i =  gSelGrp.objects[k].group_id;
    var o =  gSelGrp.objects[k].object_id;
    var t =  gSelGrp.objects[k].object_type;
    var n = gSelGrp.objects[k].name;
   
    var c = new Date(gSelGrp.objects[k].created);
    var s = gSelGrp.objects[k].state;

    c = c.getFullYear() + "-" + ('0' + (c.getMonth() + 1)).slice(-2) 
          + "-" + ('0' + c.getDate()).slice(-2);
     
    var tr = $('<tr id="gr-'+k+'"></tr>');
    var ta = $('<td id="a-'+k+'">'+t+'</td>');
    var tb = $('<td id="b-'+k+'">'+n+'</td>');
    var tc = $('<td id="c-'+k+'">'+c+'</td>');
    var td = $('<td id="d-'+k+'">'+s+'</td>');

    tr.append(ta);
    tr.append(tb);
    tr.append(tc);
    tr.append(td);
    pt.append(tr);

  }
  $("#grp-man-div").append('</br><span id="doga" >Data Objects Assigned to Group</span>');
  $("#grp-man-div").append(pt);

}

var newGroup = function(o) {

  var am = $("#grp-man-div");
  $("#grptab").hide();
  var ad = $('<div id="new-grp-div">New Group</div>');
  am.append(ad);

  var an = $('<input class="form-control" placeholder="Group Name" id="gName">');
  var adl = $('<input class="form-control" placeholder="Notes" id="gNotes">');
  
  var ado = $('<input class="form-control" placeholder="Email user name" id="gMem1">');
  var ad1 = $('<input class="form-control" placeholder="Email user name" id="gMem2">');
  var ad2 = $('<input class="form-control" placeholder="Email user name" id="gMem3">');
  
  ad.append('</br>');
  ad.append(an);
  ad.append('</br>');
  ad.append(adl);
  ad.append('</br>Share With</br>');
  ad.append(ado);
  ad.append('</br>');
  ad.append(ad1);
  ad.append('</br>');
  ad.append(ad2);
  ad.append('</br>');

  var saveBtn = $('<a id="saveAppBtn" class="res-tag" type="submit" onclick="saveNewGroup();" >Save</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  var cancelBtn = $('<a id="cancelAppBtn" class="res-tag" type="submit" onclick="cancelNewGroup();" >Cancel</a>')
        .css('font-size','12px')
        .css('background-color','rgb(33,145,194)')
        .css('margin','5px')
        .css('width','80px');

  ad.append('</br>');
  ad.append(saveBtn);
  ad.append(cancelBtn);    

}

var saveNewGroup = function(o) {
  
  var gn = $("#gName").val();
  var gs =  $("#gNotes").val();
  var gm1 =  $("#gMem1").val();
  var gm2 =  $("#gMem2").val();
  var gm3 =  $("#gMem3").val();

  var gmem = '';
  if ( gm1.indexOf("@") > 3 ) {
    gmem = gm1;
  }

  if ( gm2.indexOf("@") > 3 ) {
    if ( gmem.length > 3 ) {
      gmem = gmem +','+ gm2;
    } else {
      gmem = gm2;
    }
  }

  if ( gm3.indexOf("@") > 3 ) {
    if ( gmem.length > 3 ) {
      gmem = gmem +','+ gm3;
    } else {
      gmem = gm3;
    }
  }

  pUrl = '/adept/newUserGroup?t='+ kmu(gKey)+'&u='+gUser.id+'&n='+gn+'&d='+gs+'&m='+gmem;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success new group'; 
  })
  .done(function(data) { 

    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }

    $("#grptab").show();
    $("#grptab").empty();
    $("#new-grp-div").remove();
    getGroups();
       
  });

}

var addMemberToGroup = function(o) {

  var nm =  $("#amBox").val();
  pUrl = '/adept/addMemberToGroup?t='+ kmu(gKey)+'&g='+gSelGrp.group_id+'&m='+nm;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success new group'; 
  })
  .done(function(data) { 

    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    if ( dres.success.data ) {
      var stat = dres.success.data[0].add_group_member;
      var sa = stat.split('-');
      if ( sa[0] == 'Success') {
        alert('User added to group');
      } else {
        alert('User not found ');
      }
    }
    
    getGroups();
       
  });
  

}

var delGrpMember = function(o) {

  var ga = o.id.split('-');
  var u = ga[2];
  var g = ga[1];

  var pUrl ='/adept/leaveGroup?t='+ kmu(gKey) +'&u='+u+'&g='+g;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success new group'; 
  })
  .done(function(data) { 

    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    
    getGroups();
       
  });

}

var cancelNewGroup = function(o) {

  $("#grptab").show();
  $("#new-grp-div").remove();

}

var collectionMan = function(o) {

  $("#rud-results").empty();
  $("#rud-help").hide();

  
  var codiv = $('<div id="coldiv"></div>')
  .css('width','600px')
  .css('float','left')
  .css('display','block');
  var coTx = $('<span>Data Set Management</span>').css('font-size','20px');
  var aphb = $('<a id="naBtn" class="res-tag" type="submit" onclick="helpToggle();" >?</a>')
  .css('font-size','12px')
  .css('background-color','rgb(33,145,194)')
  .css('margin','5px')
  .css('width','15px');

  var ahdiv = $('<div id="app-help-div"></div>')
    .css('display','none');
  var apin = $('<span></span>')
    .css('font-size','12px');
  ahdiv.append(apin);

  apin.append('<h3>About</h3>');
  apin.append('A <b style="background-color:rgb(33,145,194);color:White;padding:.2%;">Saved Set</b> is a group of search criteria that can be used to define a set of documents.');
  apin.append(' Users build the search criteria from the main ADEPT Search page.');
  apin.append(' Please view the following tutorial video for more instructions.');
  apin.append('<br></br>');
  


  codiv.append(coTx);
  codiv.append(aphb);
  codiv.append('</br>');
  codiv.append(ahdiv);
  $("#rud-results").append(codiv);
  colTemplate();
}

var colTemplate = function(o) {

  var cnBtn = $('<a id="cnBtn" class="res-tag" type="submit" onclick="colNew(this);">New</a>')
    .css('font-size','12px')
    .css('background-color','rgb(33,145,194)')
    .css('margin','5px')
    .css('width','80px');

  var dcBtn = $('<a id="dcBtn" class="res-tag" type="submit" onclick="deleteCollection(this);">Delete</a>')
    .css('font-size','12px')
    .css('display', 'none')
    .css('background-color','rgb(33,145,194)')
    .css('margin','5px')
    .css('width','80px');

  var rtBtn = $('<a id="rtBtn" class="res-tag" type="submit" onclick="colrequestTS(this);">Request Test Set</a>')
    .css('font-size','12px')
    .css('display', 'none')
    .css('background-color','rgb(33,145,194)')
    .css('margin','5px')
    .css('width','120px');

  var cni = $('<input class="form-control" placeholder="Set Name" size=25 id="colname">')
    .css("margin", "2px 0px")
    .css('display', 'none');

  var clldiv = $('<div id="colist-div"></div>')
            .css('display','block');
  
  $("#coldiv").append(cnBtn);
  $("#coldiv").append(dcBtn);
  $("#coldiv").append(rtBtn);
  $("#coldiv").append('</br>');
  $("#coldiv").append(cni);
  $("#coldiv").append('</br>');
  $("#coldiv").append(clldiv);

  getCollections('template');
 
}

var colrequestTS = function(o) {
  // send to Geo Deep Dive
  var cn = gSelCollection.col_id;

  var pUrl = '/adept/registerCollection?t='+kmu(gKey)+'&u='+gUser.id+'&c='+cn;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success add collection'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success ) {
          getCollections('template');
        } else {
            // empty it out
            alert('Most requests will be available within a few seconds, please go to Test Sets ');
        }

  });

}

var colNew = function() {
  // create new collection
  $("#colname").empty();
  $("#colname").show()
  $("#cnBtn").text('Save');
  $("#dcBtn").text('Cancel');
  $("#cnBtn").attr("onclick","createNewCollection(this)");

}

var createNewCollection = function(o) {
  var cn = $("#colname").val();
  var pUrl = '/adept/newCollection?t='+kmu(gKey)+'&u='+gUser.id+'&c='+cn;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success add collection'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        $("#colname").hide()
        $("#cnBtn").text('New');
        $("#dcBtn").text('Delete');
        $("#cnBtn").attr("onclick","colNew(this)");
        
        if ( dres.success ) {

          getCollections('template');
        } else {
            // empty it out
          alert('New Collection Error') ;
        }

  });

}

var getCollections = function(o) {

  var pUrl ='/adept/getCollections?t='+ kmu(gKey) +'&u='+gUser.id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          gCollections = dres.success.data;
          if ( gCollections.length ) {
            if ( o == 'template') {
              showDatasets();
              loginSelCol();
            } else if ( o == 'login' ) {
              loginSelCol();
            }
           
          } else {
            // empty it out
          }
        }

  });
}

var showDatasets = function() {

  $("#colist-div").empty();

  var pt = $('<table id="coltab"></table>')
  var tr = $('<tr></tr>')
  
  var ta = $('<th width="100px">Dataset</th>');
  var tb = $('<th width="120px">Owner</th>');
  var tc = $('<th width="60px">Created</th>');
  var td = $('<th width="60px">Searches</th>');
  var te = $('<th width="60px">Count</th>');
  var tf = $('<th width="60px">Saved</th>');
  
  tr.append(ta);
  tr.append(tb);
  tr.append(tc);
  tr.append(td);
  tr.append(te);
  tr.append(tf);
  pt.append(tr);

  for (k in gCollections) {
      var i =  gCollections[k].col_id;
      var n =  gCollections[k].col_name;
      var u =  gCollections[k].user_id;
      var o =  gCollections[k].email;
      var s1 = gCollections[k].scnt;
      var s2 = gCollections[k].srecs;
      var s3 = gCollections[k].mdcnt;
      var c = new Date(gCollections[k].created);
      var g = gCollections[k].jgrp;
 
      c = c.getFullYear() + "-" + ('0' + (c.getMonth() + 1)).slice(-2) 
            + "-" + ('0' + c.getDate()).slice(-2);
      
      if (g) {
        if (typeof(g) == "object" ) {
          var grp = g;
        } else {
          var grp = JSON.parse(g);
        }
      } else {
        var grp = null;
      }
    
      var tr = $('<tr id="co-'+k+'"></tr>')
      
      var ta = $('<td id="a-'+k+'"></td>');
      var cola = $('<a class="tsx-dm" id="colsel-'+k+'" onclick="selectCol(this);" >' + n + '</a>')
            .css("font-size", "14px")
            .css("cursor", "pointer")
            .css("font-weight", "bold");
      ta.append(cola);

      var tb = $('<td id="b-'+k+'">'+o+'</td>');
      var tc = $('<td id="c-'+k+'">'+c+'</td>');
      var td = $('<td id="d-'+k+'">'+s1+'</td>');
      var te = $('<td id="e-'+k+'">'+s2+'</td>');
      var tf = $('<td id="f-'+k+'">'+s3+'</td>');
      //var te = $('<td id="e-'+k+'"></td>');
      
  
     
      tr.append(ta);
      tr.append(tb);
      tr.append(tc);
      tr.append(td);
      tr.append(te);
      tr.append(tf);
      //tr.append(te);
      pt.append(tr);
  
  }
  
  $("#colist-div").append(pt);
  //getMemberDatasets(pt,'template');

}

var getMemberDatasets = function(o,gType) {

   // Get collections that I are in groups I am a member of
   var pUrl ='/adept/getCollections?t='+ kmu(gKey) +'&m='+gUser.id;

   var jqxhr = $.get(pUrl, function() {
     var ssu = 'success member collections'; 
   })
   .done(function(data) { 
         if (typeof(data) == "object" ) {
           var dres = data;
         } else {
           var dres = JSON.parse(data);
         }
 
         if ( dres.success.data ) {
           gMemberCollections = dres.success.data;
           if ( gType == 'template') {
            showMemberDatasets(o);
           } else {

           }
           
         }
    });
  
}

var showMemberDatasets = function(pt) {
  // Get collections that I are in groups I am a member of

    if ( gMemberSelCollection.length ) {
        for (k in gMemberCollections) {
          var i =  gMemberCollections[k].object_id;
          var n =  gMemberCollections[k].col_name;
          var u =  gMemberCollections[k].user_id;
          var o =  gMemberCollections[k].owner_name;

          var c = new Date(gMemberCollections[k].col_created);
          var g = gMemberCollections[k].group_name;
      
          c = c.getFullYear() + "-" + ('0' + (c.getMonth() + 1)).slice(-2) 
                + "-" + ('0' + c.getDate()).slice(-2);
          
          var tr = $('<tr id="cm-'+k+'"></tr>');
          var ta = $('<td id="am-'+k+'" style=""></td>').css("background-color", "#bedebe");
          var cola = $('<a class="tsx-dm" id="colsel-'+k+'" onclick="selectMemCol(this);" >' + n + '</a>')
                .css("font-size", "16px")
                .css("cursor", "pointer")
                .css("font-weight", "bold");
          ta.append(cola);
          var tb = $('<td id="bm-'+k+'">'+o+'</td>').css("background-color", "#bedebe");
          var tc = $('<td id="cm-'+k+'">'+c+'</td>').css("background-color", "#bedebe");
          var td = $('<td id="dm-'+k+'">-</td>').css("background-color", "#bedebe");
          var te = $('<td id="em-'+k+'">-</td>').css("background-color", "#bedebe");
          var tf = $('<td id="fm-'+k+'">-</td>').css("background-color", "#bedebe");
          
          tr.append(ta);
          tr.append(tb);
          tr.append(tc);
          tr.append(td);
          tr.append(te);
          tr.append(tf);
          pt.append(tr);
        }

    }



}

var showCollectionList = function() {

  $(".clx-dm").each(function() {
    $( this ).remove();
  })

  $("#col-search-div").empty();

  for (k in gCollections) {
    var i =  gCollections[k].col_id;
    var n =  gCollections[k].col_name;
 
    var pl = $('<a class="clx-dm" id="'+k+'-'+i+'" onclick="selectCollection(this);" >' + n + '</a>')
        .css("font-size", "14px")
        .css("color", "#222222")
        .css("cursor", "pointer")
        .css("font-weight", "bold");

    var cax = $('<div class="clx-dm" />')
        .css("margin-left", "14px")
        .css("display", "block")
        .css("height", "14px");
       
        cax.append(pl);
        $("#colist-div").append(cax);
  }

}

var selectMemCol = function(o) {

  if ( typeof(gMemberSelCollection) !== 'undefined' && typeof(gMemberSelCollection.object_id) !== 'undefined' ) {
    var old_id = gMemberSelCollection.object_id;
  } else {
    var old_id = -1;
  }
  
  var cid = o.id.split('-')[1];
  gMemberSelCollection = gMemberCollections[cid];

  for (k in gCollections) {
    $("#co-"+k).hide();
    $("#a-"+k).css("background-color","white");
    $("#b-"+k).css("background-color","white");
    $("#c-"+k).css("background-color","white");
    $("#d-"+k).css("background-color","white");
    $("#e-"+k).css("background-color","white");
    $("#f-"+k).css("background-color","white");
  }

  for (k in gMemberCollections) {
    $("#cm-"+k).hide();
    $("#am-"+k).css("background-color","white");
    $("#bm-"+k).css("background-color","white");
    $("#cm-"+k).css("background-color","white");
    $("#dm-"+k).css("background-color","white");
    $("#me-"+k).css("background-color","white");
  }

  if ( gMemberSelCollection.object_id !== old_id ) {
    $("#cnBtn").hide();
    $("#rtBtn").show();
  

    $("#cm-"+cid).show();
    $("#am-"+cid).css("background-color","yellow");
    $("#bm-"+cid).css("background-color","yellow");
    $("#cm-"+cid).css("background-color","yellow");
    $("#dm-"+cid).css("background-color","yellow");
    $("#em-"+cid).css("background-color","yellow");
    $("#fm-"+cid).css("background-color","yellow");
    showColDetail(gMemberSelCollection.object_id, 'member');

  } else {
    $("#cnBtn").show();
    $("#dcBtn").hide();
    $("#rtBtn").hide();
    $("#gaBtn").hide();
    $("#selxGrp").hide();
    $("#col-search-div").remove();
    gMemberSelCollection = {};
    for (k in gCollections) {
      $("#co-"+k).show();
    }

    for (k in gMemberCollections) {
      $("#cm-"+k).show();
    }
  }
}

var selectCol = function(o) {

  if ( typeof(gSelCollection) !== 'undefined' && typeof(gSelCollection.col_id) !== 'undefined' ) {
    var old_id = gSelCollection.col_id;
  } else {
    var old_id = -1;
  }
  
  var cid = o.id.split('-')[1];
  gSelCollection = gCollections[cid];

  for (k in gCollections) {
    $("#co-"+k).hide();
    $("#a-"+k).css("background-color","white");
    $("#b-"+k).css("background-color","white");
    $("#c-"+k).css("background-color","white");
    $("#d-"+k).css("background-color","white");
    $("#e-"+k).css("background-color","white");
    $("#f-"+k).css("background-color","white");
  }

  for (k in gMemberCollections) {
    $("#cm-"+k).hide();
    $("#am-"+k).css("background-color","white");
    $("#bm-"+k).css("background-color","white");
    $("#cm-"+k).css("background-color","white");
    $("#dm-"+k).css("background-color","white");
    $("#me-"+k).css("background-color","white");
  }

  if ( gSelCollection.col_id !== old_id ) {
    $("#cnBtn").hide();
    $("#dcBtn").show();
    $("#rtBtn").show();
    $("#gaBtn").show();
    $("#selxGrp").show();

    $("#co-"+cid).show();
    $("#a-"+cid).css("background-color","yellow");
    $("#b-"+cid).css("background-color","yellow");
    $("#c-"+cid).css("background-color","yellow");
    $("#d-"+cid).css("background-color","yellow");
    $("#e-"+cid).css("background-color","yellow");
    $("#f-"+cid).css("background-color","yellow");
    showColDetail(gSelCollection.col_id, 'owner');

  } else {
    $("#cnBtn").show();
    $("#dcBtn").hide();
    $("#rtBtn").hide();
    $("#gaBtn").hide();
    $("#selxGrp").hide();
    $("#col-search-div").remove();
    gSelCollection = {};
    for (k in gCollections) {
      $("#co-"+k).show();
    }
    for (k in gMemberCollections) {
      $("#cm-"+k).show();
    }
  }
  
}

var showColDetail = function(selColId, colType) {

  $("#col-search-div").remove();

  var clsdiv = $('<div id="col-search-div"></div>')
            .css('width','610px')
            .css('height','300px')
            .css('border','solid 1px')
            .css("overflow-x","hidden")
            .css("overflow-y", "scroll")
            .css('float','left')
            .css('display','block');
  
  $("#coldiv").append(clsdiv);

  var pUrl ='/adept/getCollections?t='+ kmu(gKey) +'&u='+gUser.id+'&c='+selColId;

  if ( colType == 'owner') {
    var gSel = gSelCollection;
  } else {
    var gSel = gMemberSelCollection;
  }

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          var s = dres.success.data[0];
          if ( s.search_set) {
            gSel.search_set = s.search_set;
            if ( gSel.search_set.length ) {
              clsdiv.append('<b>Searches</b></br>');
              for (z in  gSel.search_set ) {
                var i = gSel.search_set[z].cs_id;
                var n = gSel.search_set[z].col_desc;
                var u = gSel.search_set[z].search_url;
             
                if (typeof(u) == "object" ) {
                  var jst = u;
                } else {
                  var jst = JSON.parse(u);
                }
            
                var pstr = '';
                Object.keys(jst).forEach(key => {
                  pstr = pstr + ' <b>' + key + '</b> ' + jst[key];
                });
  
                var csx = $('<i class="fa fa-trash-alt" id="ds-'+i+'" onclick="delSearchSet(this)"></i>')
                  .css("margin","3px;")
                  .css("font-size", "12px;")
                  .css('color','rgb(33,145,194)');
                var csn = $('<span  id="sid-'+i+'">'+pstr+'</span>');
                if ( colType = 'owner') {
                  clsdiv.append(csx);
                }
                
                clsdiv.append(csn);
                clsdiv.append('</br>');
              }
            }
          }
         
          if ( s.record_set ) {
            gSel.record_set = s.record_set; 

            if ( gSel.record_set ) {
              clsdiv.append('<b>Records</b></br>');

              for (z in gSel.record_set ) {
                var n = gSel.record_set[z];
                var csx = $('<i class="fa fa-trash-alt" id="ds-'+z+'" onclick="deleteRecFromCollection(this)"></i>')
                                  .css("margin","3px;")
                                  .css("font-size", "12px;")
                                  .css('color','rgb(33,145,194)');
                var rsn = $('<span id="rid-'+z+'"><b>DOI:</b> '+n+'</span></br>');
                clsdiv.append(csx);
                clsdiv.append(rsn);
              }
            }

          }
        }
  });

}

var deleteCollection = function(o) {

  if ( $("#dcBtn").text() == 'Cancel') {
    $("#dcBtn").text('Delete');
    $("#cnBtn").text('New');
    $("#colname").hide();
  } else {
    if ( gSelCollection.col_id ) {
      var pUrl ='/adept/deleteCollection?t='+ kmu(gKey) +'&u='+gUser.id+'&c='+gSelCollection.col_id;
      var jqxhr = $.get(pUrl, function() {
        var ssu = 'success collections'; 
      })
      .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        getCollections('template');
      });
    } else {
      alert('You must select a Data Set to delete ');
    }
  }


}


// Delete search in savedsets

var delSearchSet = function(o) {
  var csid = o.id.split('-')[1];

  var durl = '/adept/deleteCollectionSearch?t='+ kmu(gKey) +'&u='+gUser.id+'&s='+csid;


  var jqxhr = $.get(durl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }
    showColDetail(gSelCollection.col_id, 'owner');

  });

}

var selectCollection = function(o) {

  var cid = o.id.split('-');
  var k = cid[0];
  var t = cid[1];

  $(".clx-dm").each(function() {
    $( this ).css("background-color", "#ffffff");
  });

  if ( t == gSelCollection.col_id ) {
    gSelCollection.col_id = '';
    $(o).css("background-color", "#ffffff");
    $("#col-search-div").empty();
    $("#rtBtn").hide();
    $("#gaBtn").hide();
    $("#selGrp").hide();
  } else {
    $(o).css("background-color", "yellow");
    $("#col-search-div").empty();
    gSelCollection.col_id = t;
    gSelCollection.col_k = parseInt(k);
    gSelCollection.col_name = gCollections[k].col_name;
    $("#rtBtn").show();
    $("#gaBtn").show();
   
    if ( gCollections[k].search_set ) {
      $("#col-search-div").append('<b>Searches</b></br>');
      for (z in  gCollections[k].search_set ) {
        var i = gCollections[k].search_set[z].cs_id;
        var n = gCollections[k].search_set[z].col_desc;
        var u = gCollections[k].search_set[z].search_url;
        var c = gCollections[k].search_set[z].rec_count;
        if (typeof(u) == "object" ) {
          var jst = u;
        } else {
          var jst = JSON.parse(u);
        }
        var pstr = '';
        var mStr = '';
        Object.keys(jst).forEach(key => {
          pstr = pstr + ' <b>' + key + '</b> ' + jst[key];
        });

    
        var csx = $('<i class="fa fa-trash-alt" id="ds-'+i+'" onclick="delSetSearch(this)"></i>')
          .css("margin","3px;")
          .css("font-size", "12px;")
          .css('color','rgb(33,145,194)');
        var csn = $('<span  id="sid-'+i+'">'+pstr+' ( '+c+' )</span>');
        $("#col-search-div").append(csx);
        $("#col-search-div").append(csn);
        $("#col-search-div").append('</br>');
      }
    }

    if ( gCollections[k].record_set ) {
      $("#col-search-div").append('<b>Records</b></br>');
      for (z in gCollections[k].record_set ) {

        var n = gCollections[k].record_set[z];
        var csx = $('<i class="fa fa-trash-alt" id="ds-'+z+'" onclick="delRecordSearch(this)"></i>')
                .css("margin","3px 7px;")
                .css("font-size", "12px;")
                .css('color','rgb(33,145,194)');
        var rsn = $('<span id="rid-'+z+'">DOI: '+n+'</span>').css("margin","3px 7px;");
        $("#col-search-div").append(rsn);
        $("#col-search-div").append('</br>');
      }
    }
  }
}

var saveSearchToCollection = function(u) {

  var z = {};
  Object.keys(gSE).forEach(key => {
    if ( gSE[key] ) {
      z[key] = gSE[key];
    }
  });

  var zu = JSON.stringify(z);
  var so = {};
  so.cs_id = 999;
  so.col_desc = z.term;
  so.search_url = zu;

  if ( gCollections[gSelCollection.col_k].search_set ) {
    gCollections[gSelCollection.col_k].search_set.push(so);
  } else {
    gCollections[gSelCollection.col_k].search_set = [];
    gCollections[gSelCollection.col_k].search_set.push(so);
  }
  
  var d = gSE.term;
  var i = gSelCollection.col_id;
  var c = gFRHdr.resCount;

  var pUrl ='/adept/newSearchInCollection?t='+ kmu(gKey) +'&i='+i+'&d='+d+'&c='+c+'&u='+zu;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        alert('Saved Search ' + d + ' in ' +gSelCollection.col_name);
        getCollections('login');
      });

}

var saveRecordToCollection = function(d) {

  var i = gSelCollection.col_id;

  var pUrl ='/adept/newRecordInCollection?t='+ kmu(gKey) +'&i='+i+'&d='+d;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        alert('Saved Search ' + d + ' in ' +gSelCollection.col_name);
        getCollections('login');
      });

}
var deleteRecFromCollection = function(d) {
 
  var i = gSelCollection.col_id;
  var oid = d.id.split('-')[1];
  var pUrl ='/adept/delRecordFromCollection?t='+ kmu(gKey) +'&i='+i+'&d='+oid;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }
        showColDetail(gSelCollection.col_id, 'owner');
  });  
}


var addColToGroup = function(o) {

  var u =  gUser.id;
  var g = $("#selxGrp").val();
  var o = gSelCollection.col_id;

  var pUrl ='/adept/addObjectToGroup?t='+ kmu(gKey) +'&u='+u+'&g='+g+'&type=dataset&o='+o;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }

    if ( dres.success.data) {
      getCollections('template');
      $("#selxGrp").hide();
      $("#gaBtn").hide();
    }

    
  });

}

var delGrpCol = function(o) {
  var gcid = o.id.split('-');
  var c = gcid[1];
  var g = gcid[2];

  var pUrl ='/adept/delObjectFromGroup?t='+ kmu(gKey) +'&u='+gUser.id+'&g='+g+'&type=dataset&o='+c;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
    if (typeof(data) == "object" ) {
      var dres = data;
    } else {
      var dres = JSON.parse(data);
    }

    if ( dres.success.data) {
      getCollections('template');
    }
  });

}

var saveObjToGroup = function(type) {

  var g = $("#selxGrp").val();
  if ( type == 'dataset') {
    var i = gSelCollection.col_id;
  } else if (  type == 'application') {
    var i = gSelApp.ua_id;
  } else if (  type == 'testset') {
    var i = gSel
  } else if (  type == 'dictionary') {
    var i = gSelDict.dict_id;
  } 
  
  var pUrl ='/adept/addObjectToGroup?t='+ kmu(gKey) +'&u='+gUser.user_id+'&g='+g+'&type='+type+'&o='+i;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success added objec to collection'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        $("#gaBtn").text("Add To Group");
        $("#gaBtn").attr("onclick","addColToGroup()");
        $("#selxGrp").hide();
        //alert('Saved Search ' + d + ' in ' +gSelCollection.col_name);
  });

}

var uploadMan = function(o) {

  $("#rud-results").empty();
  $("#rud-help").hide();

  var updiv = $('<div></div>');
  var upTx = $('<h5>Upload Document</h5>');
  updiv.append(upTx);
  $("#rud-results").append(updiv);
  
}

var statusMan = function(o) {

  $("#rud-results").empty();
  $("#rud-help").hide();

  var sthdr = $('<div id="stat-hdr-div"></div>');
  var stdiv = $('<div id="stat-man-div"></div>');
  var stTx = $('<h5>Process Transaction Log</h5>');

  var rsBtn = $('<a id="rsBtn" class="res-tag" type="submit" onclick="getProcLog(this);">Refresh</a>')
            .css('font-size','12px')
            .css('background-color','rgb(33,145,194)')
            .css('margin','5px')
            .css('width','80px');

  sthdr.append(stTx);
  sthdr.append(rsBtn);
  $("#rud-results").append(sthdr);
  $("#rud-results").append(stdiv);
  getProcLog();
}

var getProcLog = function(o) {

  var pUrl ='/adept/getProcessLog?t='+ kmu(gKey) +'&u='+gUser.id;

  var jqxhr = $.get(pUrl, function() {
    var ssu = 'success collections'; 
  })
  .done(function(data) { 
        if (typeof(data) == "object" ) {
          var dres = data;
        } else {
          var dres = JSON.parse(data);
        }

        if ( dres.success.data ) {
          gProcLog = dres.success.data;
          if ( gProcLog.length ) {
            showProcessLog();
           
          } else {
            // empty it out
          }
        }

  });

}

var showProcessLog = function() {

  $("#stat-man-div").empty();
  $(".cpl-dm").each(function() {
    $( this ).remove();
  })

  var pt = $('<table id="proctab"></table>')
  var tr = $('<tr></tr>')
  var ta = $('<th width="100px">Process</th>');
  var tb = $('<th width="70px">Type</th>');
  var tc = $('<th width="110px">Source</th>');
  var td = $('<th width="160px">Timestamp</th>');
  var te = $('<th width="70px">Status</th>');
  tr.append(ta);
  tr.append(tb);
  tr.append(tc);
  tr.append(td);
  tr.append(te);
  pt.append(tr);

  for (k in gProcLog) {
    var i =  gProcLog[k].pa_id;
    var n =  gProcLog[k].proc_name;
    var t =  gProcLog[k].proc_type;
    var l =  gProcLog[k].source;
    var c =  gProcLog[k].created;
    var s = gProcLog[k].state;

    var sid = gProcLog[k].set_id;
    var tsid = gProcLog[k].ts_id;
    var did = gProcLog[k].dict_id;

    var tr = $('<tr></tr>')
    var ta = $('<td id="a-'+i+'">'+n+'</td>');
    var tb = $('<td id="b-'+i+'">'+t+'</td>');
    var tc = $('<td id="c-'+i+'">'+l+'</td>');
    var td = $('<td id="d-'+i+'">'+c+'</td>');
    var te = $('<td id="d-'+i+'">'+s+'</td>');

    tr.append(ta);
    tr.append(tb);
    tr.append(tc);
    tr.append(td);
    tr.append(te);
    pt.append(tr);

  }

  $("#stat-man-div").append(pt);

}

var cosmosMan = function(o) {

  if ( gSelDict.dict_id == 47 & gDict ) {
    cosmosTemplate();
  } else {
    gSelDict.dict_id = 47;
    var o = {};
    var rc = getDicTerms(o, cosmosTemplate );
    //comsosTemplate();
  }
 
}

var cosmosTemplate = function() {
  $("#rud-results").empty();
  $("#rud-help").hide();

  var stdiv = $('<div></div>');
  var stTx = $('<h5>COSMOS Links</h5>');
  stdiv.append(stTx);

  var sQ = $('<select id="selCosQry"></select>')
            .css("font-family","calibri")
            .css("font-weight","bold")
            .css("border-style","solid 1px")
            .css("border-color","rgb(132, 155, 165)")
            .css("background-color","rgb(208, 230, 240)")
            .css("margin","4px 4px");
  var k = 0;
  Object.keys(gDict)
    .forEach(key => {
      if ( k == 0 ) {
        var to = $('<option value="'+key+'" selected>'+key+' ( '+gDict[key]+' )</option>');  
      } else  {
        var to = $('<option value="'+key+'">'+key+' ( '+gDict[key]+' )</option>');
      }
      sQ.append(to);
    });
  
  var sQT = $('<select id="selCType" ></select>')
            .css("font-family","calibri")
            .css("font-weight","bold")
            .css("border-style","solid 1px")
            .css("border-color","rgb(132, 155, 165)")
            .css("background-color","rgb(208, 230, 240)")
            .css("margin","4px 4px");

  var fo = $('<option value="Figure" selected>Figure</option>');
  var to = $('<option value="Table" selected>Table</option>');
  var eo = $('<option value="Equation" selected>Equation</option>');

  sQT.append(fo);
  sQT.append(to);
  sQT.append(eo);

  var csBtn = $('<a id="cxBtn" class="res-tag" type="submit" onclick="gotoCosmosLink(this);">View</a>')
            .css('font-size','12px')
            .css('background-color','rgb(33,145,194)')
            .css('margin','5px')
            .css('width','80px');
                
  stdiv.append(sQ);
  stdiv.append(sQT);
  stdiv.append('</br>');
  stdiv.append(csBtn);

  $("#rud-results").append(stdiv);

}


var gotoCosmosLink = function(o) {

  var dst = $("#selCosQry").val();
  var qt = $("#selCType").val();

  var dst = encodeURIComponent(dst);
  var sUrl = 'https://xdd.wisc.edu/set_visualizer/sets/geothermal?query='+dst+'&type='+qt;
  window.open(sUrl);

}

