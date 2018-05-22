import styled from 'react-emotion';
import fontHind from './fonts';
import { size } from './sizes'

const StyledNav = styled.nav`
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  width: 100%;
  height: ${size.m}px;
  padding: ${size.xs}px;
  line-height: ${size.m}px;
`
export const Nav = ({ children }) => (
  <StyledNav>
    {children}
  </StyledNav>
)

export default Nav;
