import fetch, { Headers }  from 'node-fetch';

import { getCookie } from '../utils/cookies';
import { handleRouter } from '../utils/handle-router';

import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { SpeechContext, SpeechProvider } from '../providers/speech/speech-provider';
import { WSContext, WSProvider } from '../providers/connection-provider';
import SpeechBroker from '../providers/speech/speech-broker';

import { createIntents } from '../intents/create-intents';
import { playlistsIntent, homeIntent } from '../intents/intents';

import ActiveLink from '../components/active-link';
import { ArrowLeft } from '../components/icons';
import Copy from '../components/copy';
import colors from '../components/colors';
import Link from '../components/link';
import List from '../components/list';
import GridContainer from '../components/grid-container';
import GridItem from '../components/grid-item';
import Media from '../components/media';
import ListItem from '../components/list-item';
import Thumbnail from '../components/thumbnail';
import CommandPanel from '../components/command-panel';
import SpeechControl from '../components/speech-controls';
import Space from '../components/space';
import Nav from '../components/nav';
import { size } from '../components/sizes';

export default class PlayLists extends React.Component {
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
                    registrationList={createIntents(playlistsIntent, this.props.playlist.items)}
                    wsBroker={wsBroker}>
                    <Nav secondary>
                      <ActiveLink href={`/`}><ArrowLeft /></ActiveLink>
                    </Nav>
                    <CommandPanel transcript={speech.result.transcript} />
                    <List flex>
                      {this.props.playlist.items.map((playlist, i) => (
                        <ListItem key={playlist.id} flex>
                          <ActiveLink
                            href={`/tracks/${playlist.id}`}
                            index={i}
                            key={playlist.id}>
                            <Media
                              alt={`Playlist: ${playlist.name} cover`}
                              src={playlist.images[0].url}
                              large />
                            <Space size={[size.xxxs, 0, 0]}>
                              <Copy tag="div">{playlist.name}</Copy>
                            </Space>
                            <Space>
                              <Copy tag="div" size="s">
                                {playlist.tracks.total} tracks
                              </Copy>
                            </Space>
                          </ActiveLink>
                        </ListItem>
                      ))}
                    </List>
                    <SpeechControl handleClick={speech.start} />
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


