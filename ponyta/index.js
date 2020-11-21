const express = require("express");
const bodyParser = require("body-parser");

const EXPRESS_PORT = 10077;

const app = express();
app.use(bodyParser.json());

function sendResponse(res, body) {
    res.setHeader("content-type", "application/json");
    res.status(200).send(body);
}

app.get("/speed-traps/", (req, res) => {
    const lat = req.query.lat;
    const long = req.query.long;
    const radius = req.query.radius;

    const body = [
        {
            id: 5942,
            lat: 8.52323213,
            long: 4.12312312,
        }
    ];

    sendResponse(res, body);
});

app.get("/sites/", (req, res) => {
    const body = [
        {
            name: "Recife",
            lat: 0.0000123,
            long: 8.12312,
        },
    ];
    sendResponse(res, body);
});

app.listen(EXPRESS_PORT, () => console.log(`Ponyta is running on port ${EXPRESS_PORT}`));
