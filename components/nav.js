import propTypes from 'prop-types';
import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import getFontHind from './fonts';
import { size } from './sizes'

const StyledNav = styled.nav`
  display: flex;
  justify-content: ${props => props.secondary
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
export const Nav = ({ children, secondary }) => (
  <StyledNav secondary={secondary}>
    {children}
  </StyledNav>
);

Nav.propTypes =  {
  secondary: propTypes.bool
}


export default Nav;
