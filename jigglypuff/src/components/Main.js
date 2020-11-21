import React from "react";
import styled from "styled-components";
import { Map, Text, Card, Clock } from "./index";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 30px;
`;

function Main() {
  return (
    <Container>
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
        </Card>
      </div>
    </Container>
  );
}

export default Main;
