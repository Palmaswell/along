import ActiveLink from '../components/active-link';
import { ArrowLeft } from '../components/icons';
import Background from '../components/background';
import Headline from '../components/headline';
import Nav from '../components/nav';
import Space from '../components/space';
import { size } from '../components/sizes';


const CallBack = (props) => (
  <Background>
     <Nav secondary>
      <ActiveLink
      href={'/'}>
        <ArrowLeft />
      </ActiveLink>
    </Nav>
    <Space size={size.xs}>
    <Headline order="h1">
      You are now successfully logged in with your Spotify account
    </Headline>
    </Space>
  </Background>
);

CallBack.getInitialProps = ctx => {
  return {
    access: ctx.query.access
  }
}

export default CallBack;
