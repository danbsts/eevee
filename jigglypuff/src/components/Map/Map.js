import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import TrapPopup from "./TrapPopup";

function Map({ traps, area }) {
  return (
    <MapContainer
      style={{ width: "900px", height: "700px" }}
      center={[area.lat, area.long]}
      zoom={11}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {traps.map((el) => (
        <TrapPopup trap={el} />
      ))}
    </MapContainer>
  );
}

export default Map;
