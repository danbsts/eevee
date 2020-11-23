import api from "./axios";

var traficData = [];
var siteData = [];
var trapData = [];
getSiteList().then((result) => {
  siteData = result;
  trapData = getTrapList(siteData[0].id);
});

async function getSiteList() {
  return api.get("/sites").then((res) => {
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
  // subject.next({
  //   ids: idList,
  // });
}

export { getSiteList, getTrapList };
