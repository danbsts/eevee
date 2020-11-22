import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import TrapPopup from "./TrapPopup";

function Map() {
  return (
    <MapContainer
      style={{ width: "900px", height: "700px" }}
      center={[-8.06312865288916, -34.871122349012225]}
      zoom={16}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <TrapPopup />
    </MapContainer>
  );
}

export default Map;