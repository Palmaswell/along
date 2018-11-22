import styled from 'react-emotion';
import { size } from './sizes'

export type NavType = 'primary' | 'secondary';

export interface NavProps {
  type: NavType;
}

interface StyledNavProps {
  type: NavType;
}

const StyledNav = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  z-index: 2;
  justify-content: ${(props: StyledNavProps) => {
    switch(props.type) {
      case 'secondary':
        return 'flex-start';
      default:
        return 'space-between';
    }
  }};
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: ${size.m}px;
  padding: ${size.xxxs}px ${size.xxs}px 0;
  font-size: ${(props: StyledNavProps) => {
    switch(props.type) {
      case 'secondary':
        return '32px';
      default:
        return '16px';
    }
  }};
`
export const Nav: React.SFC<NavProps> = ({ children, type }): JSX.Element => (
  <StyledNav type={type}>
    {children}
  </StyledNav>
);

export default Nav;
