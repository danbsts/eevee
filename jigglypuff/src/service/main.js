import api from "./axios";

async function getSiteList() {
  return api.get("/sites").then((res) => {
    return res.data;
  });
}

function getTrapList(link, webSocket) {
  return api.get(link.href).then((res) => {
    sendCharizardIdList(res.data, webSocket);
    return res.data;
  });
}

function sendCharizardIdList(trapData, webSocket) {
  var idList = [];
  for (var trap in trapData) {
    idList.push(trapData[trap].equipamento);
  }
  console.log("Sending updated id list");
  webSocket.send(JSON.stringify({
    ids: idList,
  }));
}

function getTotalInfrigements(trap) {
  var pos = trap.maxSpeed/10;
  var totalMulta = 0.0;
  for(var i = pos; i < trap.cars.length; i++){
    totalMulta += trap.cars[i];
  }
  var total = 0.0;
  for(var i = 0; i < trap.cars.length; i++){
    total += trap.cars[i];
  }
  if(total==0) return 1;
  var ratio = totalMulta/total;
  if(ratio >= 0.04){
    return -1;
  }else if (ratio >= 0.02){
    return 0;
  }
  return 1;
}

function findTrap(trapId, trapList) {
  return trapList.find(t => t.equipamento === trapId);
}

export { getSiteList, getTrapList, getTotalInfrigements, findTrap };
