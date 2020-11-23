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

function getTotalInfrigements(traficData, trap) {
  var pos = trap.velocidade_via.charAt(0);
  var total = 0;
  for(var i = pos; i < traficData.speed.length; i++){
    total += traficData.speed[i];
  }
  return total;
}

function findTrap(trapId, trapList) {
  return trapList.find(t => t.equipamento === trapId);
}

export { getSiteList, getTrapList, getTotalInfrigements, findTrap };
