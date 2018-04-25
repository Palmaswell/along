import ActiveLink from '../components/active-link';

const CallBack = (props) => (
  <main>
    <h1>You are now successfully loged in with your Spotify account</h1>
    <ActiveLink href='/' >
      Go back Home
    </ActiveLink>
  </main>
);

CallBack.getInitialProps = ctx => {
  return {
    access: ctx.query.access
  }
}

export default CallBack;
