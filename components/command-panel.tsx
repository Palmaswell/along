import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import Color from './color';
import fontHind from './fonts';
import { size } from './sizes';

export interface CommandPanelProps {
  transcript: string;
}

const StyledPanel = styled.section`
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  padding: ${size.xxs}px ${size.xxs}px ${size.s}px;
  text-align: center;

  @media (min-width: ${Breakpoint.L}) {
    height: 250px;
    padding: ${size.xs}px ${size.s}px ${size.m}px;
  };
`;

const StyledTopLine = styled.div`
  margin: 0;
  font-size: 18px;
  color: ${Color.SmokyBlack()};
  ${fontHind()}

  @media (min-width: ${Breakpoint.M}) {
    font-size: 32px;
  }
`

const StyledTranscript = styled.h1`
  min-height: 70px;
  margin: 0;
  line-height: 1.5;
  color: ${Color.SmokyBlack()};
  font-size: 48px;
  ${fontHind()}

  @media (min-width: ${Breakpoint.M }) {
    font-size: 72px;
  }
`

export const CommandPanel: React.SFC<CommandPanelProps> = ({ transcript }): JSX.Element => {
  return (
    <StyledPanel>
      <StyledTopLine>transcript</StyledTopLine>
      <StyledTranscript>
        {transcript}
      </StyledTranscript>
    </StyledPanel>
  )
}

export default CommandPanel;
