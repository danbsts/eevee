const { count } = require("console");
const csv = require("csv-parser");
const fs = require("fs");
var trapData = require('./trap_data.json');

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

function distance(lon1, lat1, lon2, lat2) {
    lon1 = Number(lon1);
    lat1 = Number(lat1);
    lon2 = Number(lon2);
    lat2 = Number(lat2);

    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
    var dLon = (lon2-lon1).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function loadSpeedTrapsData(sites, callback) {
    speedTraps = {};
    siteToSpeedTraps = {};
    siteToSpeedTraps["0"] = [];
    siteToSpeedTraps["1"] = [];
    siteToSpeedTraps["2"] = [];
    siteToSpeedTraps["3"] = [];
    siteToSpeedTraps["4"] = [];
    siteToSpeedTraps["5"] = [];
    siteToSpeedTraps["6"] = [];
    siteToSpeedTraps["7"] = [];
    const siteDeId = [];
    siteDeId["0"] = new Set();
    siteDeId["1"] = new Set();
    siteDeId["2"] = new Set();
    siteDeId["3"] = new Set();
    siteDeId["4"] = new Set();
    siteDeId["5"] = new Set();
    siteDeId["6"] = new Set();
    siteDeId["7"] = new Set();

    trapData.forEach(speedTrap => {
        speedTraps[speedTrap.equipamento] = speedTrap;

        Object.entries(sites).forEach(entry => {
            const [ siteId, site ] = entry;
            const d = distance(site.long, site.lat, speedTrap.longitude, speedTrap.latitude);
            if (d <= site.radius) {
                if(!speedTrap.equipamento.startsWith('FS') && !siteDeId[siteId].has(speedTrap.equipamento)){
                    siteToSpeedTraps[siteId].push(speedTrap.equipamento);
                    siteDeId[siteId].add(speedTrap.equipamento)
                }
            }
        });
    });

    callback(speedTraps, siteToSpeedTraps);
}

module.exports = {
    loadSpeedTrapsData,
};
