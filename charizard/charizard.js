const grpc = require('grpc');
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("../protocol/eevee.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 10003, path: '/traficData'});
const eeveePackage = grpcObject.eevee;

const client = new eeveePackage.eeveeService("127.0.0.1:40000", grpc.credentials.createInsecure());
var lastSentTraficData;
var lastReceivedTraficData;
var requiredIds = [];
for(var i = 0; i < 200; i++){
  requiredIds.push(i.toString());
}
readTraficData()

function readTraficData(){
  const emptyData = {};
  const channel = client.getTraficData(emptyData);

  channel.on("data", batchTraficData => {
    console.log("Batch trafic data received: " + batchTraficData);
    lastReceivedTraficData = batchTraficData;
  });

  channel.on('end', process.exit);
}

wss.on('connection', function(ws) {
  var interval = setInterval( function() {
    if(lastSentTraficData == lastReceivedTraficData){
      sendDataToUi(ws, lastReceivedTraficData);
      lastSentTraficData = lastReceivedTraficData;
    }
  },1000);

  ws.on('data', function(data) {
    var idList = data.ids;
    console.log('New id list received in server: ' + idList);
    requiredIds = idList;
  });

  console.log('New connection');
});

function sendDataToUi(ws, batchTraficData) {
  var filteredBatchTraficData = filterBatchTraficData(batchTraficData);
  console.log("Sending filtered batch trafic data");
  ws.send(filteredBatchTraficData);
}

function filterBatchTraficData(batchTraficData) {
  traficDataList = batchTraficData.trafic_data;
  return traficDataList.filter(traficData => {
    requiredIds.includes(traficData.id) 
  })
}
