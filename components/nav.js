import styled from 'react-emotion';

const StyledNav = styled.nav`
  display: block;
  width: 100%;
  height: 65px;

`

export const Nav = props => (
  <StyledNav>
    {props.children}
  </StyledNav>
)

export default Nav;
