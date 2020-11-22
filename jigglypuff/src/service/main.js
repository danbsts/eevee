import api from "./axios";
const { webSocket } = require("rxjs/webSocket");
// global.WebSocket = require("websocket")
console.log(process.env.CHARIZARD)
const subject = webSocket(`ws://0.0.0.0:10003/traficData`);
// const webSocket = new WebSocket(`ws://${charizardUrl}:10003/traficData`);

var traficData = [];
var siteData = [];
var trapData = [];
getSiteList().then(result => {
  siteData = result;
  trapData = getTrapList(siteData[0].id);
});

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
    console.log(res.data);
    return res.data;
  });
}

function getTrapList(siteId) {
  return api.get(`/sites/${siteId}`).then((res) => {
    sendCharizardIdList(res.data);
  });
}
 
function sendCharizardIdList(trapData) {
  var idList = [];
  for (var trap in trapData) {
   idList.push(trapData[trap]._id);
  }
  console.log("Sending updated id list");
  subject.next({
    ids: idList
  }); 
}

export { getSiteList, getTrapList };
