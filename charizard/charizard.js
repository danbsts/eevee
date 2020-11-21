const grpc = require('grpc');
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("../protocol/eevee.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 8080, path: '/traficData'});
const eeveePackage = grpcObject.eevee;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const client = new eeveePackage.eeveeService("127.0.0.1:40000", grpc.credentials.createInsecure());
var lastSentTraficData;
var lastReceivedTraficData;
readTraficData()

function readTraficData(){
  const emptyData = {};
  const channel = client.getTraficData(emptyData);

  channel.on("data", batchTraficData => {
    console.log("Batch trafic data received: "+ batchTraficData);
    sendDataToUi()
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
  console.log('New connection');
});

function sendDataToUi(ws, batchTraficData) {
  var processedBatchTraficData = processBatchTraficData(batchTraficData);
  console.log("Sending processed batch trafic data");
  ws.send(processedBatchTraficData);
}

// TODO: ask mongo for informations on frafic id
function processBatchTraficData(batchTraficData) {
  return batchTraficData;
}
