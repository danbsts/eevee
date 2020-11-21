const bodyParser = require("body-parser");
const express = require("express");

const { loadSpeedTrapsData } = require("./speed_traps");
const sites = require("./sites.json");

const EXPRESS_PORT = 10077;

const app = express();
app.use(bodyParser.json());

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
    
    app.listen(EXPRESS_PORT, () => console.log(`Ponyta is running on port ${EXPRESS_PORT}`));    
});
