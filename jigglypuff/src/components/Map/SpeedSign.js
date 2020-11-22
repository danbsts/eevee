import React from "react";
import styled from "styled-components";
import { Text } from "..";

const Container = styled.div`
  background: red;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  padding: 7px;
  
  > div {
    background-color: #FFF;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 3px;
    box-sizing: border-box;
    
    > div {
      align-self: auto;
      text-align: center;
      height: 30px;
    }
  }
`;

function SpeedSign({ speed }) {
  return (
    <Container>
      <div>
        <Text style={{ fontSize: '30px', fontWeight: 900 }} text={speed} />
        <Text style={{fontWeight: 900, flexGrow: 1}} text="km/h"></Text>
      </div>
    </Container>
  );
}

export default SpeedSign;
