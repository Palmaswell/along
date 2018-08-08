import styled from 'react-emotion';

import color from './color';
import getFontHind from './fonts';

export interface LinkProps {
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const StyledLink = styled.a`
  color: ${color.SmokyBlack()};
  text-decoration: none;
  transition: color .33s ease-in-out;
  ${getFontHind()};

  :hover {
    color: ${color.UnitedNationsBlue()};
  }
`

export const Link: React.SFC<LinkProps> = ({ children, href, onClick }): JSX.Element => (
  <StyledLink href={href} onClick={onClick}>
    {children}
  </StyledLink>
);


export default Link;
