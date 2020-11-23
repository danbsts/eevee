import React, { useEffect } from "react";
import { Map, Text, Card, Clock, FlexLayout } from "../../components";
import { getSiteList, getTrapList } from '../../service/main';
const webSocket = new WebSocket('ws://0.0.0.0:10003/traficData');

function Main() {

  useEffect(() => {
    webSocket.onmessage = (message) => {
      console.log(message.data);
    };

    var site = getSiteList().then(res => {
      getTrapList(res[0].links[0], webSocket);
    });
  }, []);

  return (
    <FlexLayout justify="around" style={{padding: '30px'}}>
      <div>
        <Text style={{ padding: "10px" }} holder="header" text="Navegaçao" />
        <Map />
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
              <Text text={53} holder="bold" style={{ fontSize: "24px" }} />
              <Text
                holder="label"
                text="&nbsp; infrações cometidas"
                style={{ alignSelf: "flex-end" }}
              />
            </FlexLayout>
            <FlexLayout style={{ padding: "10px 0 0" }}>
              <Text text={219} holder="bold" style={{ fontSize: "24px" }} />
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
