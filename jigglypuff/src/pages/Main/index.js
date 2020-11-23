import React, { useEffect, useState } from "react";
import { Map, Text, Card, Clock, FlexLayout } from "../../components";
import { getSiteList, getTrapList } from "../../service/main";
const webSocket = new WebSocket("ws://0.0.0.0:10003/traficData");

function Main() {
  const [fines, setFines] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [traps, setTraps] = useState([]);

  const formatMoney = (number) => {
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const getRanking = () => {
    if (traps.length < 3) {
      return <Text text="Loading..." />;
    }
    console.log(traps.map((el) => ({
      ...el,
      fineNum: el.cars.reduce((acc, cur, i) => {
        console.log(acc, cur, i)
        const speed = (i + 1) * 10;
        if (speed > el.maxSpeed) {
          acc += cur;
        }
        return acc;
      }, 0),
    })))
    const addresses = traps
      .map((el) => ({
        ...el,
        fineNum: el.cars.reduce((acc, cur, i) => {
          const speed = (i + 1) * 10;
          if (speed > el.maxSpeed) {
            acc += cur;
          }
          return acc;
        }, 0),
      }))
      .sort((a, b) => (a.fineNum <= b.fineNum ? 1 : -1))
      .map((el) => ({ add: el.address, val: el.fineNum }));
    return (
      <div style={{ padding: '10px 0 0 0'}}>
      <Text text={`${addresses[0].val} - ${addresses[0].add.split("-")[0]}`} style={{ padding: '2px 0', fontSize: '14px'}}/>
      <Text text={`${addresses[1].val} - ${addresses[1].add.split("-")[0]}`} style={{ padding: '2px 0', fontSize: '14px'}}/>
      <Text text={`${addresses[2].val} - ${addresses[2].add.split("-")[0]}`} style={{ padding: '2px 0', fontSize: '14px'}}/>
      </div>
    );
  };

  useEffect(() => {
    getSiteList().then((response) => {
      getTrapList(response[0].links[0], webSocket).then((res) => {
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
    if (totalCars == 0) {
      webSocket.onmessage = (message) => {
        const { trafic } = JSON.parse(message.data);
        let curFines = 0;
        const newTraps = [...traps];
        trafic.forEach((element) => {
          const trap = newTraps.find((trap) => trap.id === element.id);
          if (!trap) {
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
  }, [traps]);

  return (
    <FlexLayout justify="center" style={{ padding: "30px" }}>
      <div>
        <Text style={{ padding: "10px" }} holder="header" text="Navegaçao" />
        <Map traps={traps} />
      </div>
      <div style={{ padding: '40px 0 0 30px'}}>
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
        <Card style={{ padding: "20px" }}>
          <Text holder="header" text="Arrecadação com infrações" />
          <Text
            holder="bold"
            text={`${formatMoney(traps
              .map((el) => {
                let price = 0;
                el.cars.forEach((car, i) => {
                  const speed = (i + 1) * 10;
                  if (speed > el.maxSpeed) {
                    if (speed <= el.maxSpeed * 1.2) {
                      price += 130.16 * car;
                    } else if (speed <= el.maxSpeed * 1.5) {
                      price += 195.23 * car;
                    } else {
                      price += 880.41 * car;
                    }
                  }
                });
                return price;
              })
              .reduce((acc, cur) => acc + cur, 0)
              )}`}
            style={{ fontSize: "42px", alignSelf: "flex-end" }}
          />
        </Card>
        <Card style={{ padding: "20px" }}>
          <Text holder="header" text="Locais com mais infrações" />
          {getRanking()}
        </Card>
      </div>
    </FlexLayout>
  );
}

export default Main;
