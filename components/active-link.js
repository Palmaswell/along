import { withRouter } from 'next/router'

const ActiveLink = ({ children, router, href }) => {

  const handleClick = e => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  )
}

export default withRouter(ActiveLink)
