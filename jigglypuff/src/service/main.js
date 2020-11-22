import api from "./axios";
const { webSocket } = require("rxjs/webSocket");
// global.WebSocket = require("websocket")
console.log(process.env.CHARIZARD)
const subject = webSocket(`ws://charizard:10003/traficData`);
// const webSocket = new WebSocket(`ws://${charizardUrl}:10003/traficData`);

var traficData = [];
var trapData = [];
var siteData = [];

// getSiteList();
// getTrapList(siteData[0].id);

subject.subscribe(
  (batchTraficData) => {
    batchTraficData.trafic.forEach((element) => {
      traficData.push(element);
    });
    console.log("Data received, new trafic size: " + traficData.length);
  },
  (err) => console.log(err)
);

async function getSiteList() {
  return api.get("/sites").then((res) => {
    console.log(res);
  });
}

function getTrapList(siteId) {
  return api.get(`/sites/${siteId}`).then((res) => {
    console.log(res);
  });
}

function sentCharizardIdList(trapData) {
  // var idList = [];
  // for (trap in trapData) {
  //   idList.push(trap.id);
  // }
  /*
  subject.send({
    ids: idLisst
  }); 
  */
}

export { getSiteList, getTrapList };
