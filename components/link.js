import propTypes from 'prop-types';
import styled from 'react-emotion';

import color from './colors';
import fontHind from './fonts';
import { size } from './sizes';

export const StyledLink = styled.a`
  color: ${color.smokyBlack()};
  text-decoration: none;
  transition: color .33s ease-in-out;
  ${fontHind()}

  :hover {
    color: ${color.unitedNationsBlue()};
  }
`

export const Link = ({ children, href, handleClick }) => (
  <StyledLink href={href} onClick={handleClick}>
    {children}
  </StyledLink>
);

Link.propTypes =  {
  href: propTypes.string.isRequired,
  handleClick: () => {}
}


export default Link;
