import Router from 'next/router';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';

import { getCookie } from '../utils/cookies';
import { safeParse } from '../utils/safe-parse';
import { handleRouter } from '../utils/handle-router';

import { abstractCommandFactory } from '../providers/speech/speech-commands';
import {
  SpeechContext,
  SpeechProvider
} from '../providers/speech/speech-provider';
import { WSContext, WSProvider } from '../providers/connection-provider';
import SpeechBroker from '../providers/speech/speech-broker';

import ActiveLink from '../components/active-link';
import Layout from '../components/layout';
import Headline from '../components/headline';
import SpeechButton from '../components/speech-button';
import Nav from '../components/nav';

export default class Index extends React.Component {

  registerCommands = () => {
    const registrations = [];
    registrations.push({
      callableIntent: abstractCommandFactory.register('go to playlist'),
      action: props => handleRouter(`/playlists/${this.props.spotify.id}`, this.props.spotify.id)
    });
    registrations.push({
      callableIntent: abstractCommandFactory.register('show playlist'),
      action: props =>  handleRouter(`/playlists/${this.props.spotify.id}`, this.props.spotify.id)
    });
    registrations.push({
      callableIntent: abstractCommandFactory.register('ok list'),
      action: props =>  handleRouter(`/playlists/${this.props.spotify.id}`, this.props.spotify.id)
    });
    registrations.push({
      callableIntent: abstractCommandFactory.register('so playlist'),
      action: props =>  handleRouter(`/playlists/${this.props.spotify.id}`, this.props.spotify.id)
    });
    return registrations;
  }

  render() {
    console.log(this.props.spotify)
    return (
    <WSProvider
      channel="Home">
      <WSContext.Consumer>
        {wsBroker => (
          <SpeechProvider
            channel="Home"
            wsBroker={wsBroker}>
            <SpeechContext.Consumer>
              {speech => (
                <SpeechBroker
                  registrationList={this.registerCommands()}
                  wsBroker={wsBroker}>
                  <Layout>
                  <Nav>
                    <ActiveLink
                      href={`/playlists/${this.props.spotify.id}`}>
                      Playlists
                    </ActiveLink>
                  </Nav>
                    {/* <Headline order="h1">
                      Glad to see you
                    </Headline>
                    {this.props.spotify &&
                      <Headline order="h2">
                      {this.props.spotify.display_name}! 👋
                    </Headline>
                    } */}
                    <h1>You said {speech.result.transcript} </h1>
                    <SpeechButton handleClick={speech.start} />
                  </Layout>
              </SpeechBroker>
              )}
            </SpeechContext.Consumer>
          </SpeechProvider>
        )}
      </WSContext.Consumer>
    </WSProvider>
    );
  }
}

Index.getInitialProps =  async ctx => {
  const res = await fetch(`https://api.spotify.com/v1/me`, {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${getCookie('access', ctx)}`,
      'Content-Type': 'application/json',
    })
  });
  const data = await res.json();
  return {
    spotify: data ? data : null
  }
}
