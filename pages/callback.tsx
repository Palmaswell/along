import * as React from 'react';
import * as Component from '../components';
import ActiveLink from '../components/active-link';
import { size } from '../components/sizes';

interface StatelessPage<P = {}> extends React.SFC<P> {
  getInitialProps?: (ctx: any) => Promise<P>
}

const CallBack: StatelessPage<{}> = () => (
  <Component.Background>
     <Component.Nav type="secondary">
      <ActiveLink
      href={'/'}>
        <Component.ArrowLeft />
      </ActiveLink>
    </Component.Nav>
    <Component.Space size={size.xs}>
    <Component.Headline order="h1">
      You are now successfully logged in with your Spotify account
    </Component.Headline>
    </Component.Space>
  </Component.Background>
);

CallBack.getInitialProps = async ctx => {
  return {
    access: ctx.query.access
  }
}

export default CallBack;
