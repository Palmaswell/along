import styled from 'react-emotion';
import { withRouter } from 'next/router';
import { StyledLink } from './link';

const ActiveLink = ({ children, router, href }) => {

  const handleClick = e => {
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
