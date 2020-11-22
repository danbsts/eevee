const ponyta = require("./axios.js");
const grpc = require('grpc');
const protoLoader = require("@grpc/proto-loader");
const { Observable } = require('rxjs');
const { filter } = require('rxjs/operators');
const { read } = require('fs');
const packageDef = protoLoader.loadSync("./protocol/eevee.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 10003, path: '/traficData'});
const eeveePackage = grpcObject.eevee;
const host = process.env.GYARADOS? process.env.GYARADOS : "0.0.0.0";

const client = new eeveePackage.eeveeService(`${host}:10130`, grpc.credentials.createInsecure());
var toBeSentTraficData = [];
var requiredIds = [5962];
// for(var i = 0; i < 200; i++){
//   requiredIds.push(i.toString());
// }
const observable = readTraficData()
  .pipe(filter(data => requiredIds.includes(data.id)))
observable.subscribe(data => {
  toBeSentTraficData.push(data);
});

function processTrafic(data) {
  const quoteExp = new RegExp("\"", 'g');
  const reads = [];
  data.trafic.forEach(feed => {
    const id = Number(feed.id.replace(quoteExp, ""));
    reads.push({
      id,
      speed: feed.speed.map(speed => Number(speed)),
      timeInterval: feed.timeInterval.replace(quoteExp, ""),
      date: feed.date.replace(quoteExp, ""),
    });
  });
  return reads;
}

function readTraficData() {
  const emptyData = {};
  const channel = client.getTraficData(emptyData);

  channel.on('end', process.exit);

  return new Observable(subscriber => {
    channel.on("data", batchTraficData => {
      console.log('Data received from gyarados')
      const reads = processTrafic(batchTraficData);
      sendCompleteData(batchTraficData).then( x => {
      }).catch(e => console.log(e));
      Object.values(reads).forEach(data => subscriber.next(data));
      lastReceivedTraficData = batchTraficData;
    });
  });
}

wss.on('connection', function(ws) {
  console.log('New connection');

  ws.on('message', function(data) {
    var idList = JSON.parse(data).ids;
    console.log(`New id list received in server with ${idList.length} ids`);
    requiredIds = idList;
  });

  var interval = setInterval( function() {
    if(toBeSentTraficData.length != 0){
      sendDataToUi(ws, toBeSentTraficData);
      toBeSentTraficData = [];
    }
  },1000);
});

async function sendCompleteData(batchTraficData) {
  if(batchTraficData.trafic.length==0) {
    return;
  }
  return ponyta.post("/records", {
    data: processTrafic(batchTraficData)
  }).then((res) => {
    console.log(res.data);
  });
}

function sendDataToUi(ws, batchTraficData) {
  ws.send(JSON.stringify({
    trafic: batchTraficData
  }));
}
