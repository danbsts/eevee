import React from 'react';
import styled from 'styled-components';

const Title = styled.div`
  padding: 15px;
  color: #E65D3D;
  font: 24px Righteous, Sans-serif;
`;

const Header = styled.div`
  color: gray;
  font: 20px Roboto, Sans-serif;
`;

function Text({ holder, text }) {
  if(holder === 'title') {
    return <Title>{text}</Title>;
  }
  if(holder === 'header') {
    return <Header>{text}</Header>;
  }
  return <p>{text}</p>;
}

export default Text;