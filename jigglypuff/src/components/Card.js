import React from "react";
import styled from "styled-components";

const Container = styled.div`
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.13);
  border: 1px solid #e9e9e9;
  border-radius: 10px;
`;

function Card({ children, style }) {
  return <Container style={style}>{children}</Container>;
}

export default Card;
