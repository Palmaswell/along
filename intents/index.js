import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { handleRouter } from '../utils/handle-router';

export const intentNavigatePlaylist = {
  type: 'NavigateIntent',
  samples: [
    'go to playlist',
    'show my playlists',
    'ok list',
    'so playlist'
  ],
  action(id) {
    return handleRouter(`/playlists/${id}`, id);
  }
}

export function generateIntents(intent, spotify) {
  const intents = intent.samples.map(sample => ({
    callableIntent: abstractCommandFactory.register(sample),
    action: props => intent.action(spotify)
  }))

  return intents;
};


// export function registerIndexIntents(spotifyId, ...args) {
//   console.log(...args, 'arguments')
//   const intents = [];
//   intents.push({
//     callableIntent: abstractCommandFactory.register('go to playlist'),
//     action: props => handleRouter(`/playlists/${spotifyId}`, spotifyId)
//   });
//   intents.push({
//     callableIntent: abstractCommandFactory.register('show my playlists'),
//     action: props =>  handleRouter(`/playlists/${spotifyId}`, spotifyId)
//   });
//   intents.push({
//     callableIntent: abstractCommandFactory.register('ok list'),
//     action: props =>  handleRouter(`/playlists/${spotifyId}`, spotifyId)
//   });
//   intents.push({
//     callableIntent: abstractCommandFactory.register('so playlist'),
//     action: props =>  handleRouter(`/playlists/${spotifyId}`, spotifyId)
//   });
//   return intents;
// }
