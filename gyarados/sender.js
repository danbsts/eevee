let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync('../protocol/eevee.proto',{});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const senderPackage = grpcObject.eevee;

const server = new grpc.Server();
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

server.addService(senderPackage.eeveeService.service,
    {
        "getTraficData" : getTraficData
    });

server.start();

let dates = new Set()
let hours = new Set()
let data = require('./data.json')
organizeData()
let hourIterator = hours.values()
let dataIterator = dates.values()
let actualData = dataIterator.next().value
let actualHour = hourIterator.next().value

function getTraficData(call) {
    let interval = setInterval( function() {
        let streamData = filterData()
        console.log(streamData[0])
        call.write({trafic: streamData})
    },30000);
}

function organizeData() {
    data.sort(compare());
    data.forEach(element => {
        dates.add(element.data)
        hours.add(element.minutos_intervalo)
    });
    console.log('terminou', data[0])
}

 function compare(){
    return function(a,b) { 
        return a['data'] == b['data'] ? (a['minutos_intervalo'] >= b['minutos_intervalo'] ? 1 : -1) : (a['data'] >= b['data'] ? 1 : -1)
    }
 }

function filterData() {
    console.log(actualData, actualHour)
    let dataFiltered = data.filter((element) => (element.data == actualData && element.minutos_intervalo == actualHour))
    let organizedData = []
    dataFiltered.forEach((element) => {
        organizedData.push({
            id: element.equipamento,
            speed: [element.qtd_0a10km,element.qtd_11a20km, element.qtd_21a30km, element.qtd_31a40km, element.qtd_41a50km, element.qtd_51a60km, element.qtd_61a70km, element.qtd_71a80km, element.qtd_81a90km, element.qtd_91a100km, element.qtd_acimade100km],
            timeInterval: element.minutos_intervalo,
            date: element.data
        })
    })
    actualHour = hourIterator.next().value
    if (actualHour == undefined){ //Resetando a hora
        hourIterator = hours.values()
        actualHour = hourIterator.next().value
        actualData = dataIterator.next().value
    }
    if (actualData == undefined) { //Resetando os dias
        dataIterator = dates.values()
        actualData = dataIterator.next().value
    }
    return organizedData;
}