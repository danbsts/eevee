import React from "react";
import { Popup, Marker } from "react-leaflet";
import { FlexLayout, Text } from "..";
import SpeedSign from "./SpeedSign";
import { getTotalInfrigements } from "../../service/main";

var L = window.L;

var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function TrapPopup({ trap }) {
  return (
    <Marker position={[trap.lat, trap.lng]} icon={getTotalInfrigements(trap) == 1 ? greenIcon : getTotalInfrigements(trap) == 0 ? yellowIcon: redIcon}>
      <Popup>
        <Text style={{ color: "black" }} holder="header" text={trap.address} />
        <FlexLayout style={{ padding: "12px 0 0 0" }}>
          <div>
            <Text
              style={{ color: "gray" }}
              holder="subtitle"
              text="Velocidade dos carros"
            />
            <Text text={`0 - 10 km/h: ${trap.cars[0]}`} />
            <Text text={`11 - 20 km/h: ${trap.cars[1]}`} />
            <Text text={`21 - 30 km/h: ${trap.cars[2]}`} />
            <Text text={`31 - 40 km/h: ${trap.cars[3]}`} />
            <Text text={`41 - 50 km/h: ${trap.cars[4]}`} />
            <Text text={`51 - 60 km/h: ${trap.cars[5]}`} />
            <Text text={`61 - 70 km/h: ${trap.cars[6]}`} />
            <Text text={`71 - 80 km/h: ${trap.cars[7]}`} />
            <Text text={`81 - 90 km/h: ${trap.cars[8]}`} />
            <Text text={`91 - 100 km/h: ${trap.cars[9]}`} />
            <Text text={`101 km/h ou mais: ${trap.cars[10]}`} />
          </div>
          <div>
            <SpeedSign speed={trap.maxSpeed} />
          </div>
        </FlexLayout>
        <Text
          style={{ padding: "10px 0 0 0" }}
          text={`Total: ${trap.cars.reduce(
            (acc, cur) => acc + cur,
            0
          )} veículos`}
        />
      </Popup>
    </Marker>
  );
}

export default TrapPopup;
