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

const Label = styled.div`
  font-size: 16px;
`;

const Default = styled.div`
  font-size: 14px;
`;

const Subtitle = styled.div`
  font-size: 12px;
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
  if(holder === 'subtitle') {
    return <Subtitle style={style}>{text}</Subtitle>;
  }
  if(holder === 'label') {
    return <Label style={style}>{text}</Label>;
  }
  return <Default style={style}>{text}</Default>;
}

export default Text;