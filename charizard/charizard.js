const ponyta = require("./axios.js");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { Observable } = require("rxjs");
const { filter } = require("rxjs/operators");
const packageDef = protoLoader.loadSync("./protocol/eevee.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 10003, path: "/traficData" });
const eeveePackage = grpcObject.eevee;
const host = process.env.GYARADOS ? process.env.GYARADOS : "0.0.0.0";

const client = new eeveePackage.eeveeService(
  `${host}:10130`,
  grpc.credentials.createInsecure()
);
var toBeSentTraficData = [];
var requiredIds = ['5962'];
const observable = readTraficData().pipe(
  filter((data) => requiredIds.includes(data.id))
);
observable.subscribe((data) => {
  toBeSentTraficData.push(data);
});

function processTrafic(data) {
  const quoteExp = new RegExp('"', "g");
  const reads = [];
  data.trafic.forEach((feed) => {
    const id = feed.id.replace(quoteExp, "");
    const speedTotal = feed.speed.map((speed) => Number(speed));
    reads.push({
      id,
      speed: speedTotal,
      timeInterval: feed.timeInterval.replace(quoteExp, ""),
      date: feed.date.replace(quoteExp, ""),
      totalCars: speedTotal.reduce((a, b) => a + b, 0)
    });
  });
  return reads;
}

function readTraficData() {
  const emptyData = {};
  const channel = client.getTraficData(emptyData);

  channel.on("end", process.exit);

  return new Observable((subscriber) => {
    channel.on("data", (batchTraficData) => {
      const reads = processTrafic(batchTraficData);
      console.log("Data received from gyarados");
      sendCompleteData(batchTraficData)
        .then((x) => {})
        .catch((e) => console.log(e));
      Object.values(reads).forEach((data) => {
        subscriber.next(data);
      });
      lastReceivedTraficData = batchTraficData;
    });
  });
}

wss.on("connection", function (ws) {
  console.log("New connection");

  ws.on("message", function (data) {
    var idList = JSON.parse(data).ids;
    console.log(`New id list received in server with ${idList.length} ids`);
    requiredIds = idList;
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

var interval = setInterval(function () {
  if (toBeSentTraficData.length != 0 && wss.clients.size > 0) {
    sendDataToUi(toBeSentTraficData);
  }
}, 1000);

async function sendCompleteData(batchTraficData) {
  if (batchTraficData.trafic.length == 0) {
    return;
  }
  return ponyta
    .post("/records", {
      data: processTrafic(batchTraficData),
    })
    .catch((error) => {
      console.log(error);
    });
}

function sendDataToUi(batchTraficData) {
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        trafic: batchTraficData,
      })
    );
  });
  toBeSentTraficData = [];
}
