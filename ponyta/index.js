const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');
const couchbase = require("couchbase");

const { loadSpeedTrapsData } = require("./speed_traps");
const sites = require("./sites.json");

const EXPRESS_PORT = 10077;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const cluster = new couchbase.Cluster("couchbase://localhost", {
  username: "Administrator",
  password: "123456",
});

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
    
        const body = (siteToSpeedTraps[siteId] || [])
            .map(speedTrapId => speedTraps[speedTrapId])
    
        sendResponse(res, body);
    });

    app.post("/records", (req,res) => {
        const { data } = req.body
        let error = false
        data.forEach((record) => {
            error |= sendRecord(record)
        })
        if(error){
            res.send({'error': 'Error recording information'})
        }else{
            res.send({'success': 'Success recording information'})
        }
    });

    app.get("/records", (req,res) => {
        const { data } = req.query
        let records = getRecordsByIds(data.ids, data.date, data.timeInterval);
        res.send({'data': records})
    });
    
    app.listen(EXPRESS_PORT, () => console.log(`Ponyta is running on port ${EXPRESS_PORT}`));    
});

const sendRecord = async (record) => {
    try {
      const key = `${record.id}`;
      const result = await collection.upsert(key, doc);
      console.log(result);
      return true
    } catch (error) {
      return false
    }
};

const getRecordsByIds = async (ids, date, timeInterval) => {
    try {
        const query = `
            SELECT * FROM \`records\`
            WHERE id IN $1
                AND timeInterval = $2
                AND date = $3
        `
        const options = { parameters: [ids, date, timeInterval] }
        const result = await cluster.query(query, options)
        return result.rows
    } catch (error) {
        return []
    } 
};