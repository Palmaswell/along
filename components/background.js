import styled from 'react-emotion';

import colors from './colors';

const StyledBackground = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background-color: ${colors.whiteSmoke()};
`

export const Background = ({ children }) => (
  <StyledBackground>
    {children}
  </StyledBackground>
);

export default Background;
