const { webSocket } = require('rxjs/webSocket');
(global).WebSocket = require('ws');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const subject = webSocket("ws://127.0.0.1:10003/traficData");
const ponytaUrl = "http://127.0.0.1:10077"

var traficData = [];
var trapData = [];
var siteData = [];

getSiteList();
getTrapList(siteData[0].id);

subject.subscribe(
  batchTraficData => {
    batchTraficData.trafic.forEach(element => {
      traficData.push(element);
    });
    console.log('Data received, new trafic size: ' + traficData.length);
  },
  err => console.log(err)
);

function getSiteList(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", ponytaUrl + `/sites/`, false );
  xmlHttp.send( null );
  var jsonResult = JSON.parse(xmlHttp.responseText);
  console.log("Site list: " + JSON.stringify(jsonResult, null, 2));
  siteData = jsonResult;
}

function getTrapList(siteId){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", ponytaUrl + `/sites/${siteId}/`, false );
  xmlHttp.send( null );
  var jsonResult = JSON.parse(xmlHttp.responseText);
  console.log("Trap list: " + JSON.stringify(jsonResult, null, 2));
  sentCharizardIdList(jsonResult);
  siteData = jsonResult;
  return jsonResult;
}

function sentCharizardIdList(trapData){
  var idList = [];
  for (trap in trapData){
    idList.push(trap.id);
  }
  /*
  subject.send({
    ids: idLisst
  }); 
  */
}
