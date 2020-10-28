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
    
  var gDictList = [];
  var gDict = {};
  var gSelDict = {k : "", dict_id : "", count: 0 };
  //var gdUrl='https://xdddev.chtc.io/api/v1' ;
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
 

  function showSeaHis() {

    $("#sHistoryItems").empty();

    if ( gSelDict.count > 0 ) {
      $("#shTitle").text("Dictionary "+ gSelDict.name);

      var px = 0;
      Object.keys(gDict)
        .forEach(key => {
          var st = '<a id="dl-'+key+'" class="sh-item" style="font-size:12px; margin: 2px 2px;" onclick="selectHistoryItem(this);" >'+key+'-'+gDict[key]+'</a></br>'; 
          if ( px < 100 ) { 
          $("#sHistoryItems").append(st);
          }    
          px++;
        });
        $("#SearchHistory").css("display","block");
    } else {
      $("#shTitle").text("Search History");
      for (k in gSearchHistory) {
        var hs = gSearchHistory[k];
      if ( hs ) {
          var st = '<i class="fa fa-close" id="cl-'+k+'" onclick="selHisDel(this)" style="font-size:9px;"></i><a id="sh-'+k
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
			$("#leftMDRecord").hide();
		} else if ( gMenuSel == 'r' ) {
			$("#widget-view").empty();
			$("#leftMDRecord").show();
			recordTemplate(gT, gKey);
		} else if ( gMenuSel == 'm' ) {
			console.log('logged in whlie viewing map');
			$("#leftMDRecord").hide();
			
		}
		
	} else if ( kmu(gKey) && gKey.agentRole == "4"  ) {
		if ( gMenuSel == 's' ) {
			$("#Cex").hide();
			$("#leftMDRecord").hide();
		} else if ( gMenuSel == 'r' ) {
			$("#widget-view").empty();
			$("#leftMDRecord").show();
			recordTemplate(gT, gKey);
		} else if ( gMenuSel == 'm' ) {
			$("#leftMDRecord").hide();
			console.log('logged in while viewing map');
			
		}
	} else {
		// logging out
		if ( gMenuSel == 's' ) {
			$("#Cex").hide();
			$("#leftMDRecord").hide();
		} else if ( gMenuSel == 'r' ) {
			 $("#widget-view").empty();
			 $("#leftMDRecord").show();
			recordTemplate(gT, gKey);
		} else if ( gMenuSel == 'm' ) {
			$("#leftMDRecord").hide();
			console.log('logged in whie viewing map');	
		}
	}
	
}

  function selectHistoryItem(o) {
    // if its typeahead append, if its search history replace
    if (o.id.substr(0,2) == 'ta') {
      var tbx = o.text;
      var ng =  $("#gSearchBox").val(); //.substr(gTApre.length-1);
      $("#gSearchBox").val(ng.slice(0,-gTApre.length)+tbx);
    } else if ( o.id.substr(0,2) == 'dl' ) {
      var tbx = o.id.substr(3);
      $("#gSearchBox").val(tbx);

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
                    //.css("padding","2px 2px");

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
    //$("#cb").prepend(urlDiv);

  }

  function closeUrl(o) {
    $("#showUrl").remove();
  }

  function saveMD(o){
    //show the bookmarks 
    var sname =  $("#gSearchBox").val();
    if ( !sname ) { sname = 'All' }
    if ( o.text == 'Save' ) {
      localStorage.setItem(o.id,sname);
      o.text = 'Clear';
      o.style.backgroundColor= "#21b229";
    } else {
      localStorage.removeItem(o.id);
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
      //console.log( "typeahead data ..." + JSON.stringify(data) );
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

    $( "#datepicker" ).datepicker();
    if ( !yorn ) {
      $("#rec-results").empty();
      findRecords(0);
    }
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
  /*
  gSE.min_acquired =  dtm( $("#mindA-datepicker").val() );
  gSE.max_acquired =  dtm( $("#maxdA-datepicker").val() );
  gSE.min_publisheed = dtm( $("#mindP-datepicker").val() );
  gSE.max_published =  dtm( $("#maxdP-datepicker").val() );
  */
  Object.keys(gSE).forEach(key => {
    if ( gSE[key] ) {
      if ( key == 'recent') {
        searchStr = searchStr+'&max=500&'+key;
      } else {
        searchStr = searchStr+'&'+key+'='+ gSE[key];
      }
    }
  });

  return searchStr;
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

function findTemplate(page) {

  var gSp = page*pgSize;
  var displaying = gSp + pgSize;
  $("#cb").show();
  $("#widget-box").hide();
  var srx = 'Term '+gSE.term;
  if ( gSE.pubname ) { srx = srx + ', Journal '+gSE.pubname }
  if ( gSE.pubname_like  ) { srx = srx + ', Journal* '+gSE.pubname_like }
  if ( gSE.title ) { srx = srx + ', Title '+gSE.title }
  if ( gSE.title_like  ) { srx = srx + ', Title* '+gSE.title_like }
  if ( gSE.lastname ) { srx = srx + ', Author '+ gSE.firstname + ' ' +gSE.lastname }

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
      var mr = gSRA.length-1;
    }
    for (var i = gSp; i < mr; i++) {
      var xtm = gSRA[i];
      var gs = xtm._gddid;           
      var ct = xRClean(xtm.title);
    
      if ( xtm.link ) {
        var linkz =  xtm.link;
      }

      var savd = localStorage.getItem('sr-'+gs);
      var bt = 'Save';
      var bc =  "#2191c2";

      if ( savd ) {
        bt = 'Clear';
        bc =  "#21b229";
      }
      var sBtn =   $('<a id="sr-'+i+'" class="res-tag" >'+bt+'</a>')
                    .css("font-size", "11px")
                    .css("margin", "2px")
                    .css("padding","2px 2px")
                    .css("background-color", bc)
                    .attr('onclick','saveMD(this);');

      var cInfo = $('<a id="'+i+'" >'+ct+'</a>')
                  .css("height", "16px" )
                  .css("margin", "2px")
                  .css("padding","2px 2px")
                  .css("font-size", "16px")
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

      var cJ = $('<span>Publisher ' + xtm.publisher+' Journal '+xRClean(xtm.journal)+' Vol: '+xtm.volume+' Pages: '+xtm.pages+'</span>')
                  .css("padding","5px 2px")
                  .css("margin","5px 5px")
                  .css("font-size", "11px");
    
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
                  .css("font-size", "11px");

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

  	$("#cb").show();
  	$("#widget-box").hide();

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
      
    gTitle.append('<h2 id="mdt" style="font-size: 14px; display: inline;" >'+ ro.title + '</h2>');

    var gResources =  $('<div id="resdiv">')
                  .css("margin", "2px" )
                  .css("background-color", "slate" );

    gResources.append('<h2 style="font-size: 12px; display: inline;">Resource Links</h2></br>');
    for ( var k in ro.link) {
        var rlink = ro.link[k].url;
        var rtype = ro.link[k].type;
        var rLL = $('<label class="md-label">'+rtype+'</label><a id="rn-'+k+'" href="'+rlink+'" class="resource-item" target="_blank">'+rlink+'</a>');
        gResources.append(rLL);
    }

    var gAuthor = $('<div id="mdAuthor" >')
                  .css("margin", "2px" )
                  .css("background-color", "slate" );

    gAuthor.append('<h2  style="font-size:12px; display: inline;" >Author</h2></br>');

    for ( var k in ro.author) {
        var rAuth = ro.author[k].name;
        var rAN = $('<a id="'+rAuth+'" onclick="authFind(this)" class="tag">' + rAuth + '</a>');
        gAuthor.append(rAN);
    }

    var gPubInfo = $('<div id="mdPub" >')
                  .css("margin", "2px" )
                  .css("background-color", "slate" );

    gPubInfo.append('<h2 style="font-size:12px; display: inline;" >Publication</h2></br>');
   
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
}

var getSnippets = function(doi) {

  var z = [];
  var sUrl = gdUrl+'/snippets?term='+gSE.term+'&doi='+doi;

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
                  .css("background-color", "slate" );

          snipDiv.append('<h2 style="font-size:12px; display: inline;" >Text Highlights</h2></br>');

          for (k in hla) {
            var hls = $('<span>'+ hla[k] +'</span></br>');
            snipDiv.append(hls);
          }
          $("#widget-view").append('</br>');
          $("#widget-view").append(snipDiv);

        }
        
  });

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
      $(o).html('<i class="fa fa-cocktail"></i>');
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
        .css("font-size", "11px")
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

// Journal functions that build that right panel catalog
var journalView = function(o) {

  $("#cb").hide();
  $("#widget-box").show();
  $("#widget-view").empty();
  $("#widget-title").text('/ Publication Catalog');
  gjPage = 0;

  if ( !$( "#pgjPrev" ).length ) {
    var prv = $('<button class="arrow-button" id="pgjPrev" onclick="jpager(this)"> &lt; </button>');
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
  var jth = $('<tr><th>Journal</th><th>Publisher</th><th>Articles</th><th>Years Covered</th><th>ISSN</th></tr>');
  jT.append(jth);

  jldiv.append(jT);
  $("#widget-view").append(jldiv);

  if ( gJrn.length ) {
    gJrn.sort(function(a, b){
      if(a.publisher < b.publisher) { return -1; }
      if(a.publisher > b.publisher) { return 1; }
      return 0;
    })
  }
  
  var jpstart = gjPage*50;
  var jpd = 0;

  for (k in gJrn) {
    if ( gSE.publisher ) {
      if ( gSE.publisher == gJrn[k].publisher ) {
        var df = true;
      } else { df = false; }
    } else {
      var df = true;
    }

    if ( df == true && jpd < 50 && k > jpstart ) {
      jpd++;
      var tr = $('<tr></tr>');
      var pl = $('<a class="jrnv" id="'+k+'" style="cursor: pointer;" onclick="selectJrn(this);" >' + gJrn[k].journal + '</a>')
          .css("font-size", "11px")
          .css("color", "#222222")
          .css("font-weight", "bold");

      var j = $('<td id="jj-'+k+'" class="jtd"></td>')
              .css("width","280px");
      j.append(pl);

      var p = $('<td id="jp-'+k+'" class="jtd">'+gJrn[k].publisher+'</td>')
              .css("width","160px");
      var a = $('<td id="ja-'+k+'" class="jtd">'+gJrn[k].articles+'</td>')
              .css("width","80px");
      
      var e = gJrn[k].eissn;

      var i = $('<td id="ji-'+k+'" class="jtd">'+gJrn[k].issn+'</td>').css("width","80px");
      var y = gJrn[k].years_covered;
      var ys = y[0] + '-'+ y[y.length-1] + ' '+ y.length;
      var yx = $('<td id="jy-'+k+'" class="jtd">'+ys+'</td>').css("width","120px");

      tr.append(j);
      tr.append(p);
      tr.append(a);
      tr.append(yx);
      tr.append(i);
      jT.append(tr);
    }

  }
  jldiv.append(jT);
  $("#widget-view").append(jldiv);
  
}

var selectJrn = function(o) {
  var jo = gJrn[o.id];

  if ( jo.journal == gSE.journal) {
    $(o).css("background-color","#ffffff");
    $("#gPubName").val("");
    gSE.journal = "";
  } else {
    $(".jrnv").css("background-color","#ffffff");
    $(o).css("background-color", "yellow");
    $("#gPubName").val(jo.journal);
    $("#search-tool-div").show();
    gSE.journal = jo.journal;
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

  for (k in gSet) {
    var n = gSet[k].name;
    var j = gSet[k].description;
    var a = gSet[k].details;
    
    var pl = $('<a class="nsv" id="'+n+'" style="cursor: pointer;" onclick="selectSet(this);" >' + n + '</a>')
        .css("font-size", "11px")
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
        $("#DictList").hide();
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
        .css("font-size", "11px")
        .css("color", "#222222")
        .css("font-weight", "bold");
    var cax = $('<div class="ndv-category" />')
        .css("margin-left", "11px")
        .css("display", "block")
        .css("height", "14px");
        cax.append(pl);
        $("#DictList").append(cax);
  }

}

function selectDict(o) {
  // key, dict_id
  var da = o.id.split('-');

  $(".ndv").css("background-color","#ffffff");
  if ( da[0] == gSelDict.k ) {
    gSelDict.k = "";
    gSelDict.name = "";
    gSelDict.dict_id = "";
    gSelDict.count = 0;
    gDict = {};

  } else {
    $(o).css("background-color", "yellow");
    gSelDict.k = da[0];
    gSelDict.name = gDictList[da[0]].name;
    gSelDict.dict_id = da[1];
    getDicTerms(o);
  }

}

function getDicTerms(o) {

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
      cb();
  } else {
    if ( $("#loginDiv").css("display") == "none") { 
      $("#loginDiv").css("display","block");
    
    } else {
      $("#loginDiv").css("display","none");
  
    }
  
  }

}
