import Cookie from 'js-cookie';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';

import { getCookie } from '../utils/cookies';
import { handleRouter } from '../utils/handle-router';

import { abstractCommandFactory } from '../providers/speech/speech-commands';
import {
  SpeechContext,
  SpeechProvider
} from '../providers/speech/speech-provider';
import { WSContext, WSProvider } from '../providers/connection-provider';
import SpeechBroker from '../providers/speech/speech-broker';

import ActiveLink from '../components/active-link';
import Copy from '../components/copy';
import Layout from '../components/layout';
import Link from '../components/link';
import List from '../components/list';
import MediaContainer from '../components/media-container';
import MediaItem from '../components/media-item';
import Thumbnail from '../components/thumbnail';
import CommandPanel from '../components/command-panel';
import SpeechControl from '../components/speech-controls';
import Space from '../components/space';
import Nav from '../components/nav';
import { size } from '../components/sizes';

export default class PlayLists extends React.Component {
  registerCommands = () => {
    const registrations = this.props.playlist.items.map(playlist => {
      return {
        callableIntent: abstractCommandFactory.register(`go to ${playlist.name}`),
        action: props => handleRouter(`/tracks/${playlist.id}`, playlist.id)
      };
    })
    registrations.push({
      callableIntent: abstractCommandFactory.register('go home'),
      action: props => handleRouter(`/`)
    })
    registrations.push({
      callableIntent: abstractCommandFactory.register('go back'),
      action: props => handleRouter(`/`)
    })

    return registrations;
  }

  render() {
    console.log(this.props.id, 'user ids')
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
                    registrationList={this.registerCommands()}
                    wsBroker={wsBroker}>
                    <Layout>
                      <Nav>
                        <ActiveLink href={`/`}>Home</ActiveLink>
                        {/* <Space size={[0, 0, 0, size.xs]}>
                          <Link
                            href={this.props.spotify.external_urls.spotify}
                            target="_blank">
                            <Thumbnail
                              alt={`Spotify profile image from ${this.props.spotify.display_name}`}
                              caption={this.userName}
                              src={this.props.spotify.images[0].url}/>
                          </Link>
                        </Space> */}
                      </Nav>
                      <CommandPanel transcript={speech.result.transcript} />
                      <List>
                        {this.props.playlist.items.map((playlist, i) => (
                          <MediaContainer
                            href={`/tracks/${playlist.id}`}
                            index={i}
                            key={playlist.id}>
                            <MediaItem align="center">
                              <Copy tag="span">
                                {i}
                              </Copy>
                            </MediaItem>
                            <MediaItem>
                              <Thumbnail
                                alt={`Playlist: ${playlist.name} cover`}
                                src={playlist.images[0].url} />
                            </MediaItem>
                            <MediaItem>
                              <Copy tag="span">
                                {playlist.name}
                              </Copy>
                            </MediaItem>
                            <MediaItem justify="end">
                              <div>{playlist.tracks.total} tracks</div>
                            </MediaItem>
                          </MediaContainer>
                        ))}
                      </List>
                      <SpeechControl handleClick={speech.start} />
                    </Layout>
                  </SpeechBroker>
                )}
              </SpeechContext.Consumer>
            </SpeechProvider>
          )}
        </WSContext.Consumer>
        </WSProvider>
      </main>
    );
  }
}

PlayLists.getInitialProps = async ctx => {
  const { id } = ctx.query;
  const res = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${getCookie('access', ctx)}`,
      'Content-Type': 'application/json',
    })
  });
  const data = await res.json();
  return {
    id: id,
    playlist: data
  }
}


