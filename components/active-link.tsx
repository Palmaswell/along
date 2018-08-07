import { withRouter } from 'next/router';
import { StyledLink } from './link';

export interface ActiveLinkProps {
  href?: string;
  index?: number;
  router?: any;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const ActiveLink: React.SFC<ActiveLinkProps> = ({ children, router, href }) => {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <StyledLink href={href} onClick={handleClick}>
      {children}
    </StyledLink>
  )
}

export default withRouter(ActiveLink)
