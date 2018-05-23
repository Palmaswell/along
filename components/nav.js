import styled from 'react-emotion';
import fontHind from './fonts';
import { size } from './sizes'

const StyledNav = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: ${size.m}px;
  padding: ${size.xxs}px ${size.xxxs}px ${size.xs}px;

  @media (min-width: 960px) {
    padding: ${size.s}px ${size.s}px ${size.m}px;
  }
`
export const Nav = ({ children }) => (
  <StyledNav>
    {children}
  </StyledNav>
)

export default Nav;
