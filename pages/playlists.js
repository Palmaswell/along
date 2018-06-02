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
import Background from '../components/background';
import Link from '../components/link';
import List from '../components/list';
import GridContainer from '../components/grid-container';
import GridItem from '../components/grid-item';
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
                    <Background>
                      <Nav secondary>
                        <ActiveLink href={`/`}><ArrowLeft /></ActiveLink>
                      </Nav>
                      <CommandPanel transcript={speech.result.transcript} />
                      <List>
                        {this.props.playlist.items.map((playlist, i) => (
                          <GridContainer
                            href={`/tracks/${playlist.id}`}
                            index={i}
                            key={playlist.id}>
                            <GridItem align="center">
                              <Copy color={colors.unitedNationsBlue()} tag="div">{i + 1}</Copy>
                            </GridItem>
                            <GridItem>
                              <Thumbnail
                                alt={`Playlist: ${playlist.name} cover`}
                                src={playlist.images[0].url} />
                            </GridItem>
                            <GridItem>
                              <Copy tag="div">{playlist.name}</Copy>
                            </GridItem>
                            <GridItem justify="end">
                              <Copy tag="div" size="s">{playlist.tracks.total} tracks</Copy>
                            </GridItem>
                          </GridContainer>
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


