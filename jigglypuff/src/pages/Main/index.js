import React, { useEffect, useState } from "react";
import { Map, Text, Card, Clock, FlexLayout } from "../../components";
import { getSiteList, getTrapList } from "../../service/main";
const webSocket = new WebSocket("ws://0.0.0.0:10003/traficData");

function Main() {
  const [fines, setFines] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [traps, setTraps] = useState([]);

  useEffect(() => {
    getSiteList().then(x => {
      getTrapList(x[0].links[0], webSocket).then((res) => {
        console.log(res);
        setTraps(
          res.map((el) => ({
            id: el.equipamento,
            lat: el.latitude,
            lng: el.longitude,
            address: el.logradouro,
            maxSpeed: +el.velocidade_via.split(" ")[0],
            cars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          }))
        );
      });
    });
  }, []);

  useEffect(() => {
    if(totalCars == 0) {
      webSocket.onmessage = (message) => {
        const { trafic } = JSON.parse(message.data);
        let curFines = 0;
        const newTraps = [...traps]
        trafic.forEach((element) => {
          const trap = newTraps.find((trap) => trap.id === element.id);
          if(!trap) {
            return;
          }
          element.speed.forEach((el, i) => {
            trap.cars[i] += el;
            if ((i + 1) * 10 - 9 > trap.maxSpeed) {
              curFines += el;
            }
          });
        });
        setFines((prev) => prev + curFines);
        setTraps(newTraps);
        setTotalCars(
          (prev) =>
            prev +
            trafic
              .map((el) => el.speed.reduce((acc, cur) => acc + cur, 0))
              .reduce((acc, cur) => acc + cur, 0)
        );
      };
    }
  }, [traps])

  return (
    <FlexLayout justify="around" style={{ padding: "30px" }}>
      <div>
        <Text style={{ padding: "10px" }} holder="header" text="Navegaçao" />
        <Map traps={traps} />
      </div>
      <div>
        <Card style={{ padding: "20px" }}>
          <Text holder="header" text="Areas" />
        </Card>
        <Card>
          <Text
            style={{ padding: "20px" }}
            holder="header"
            text="Monitorando agora"
          />
          <div style={{ background: "#EFEFEF", padding: "15px" }}>
            <Clock />
          </div>
          <div style={{ padding: "20px" }}>
            <FlexLayout>
              <Text text={fines} holder="bold" style={{ fontSize: "24px" }} />
              <Text
                holder="label"
                text="&nbsp; infrações cometidas"
                style={{ alignSelf: "flex-end" }}
              />
            </FlexLayout>
            <FlexLayout style={{ padding: "10px 0 0" }}>
              <Text
                text={totalCars}
                holder="bold"
                style={{ fontSize: "24px" }}
              />
              <Text
                holder="label"
                text="&nbsp; veículos contabilizados"
                style={{ alignSelf: "flex-end" }}
              />
            </FlexLayout>
          </div>
        </Card>
      </div>
    </FlexLayout>
  );
}

export default Main;
