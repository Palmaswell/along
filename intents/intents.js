import { IntentFactory } from './intent-factory';
import { handleRouter } from '../utils/handle-router';

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

export const playlistsIntent =  IntentFactory({
  type: 'PlaylistsIntent',
  samples: [
    'go to',
    'show me',
    'show me',
    'so'
  ],
  action(id) {
    return handleRouter(`/tracks/${id}`, id)
  }
});

export const homeIntent = IntentFactory({
  type: 'HomeIntent',
  samples: [
    'go home',
    'go back',
    'call back'
  ],
  action() {
    return handleRouter(`/`)
  }
});
