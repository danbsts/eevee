import React, { useEffect, useState } from "react";
import { Card, FlexLayout, Text } from "../../components";
import api from "../../service/axios";
import { Chart } from "./components";

const colors = [
  "rgba(114, 188, 191)",
  "rgba(244, 211, 98)",
  "rgba(95, 155, 232)",
];

const colorsAlpha = [
  "rgba(114, 188, 191, 0.9)",
  "rgba(244, 211, 98, 0.9)",
  "rgba(95, 155, 232, 0.9)",
];

function Dashboards() {
  const [traps, setTraps] = useState([]);
  const [month, setMonth] = useState();
  const [monthList, setMonthList] = useState([]);

  const formatMoney = (number) => {
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const selectMonth = (m) => {
    const params = {
      ids: JSON.stringify(traps.map(({ id }) => id)),
      beginDate: `${m}-01`,
      endDate: `${m}-31`,
    };
    api.get("/records", { params }).then((res) => {
      const { records } = res.data;
      Object.entries(records).forEach((el) => {
        const key = el[0],
          value = el[1];
        const tr = traps.find((t) => t.id === key);
        tr.fines = Object.values(value).map((day) => {
          return day.reduce((acc, cur, i) => {
            const speed = (i + 1) * 10;
            if (speed > tr.maxSpeed) {
              acc += cur;
            }
            return acc;
          }, 0);
        });
        tr.finesValue = Object.values(value).map((day) => {
          return day.reduce((acc, car, i) => {
            const speed = (i + 1) * 10;
            if (speed > tr.maxSpeed) {
              if (speed <= el.maxSpeed * 1.2) {
                return acc + 130.16 * car;
              } else if (speed <= el.maxSpeed * 1.5) {
                return acc + 195.23 * car;
              } else {
                return acc + 880.41 * car;
              }
            }
            return acc;
          }, 0);
        });
        tr.totalCarsDay = Object.values(value).map((day) =>
          day.reduce((acc, cur) => acc + cur, 0)
        );
      });
      setTraps([...traps]);
    });
  };

  useEffect(() => {
    return api.get("/sites/1").then((res) => {
      res = res.data;
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
  }, []);

  useEffect(() => {
    api.get("/records/days").then((res) => {
      const { months } = res.data;
      setMonthList(months);
      console.log(months);
    });
  }, []);

  return (
    <>
      <FlexLayout justify="around" style={{ padding: "40px 0 0 0" }}>
        <Card style={{ padding: "20px" }}>
          <Text holder="header" text="Meses disponiveis" />
          {monthList.map((m, i) => (
            <Text
              key={m}
              text={m}
              style={{
                padding: i === 0 ? "10px 0 0" : "2px 0",
                fontSize: "14px",
              }}
              onClick={() => selectMonth(m)}
            />
          ))}
        </Card>
        <div style={{ width: "70%" }}>
          <Text holder="bold" text="Novembro 2020" />
          <Chart
            data={{
              labels: Array.from({ length: 30 }, (_, i) => i + 1),
              datasets:
                traps.length > 0 && traps[0].finesValue
                  ? traps
                      .map((tr, i) => ({
                        label: tr.address,
                        data: tr.fines,
                        fill: true,
                        ord: tr.fines.reduce((acc, cur) => acc + cur, 0),
                        backgroundColor: colors[i % 3],
                        borderColor: colorsAlpha[i % 3],
                        yAxisID: "y-axis-1",
                      }))
                      .sort((a, b) => (a.ord <= b.ord ? -1 : 1))
                      .slice(traps.length - 3, traps.length)
                  : [],
            }}
          />
          <FlexLayout justify="around">
            <Card style={{ margin: "30px" }}>
              <Text
                style={{ padding: "20px" }}
                holder="header"
                text="Resumo do mes"
              />
              {/* <div style={{ background: "#EFEFEF", padding: "15px" }}>
                <Clock />
              </div> */}
              <div style={{ padding: "0 20px 20px" }}>
                <FlexLayout>
                  <Text
                    text={traps
                      .map((tr) => {
                        if (!tr.fines) return 0;
                        return tr.fines.reduce((acc, cur) => acc + cur, 0);
                      })
                      .reduce((acc, cur) => acc + cur, 0)}
                    holder="bold"
                    style={{ fontSize: "24px" }}
                  />
                  <Text
                    holder="label"
                    text="&nbsp; infrações cometidas"
                    style={{ alignSelf: "flex-end" }}
                  />
                </FlexLayout>
                <FlexLayout style={{ padding: "10px 0 0" }}>
                  <Text
                    text={traps
                      .map((tr) => {
                        if (!tr.totalCarsDay) return 0;
                        return tr.totalCarsDay.reduce(
                          (acc, cur) => acc + cur,
                          0
                        );
                      })
                      .reduce((acc, cur) => acc + cur, 0)}
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
            <Card
              style={{ padding: "20px", height: "fit-content", margin: "30px" }}
            >
              <Text holder="header" text="Arrecadação com infrações" />
              <Text
                holder="bold"
                text={formatMoney(
                  traps
                    .map((el) => {
                      if (!el.finesValue) return 0;
                      return el.finesValue.reduce((acc, cur) => acc + cur, 0);
                    })
                    .reduce((acc, cur) => acc + cur, 0)
                )}
                style={{ fontSize: "42px", alignSelf: "flex-end" }}
              />
            </Card>
          </FlexLayout>
        </div>
      </FlexLayout>
    </>
  );
}

export default Dashboards;
