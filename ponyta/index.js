const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const couchbase = require("couchbase");
const { loadSpeedTrapsData } = require("./speed_traps");
const sites = require("./sites.json");
addLinksToSites();

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
    const body = Object.values(sites);

    sendResponse(res, body);
  });

  app.get("/sites/:site/", (req, res) => {
    const siteId = +req.params.site;
    console.log(siteToSpeedTraps)

    const body = (siteToSpeedTraps[siteId] || []).map(
      (speedTrapId) => speedTraps[speedTrapId]
    );

    sendResponse(res, body);
  });

  app.post("/records/", (req, res) => {
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
    if (Object.keys(req.query).length === 0) {
        res.status(400).send({message: 'Results are too big, please use query parameters to filter by: ids, beginDate and endDate.'})
        return;
    }
    const { ids, beginDate, endDate } = req.query;
    if (!ids || !beginDate || !endDate) {
      res.status(400).send({message: 'Missing parameters.'})
      return;
    }
    getRecordsByIds(ids, beginDate, endDate).then((result) => {
      res.send( result);
    });
  });

  app.get("/days", (_, res) => {
    getRecordsDays().then(result => {
      res.send(result)
    })
  })

  app.listen(EXPRESS_PORT, () =>
    console.log(`Ponyta is running on port ${EXPRESS_PORT}`)
  );
});

function addLinksToSites() {
  Object.keys(sites).forEach(siteId => {
    sites[siteId] = {
      ...sites[siteId],
      links: [
        {
          href: `/sites/${siteId}`,
          rel: "site",
          type: "GET",
        },
      ], 
    }
  });
}

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

const getRecordsByIds = async (ids, beginDate, endDate) => {
  try {
    const query = `
            SELECT * FROM \`records\`
            WHERE id IN $1
                AND date >= $2
                AND date <= $3
        `;
    const options = { parameters: [JSON.parse(ids), beginDate, endDate] };
    const result = await cluster.query(query, options);
    const records = {}
    let totalCars = 0;
    result.rows.forEach(element => {
      totalCars += element.records.totalCars
      if (!records[element.records.id]) {
        records[element.records.id] = {}
      }
      const rec = records[element.records.id];
      if(!rec[element.records.date]) {
        rec[element.records.date] = element.records.speed;
      } else {
        rec[element.records.date] = element.records.speed.map((car, i) => (rec[element.records.date][i] + car));
      }
    });
    result.rows.totalCars = totalCars
    return {records, totalCars};
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getRecordsDays = async () => {
  const query = "SELECT ARRAY_AGG(DISTINCT date) as days FROM `records`";
  return cluster.query(query, {}).then(res => {
    const {days} = res.rows[0];
    const months = {};
    days.forEach(day => {
      const spl = day.split('-');
      months[(`${spl[0]}-${spl[1]}`)] = 1;
    })
    return {days, months: Object.keys(months)}
  }).catch(error => console.log(error))
}
