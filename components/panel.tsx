import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import Color from './color';
import getFontHind from './fonts';
import { size } from './sizes';

export interface PanelProps {
  isRecognizing: boolean;
  transcript: string;
}

interface StyledTopLineProps {
  isRecognizing: boolean;
}

const StyledPanel = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-height: 200px;
  padding: ${size.xs + 2}px ${size.xxs}px ${size.s}px;
  text-align: center;

  @media (min-width: ${Breakpoint.L}) {
    min-height: 250px;
  };
`;

const StyledTopLine = styled.div`
  margin: 0;
  font-size: 18px;
  color: ${(props: StyledTopLineProps) => props.isRecognizing
    ? Color.Amethyst()
    : Color.SmokyBlack()
  };
  ${getFontHind()}
  transition: color .333s ease-in-out;

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
  ${getFontHind()}

  @media (min-width: ${Breakpoint.M }) {
    font-size: 72px;
  }
`

export const Panel: React.SFC<PanelProps> = ({ isRecognizing, transcript }): JSX.Element => {
  return (
    <StyledPanel>
      <StyledTopLine isRecognizing={isRecognizing}>transcript</StyledTopLine>
      {transcript &&
        <StyledTranscript>
        {transcript}
        </StyledTranscript>
      }
    </StyledPanel>
  )
}

export default Panel;
