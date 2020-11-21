import React from "react";
import styled from 'styled-components';
import Text from "./Text";
import Card from './Card';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
`;

function Main() {
  return (
    <Container>
      <div>
        <Text holder="header" text="Navegaçao" />
      </div>
      <div>
        <Card>
          <Text holder="header" text="Areas" />
        </Card>
        <Card>
          <Text holder="header" text="Monitorando agora" />
        </Card>
      </div>
    </Container>
  );
}

export default Main;
