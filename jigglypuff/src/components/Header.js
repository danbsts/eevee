import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: #F6F7FB;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
`;

const pageTitleStyled = {
  padding: '15px',
  color: '#E65D3D',
  font: '24px Righteous',
}

function Header() {
  return (
    <Container>
      <div style={pageTitleStyled}>Eevee</div>
    </Container>
  );
}

export default Header;
