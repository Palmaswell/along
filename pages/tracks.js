import fetch, { Headers }  from 'node-fetch';
import Link from 'next/link';
import { hydrate, injectGlobal } from 'react-emotion';

import { getCookie } from '../utils/cookies';
import { handleRouter } from '../utils/handle-router';
import { formatMilliseconds } from '../utils/readable-time';

import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { SpeechContext, SpeechProvider } from '../providers/speech/speech-provider';
import { WSContext, WSProvider } from '../providers/connection-provider';
import SpeechBroker from '../providers/speech/speech-broker';

import { createIntents } from '../intents/create-intents';
import { tracksIntent } from '../intents/intents';

import ActiveLink from '../components/active-link';
import { ArrowLeft } from '../components/icons';
import Copy from '../components/copy';
import colors from '../components/colors';
import Background from '../components/background';
import List from '../components/list';
import MediaContainer from '../components/media-container';
import GridItem from '../components/grid-item';
import Thumbnail from '../components/thumbnail';
import CommandPanel from '../components/command-panel';
import SpeechControl from '../components/speech-controls';
import Space from '../components/space';
import Nav from '../components/nav';
import { size } from '../components/sizes';

export default class Tracks extends React.Component {
  componentDidMount() {
    this.fetchDevices();
  }

  fetchDevices = async () => {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      })
    });
    const devices = await res.json();
    return devices;
  }

  pauseTrack = async () => {
    const res = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
    });
    const data = await res.json();
}

  playTrack = async uri => {
    const devices = this.devices ? `?device_id=${this.devices}` : '';
    const res = await fetch(`https://api.spotify.com/v1/me/player/play${devices}`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({'context_uri': `${uri}`})
    });
    const data = await res.json();
  }

  resumeTrack = async () => {
    const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
    });
    const data = await res.json();
  }

  render() {
    return (
      <main>
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
                    registrationList={createIntents(
                      tracksIntent,
                      this.props.tracks,
                      this.playTrack,
                      this.pauseTrack,
                      this.resumeTrack,
                      this.props.userId)}
                    wsBroker={wsBroker}>
                    <Background>
                      <Nav secondary>
                        <ActiveLink
                        href={`/playlists/${this.props.userId}`}>
                          <ArrowLeft />
                        </ActiveLink>
                      </Nav>
                      <CommandPanel transcript={speech.result.transcript} />
                      <List>
                        {this.props.tracks.map((playlist, i) => (
                          <MediaContainer
                            handleClick={() => this.playTrack(playlist.track.album.uri)}
                            key={playlist.track.id}>
                            <GridItem align="center">
                              <Copy color={colors.unitedNationsBlue()} tag="div">{i + 1}</Copy>
                            </GridItem>
                            <GridItem>
                              <Thumbnail
                                alt={`${playlist.track.album.name} track name`}
                                src={playlist.track.album.images[0].url} />
                            </GridItem>
                            <GridItem>
                              <Copy tag="div" weight={'bold'}>{playlist.track.name}</Copy>
                              <Copy size="s" tag="div">
                                {playlist.track.artists[0].name}
                              </Copy>
                            </GridItem>
                            <GridItem justify="end">
                              <Copy tag="div">{formatMilliseconds(playlist.track.duration_ms)}</Copy>
                              {playlist.track.explicit &&
                                <Copy tag="div" size="s">{playlist.track.explicit}</Copy>
                              }
                            </GridItem>

                            {/* <button onClick={this.pauseTrack}>pause</button>
                            <button onClick={this.resumeTrack}>resume</button> */}

                          </MediaContainer>
                        ))}
                      </List>
                      <SpeechControl handleClick={speech.start} />
                    </Background>
                  </SpeechBroker>
                )}
              </SpeechContext.Consumer>
            </SpeechProvider>
          )}
        </WSContext.Consumer>
        </WSProvider>
      </main>
    )
  }
}

Tracks.getInitialProps = async ctx => {
  const { play_id } = ctx.query;
  const res = await fetch(`https://api.spotify.com/v1/users/${getCookie('user_id', ctx)}/playlists/${play_id}/tracks`, {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${getCookie('access', ctx)}`,
      'Content-Type': 'application/json',
    })
  });
  const tracks = await res.json();
  return {
    tracks: tracks.items || [],
    userId: getCookie('user_id', ctx)
  }
}
