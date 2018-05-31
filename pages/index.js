import Router from 'next/router';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';

import { getCookie } from '../utils/cookies';
import { safeParse } from '../utils/safe-parse';
import { handleRouter } from '../utils/handle-router';

import { SpeechContext, SpeechProvider } from '../providers/speech/speech-provider';
import { WSContext, WSProvider } from '../providers/connection-provider';
import SpeechBroker from '../providers/speech/speech-broker';

import { createIntents } from '../intents/intent-factory';
import { navigateIntent } from '../intents/intents';

import ActiveLink from '../components/active-link';
import Background from '../components/background';
import Link from '../components/link';
import Thumbnail from '../components/thumbnail';
import CommandPanel from '../components/command-panel';
import SpeechControl from '../components/speech-controls';
import Space from '../components/space';
import Nav from '../components/nav';
import { size } from '../components/sizes';

export default class Index extends React.Component {
  componentDidMount() {
    this.userName = this.props.spotify.display_name.replace(/\s(.*)/g, '');
  }

  render() {
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
                  registrationList={createIntents(navigateIntent, this.props.spotify.id)}
                  wsBroker={wsBroker}>
                  <Background>
                    <Nav>
                      <ActiveLink
                        href={`/playlists/${this.props.spotify.id}`}>
                        Playlists
                      </ActiveLink>
                      <Space size={[0, 0, 0, size.xs]}>
                        <Link
                          href={this.props.spotify.external_urls.spotify}
                          target="_blank">
                          <Thumbnail
                            alt={`Spotify profile image from ${this.props.spotify.display_name}`}
                            caption={this.userName}
                            src={this.props.spotify.images[0].url}/>
                        </Link>
                      </Space>
                    </Nav>
                    <CommandPanel transcript={speech.result.transcript} />
                    <SpeechControl handleClick={speech.start} />
                  </Background>
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
