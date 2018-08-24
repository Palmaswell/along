import styled from 'react-emotion';
import Color from './color';

const StyledBackground = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background-color: ${Color.WhiteSmoke()};
`;

export const Background: React.SFC<{}> = ({ children }) => (
  <StyledBackground>
    {children}
  </StyledBackground>
);

export default Background;
