import React from "react";
import styled from "styled-components";
import FlexLayout from "./FlexLayout";
import Text from "./Text";

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: #f6f7fb;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  * {
    text-decoration: none;
    color: #e65d3d;
  }
`;

function Header() {
  return (
    <Container>
      <Text holder="title" text="Eevee" />
      <FlexLayout style={{ width: "auto", padding: "0 50px" }} align="center">
        <a href="/">
          <Text holder="header" text="Home" style={{ padding: "0 20px" }} />
        </a>
        <a href="/dashboards">
          <Text holder="header" text="Dashboards" />
        </a>
      </FlexLayout>
    </Container>
  );
}

export default Header;
