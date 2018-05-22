import styled from 'react-emotion';

import colors from './colors';
import fontHind from './fonts';
import Headline from './headline';
import { size } from './sizes';

const StyledPanel = styled.section`
  box-sizing: border-box;
  width: 100vw;
  padding: ${size.xxs}px;
  text-align: center;

  @media (min-width: 960px) {
    padding: ${size.s}px
  };
`

const StyledTranscript = styled(Headline)`
  color: ${colors.lightCyan()};
`

export const CommandPanel = ({ transcript }) => {
  return (
    <StyledPanel>
      <StyledTranscript order="h1">
        transcript: {transcript}
      </StyledTranscript>
    </StyledPanel>
  )
}

export default CommandPanel;
