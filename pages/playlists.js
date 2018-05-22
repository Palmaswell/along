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
                    <ActiveLink href={`/`}>Back</ActiveLink>
                    <button
                      name="Start Speech"
                      onClick={speech.start}
                      type="button">
                      Talk !
                    </button>
                    {this.props.playlist.items.map((playlist, i) => {
                    return (
                      <div key={playlist.id}>
                      <ActiveLink
                      href={`/tracks/${playlist.id}`}>
                      <img src={playlist.images[0].url} alt={`${playlist.name} cover`} />
                      </ActiveLink>
                      <div>{playlist.name}</div>
                      <div>{playlist.tracks.total} tracks</div>
                      <div>{playlist.tracks.total} tracks</div>
                      </div>
                    );
                    })}
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


