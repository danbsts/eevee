import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .13);
  border: 1px solid #E9E9E9;
  border-radius: 10px;
  padding: 20px;
`;

function Card({ children }) {
  return <Container>{children}</Container>
}

export default Card;
