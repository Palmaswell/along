import styled from 'react-emotion';

import color from './color';
import fontHind from './fonts';

export interface LinkProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export const StyledLink = styled.a`
  color: ${color.SmokyBlack()};
  text-decoration: none;
  transition: color .33s ease-in-out;
  ${fontHind()};

  :hover {
    color: ${color.UnitedNationsBlue()};
  }
`

export const Link: React.SFC<LinkProps> = ({ children, href, onClick }) => (
  <StyledLink href={href} onClick={onClick}>
    {children}
  </StyledLink>
);


export default Link;
