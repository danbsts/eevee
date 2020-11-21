const csv = require("csv-parser");
const fs = require("fs");

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
    const flatSpeedTraps = [];

    fs.createReadStream("speed_traps.csv")
        .pipe(csv())
        .on("data", data => flatSpeedTraps.push(data))
        .on("end", () => {
            speedTraps = {};
            siteToSpeedTraps = {};
            flatSpeedTraps.forEach(speedTrap => {
                speedTraps[speedTrap.id] = speedTrap;

                Object.entries(sites).forEach(entry => {
                    const [ siteId, site ] = entry;
                    const d = distance(site.long, site.lat, speedTrap.long, speedTrap.lat);
                    if (d <= site.radius) {
                        if (!siteToSpeedTraps.hasOwnProperty(siteId)) {
                            siteToSpeedTraps[siteId] = [];
                        }
                        siteToSpeedTraps[siteId].push(speedTrap.id);
                    }
                });
            });
            callback(speedTraps, siteToSpeedTraps);
        });
}

module.exports = {
    loadSpeedTrapsData,
};
