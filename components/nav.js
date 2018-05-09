import styled from 'react-emotion';
import { size } from './sizes'

const StyledNav = styled.nav`
  display: block;
  width: 100%;
  height: ${size.m}px;
  line-height: ${size.m}px;

`
export const Nav = ({ children }) => (
  <StyledNav>
    {children}
  </StyledNav>
)

export default Nav;
