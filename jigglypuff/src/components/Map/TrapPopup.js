import React from 'react';
import { Popup, Marker } from "react-leaflet";
import { FlexLayout, Text } from '..';
import SpeedSign from './SpeedSign';

function TrapPopup() {

  return (
    <Marker position={[-8.06312865288916, -34.871122349012225]}>
      <Popup>
        <Text style={{ color: 'black' }} holder="header" text="Av. Desessete de Agosto" />
        <FlexLayout style={{ padding: '12px 0 0 0' }}>
          <div>
            <Text style={{color: 'gray'}} holder="subtitle" text="Velocidade dos carros" />
            <Text text={`0 - 10 km/h: ${0}`} />
            <Text text={`11 - 20 km/h: ${0}`} />
            <Text text={`21 - 30 km/h: ${0}`} />
            <Text text={`31 - 40 km/h: ${0}`} />
            <Text text={`41 - 50 km/h: ${0}`} />
            <Text text={`51 - 60 km/h: ${0}`} />
            <Text text={`61 - 70 km/h: ${0}`} />
            <Text text={`71 - 80 km/h: ${0}`} />
            <Text text={`81 - 90 km/h: ${0}`} />
            <Text text={`91 - 100 km/h: ${0}`} />
            <Text text={`101 km/h ou mais: ${0}`} />
          </div>
          <div>
            <SpeedSign speed={60} />
          </div>
        </FlexLayout>
        <Text style={{ padding: '10px 0 0 0' }} text={`Total: ${132} veículos`} />
      </Popup>
    </Marker>
  );
}

export default TrapPopup;