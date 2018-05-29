import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { handleRouter } from '../utils/handle-router';

export function registerIndexIntents(spotifyId) {
  const intents = [];
  intents.push({
    callableIntent: abstractCommandFactory.register('go to playlist'),
    action: props => handleRouter(`/playlists/${spotifyId}`, spotifyId)
  });
  intents.push({
    callableIntent: abstractCommandFactory.register('show my playlists'),
    action: props =>  handleRouter(`/playlists/${spotifyId}`, spotifyId)
  });
  intents.push({
    callableIntent: abstractCommandFactory.register('ok list'),
    action: props =>  handleRouter(`/playlists/${spotifyId}`, spotifyId)
  });
  intents.push({
    callableIntent: abstractCommandFactory.register('so playlist'),
    action: props =>  handleRouter(`/playlists/${spotifyId}`, this.props.spotify.id)
  });
  return intents;
}
