import styled from 'react-emotion';
import color from './colors';
import fontHind from './fonts';
import { size } from './sizes';

export const StyledLink = styled.a`
  color: ${color.independence()};
  text-decoration: none;
  transition: color .33s ease-in-out;
  ${fontHind()}

  :hover {
    color: ${color.celestialBlue()};
    text-decoration: underline;
  }
`

export const Link = ({ children, href, handleClick }) => (
  <StyledLink href={href} onClick={handleClick}>
    {children}
  </StyledLink>
);

export default Link;
