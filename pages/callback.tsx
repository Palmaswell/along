import * as React from 'react';
import ActiveLink from '../components/active-link';
import { ArrowLeft } from '../components/icons';
import Background from '../components/background';
import Headline from '../components/headline';
import Nav from '../components/nav';
import Space from '../components/space';
import { size } from '../components/sizes';

interface StatelessPage<P = {}> extends React.SFC<P> {
  getInitialProps?: (ctx: any) => Promise<P>
}


const CallBack: StatelessPage<{}> = () => (
  <Background>
     <Nav type="secondary">
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

CallBack.getInitialProps = async ctx => {
  return {
    access: ctx.query.access
  }
}

export default CallBack;
