import Link from 'next/link';

const CallBack = (props) => (
  <main>
    <h1>Successful Spotify Auth</h1>
    <Link as={`/${props.access}`} href={`/?id=${props.access}`}>
      <a>Go to playlists</a>
    </Link>
  </main>
);

CallBack.getInitialProps = ctx => {
  console.log(ctx.query.access, '*********00000')
  return {
    access: ctx.query.access
  }
}

export default CallBack;
