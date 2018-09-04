import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import { size } from './sizes'

export interface NavProps {
  secondary: boolean;
}

interface StyledNavProps {
  secondary: boolean;
}

const StyledNav = styled.div`
  display: flex;
  justify-content: ${(props: StyledNavProps) => props.secondary
    ? 'flex-start'
    : 'flex-end'
  };
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: ${size.m}px;
  padding: ${size.xxs}px ${size.xxs}px 0;
  font-size: ${props => props.secondary
    ? '32px'
    : '16px'
  };

  @media (min-width: ${ Breakpoint.M }) {
    padding: ${size.xxs}px;
  }
`
export const Nav: React.SFC<NavProps> = ({ children, secondary }): JSX.Element => (
  <StyledNav secondary={secondary}>
    {children}
  </StyledNav>
);

export default Nav;
