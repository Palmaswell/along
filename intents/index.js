import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { handleRouter } from '../utils/handle-router';

export function IntentFactory({ type, samples, action }) {
  return {
    type,
    samples,
    action
  }
};

export const navigateIntent =  IntentFactory({
  type: 'NavigateIntent',
  samples: [
    'go to playlist',
    'show my playlists',
    'show my playlist',
    'call list',
    'ok list',
    'so playlist'
  ],
  action(id) {
    return handleRouter(`/playlists/${id}`, id);
  }
});

export const intentNavigatePlaylist = {
  type: 'NavigateIntent',
  samples: [
    'go to playlist',
    'show my playlists',
    'show my playlist',
    'call list',
    'ok list',
    'so playlist'
  ],
  action(id) {
    return handleRouter(`/playlists/${id}`, id);
  }
};

export function generateIntents(intent, ...args) {
  return intent.samples.map(sample => ({
    callableIntent: abstractCommandFactory.register(sample),
    action: props => intent.action(...args)
  }))
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
