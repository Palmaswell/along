import styled from 'react-emotion';

import colors from './colors';
import fontHind from './fonts';
import Headline from './headline';
import { size } from './sizes';

const StyledPanel = styled.section`
  box-sizing: border-box;
  width: 100vw;
  padding: ${size.xxs}px ${size.xxs}px ${size.s}px;;
  text-align: center;

  @media (min-width: 960px) {
    padding: ${size.s}px ${size.s}px ${size.m}px;
  };
`;

const StyledTopLine = styled.div`
  margin: 0;
  font-size: 18px;
  color: ${colors.lightCyan()};
  ${fontHind()}

  @media (min-width: 960px ) {
    font-size: 32px;
  }
`

const StyledTranscript = styled.h1`
  min-height: 70px;
  line-height: 1.5;
  color: ${colors.lightCyan()};
  font-size: 48px;
  ${fontHind()}

  @media (min-width: 960px ) {
    font-size: 72px;
  }
`

export const CommandPanel = ({ transcript }) => {
  return (
    <StyledPanel>
      <StyledTopLine>transcript:</StyledTopLine>
      <StyledTranscript order="h1">
        {transcript}
      </StyledTranscript>
    </StyledPanel>
  )
}

export default CommandPanel;