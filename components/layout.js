import styled from 'react-emotion';

import colors from './colors';

const StyledLayout = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  background-color: ${colors.floralWhite()};
`

export const Layout = ({ children }) => (
  <StyledLayout>
    {children}
  </StyledLayout>
);

export default Layout;
