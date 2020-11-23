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

export { getSiteList, getTrapList };
