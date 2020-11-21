import React from 'react';
import styled from 'styled-components';

const Title = styled.div`
  padding: 15px;
  color: #E65D3D;
  font: 24px Righteous, Sans-serif;
`;

const Header = styled.div`
  color: gray;
  font-size: 16px;
`;

const Bold = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const Paragraph = styled.div`
  font-size: 16px;
`;

function Text({ holder, text, style }) {
  if(holder === 'title') {
    return <Title style={style}>{text}</Title>;
  }
  if(holder === 'header') {
    return <Header style={style}>{text}</Header>;
  }
  if(holder === 'bold') {
    return <Bold style={style}>{text}</Bold>;
  }
  return <Paragraph style={style}>{text}</Paragraph>;
}

export default Text;