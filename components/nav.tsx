import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import { size } from './sizes'

export type NavType = 'primary' | 'secondary';

export interface NavProps {
  type: NavType;
}

interface StyledNavProps {
  type: NavType;
}

const StyledNav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: ${(props: StyledNavProps) => {
    switch(props.type) {
      case 'secondary':
        return 'flex-start';
      default:
        return 'flex-end';
    }
  }};
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: ${size.m}px;
  padding: ${size.xxs}px ${size.xxs}px 0;
  font-size: ${(props: StyledNavProps) => {
    switch(props.type) {
      case 'secondary':
        return '32px';
      default:
        return '16px';
    }
  }};

  @media (min-width: ${ Breakpoint.M }) {
    padding: ${size.xxs}px;
  }
`
export const Nav: React.SFC<NavProps> = ({ children, type }): JSX.Element => (
  <StyledNav type={type}>
    {children}
  </StyledNav>
);

export default Nav;
