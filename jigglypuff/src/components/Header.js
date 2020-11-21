import React from 'react';
import styled from 'styled-components';
import Text from './Text';

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: #F6F7FB;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

function Header() {
  return (
    <Container>
      <Text holder="title" text="Eevee"/>
    </Container>
  );
}

export default Header;
