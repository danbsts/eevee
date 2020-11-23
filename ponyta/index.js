const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const couchbase = require("couchbase");
const { loadSpeedTrapsData } = require("./speed_traps");
const sites = require("./sites.json");

const EXPRESS_PORT = 10077;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const cluster = new couchbase.Cluster("couchbase://metapod", {
  username: "Administrator",
  password: "123456",
});

const bucket = cluster.bucket("records");
const collection = bucket.defaultCollection();

function sendResponse(res, body) {
  res.setHeader("content-type", "application/json");
  res.status(200).send(body);
}

loadSpeedTrapsData(sites, (speedTraps, siteToSpeedTraps) => {
  app.get("/sites/", (_, res) => {
    const body = sites;

    sendResponse(res, body);
  });

  app.get("/sites/:site/", (req, res) => {
    const siteId = +req.params.site;

    const body = (siteToSpeedTraps[siteId] || []).map(
      (speedTrapId) => speedTraps[speedTrapId]
    );

    sendResponse(res, body);
  });

  app.post("/records", (req, res) => {
    const { data } = req.body;
    Promise.all(data.map((record) => sendRecord(record))).then((result) => {
      const success = result.reduce(
        (accumulator, current) => accumulator && current,
        true
      );
      if (success) {
        res.status(201).send({ message: "Success recording information" });
      } else {
        res.status(500).send({ message: "Error recording information" });
      }
    });
  });

  app.get("/records", (req, res) => {
    const { data } = req.query;
    let data2 = JSON.parse(data)
    getRecordsByIds(data2.ids, data2.date).then((result) => {
      res.send({ data: result, totalCars: result.totalCars});
    });
  });

  app.listen(EXPRESS_PORT, () =>
    console.log(`Ponyta is running on port ${EXPRESS_PORT}`)
  );
});

const sendRecord = async (record) => {
  try {
    const key = `${record.id}${record.date}${record.timeInterval}`;
    const result = await collection.upsert(key, record);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getRecordsByIds = async (ids, date) => {
  try {
    const query = `
            SELECT * FROM \`records\`
            WHERE id IN $1
                AND date = $2
        `;
    const options = { parameters: [ids, date] };
    const result = await cluster.query(query, options);
    let totalCars = 0;
    result.rows.forEach(element => {
      totalCars += element.records.totalCars
    });
    result.rows.totalCars = totalCars
    return result.rows;
  } catch (error) {
    console.log(error);
    return [];
  }
};
