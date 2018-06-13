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
    'good playlist',
    'go to playlist',
    'show my playlists',
    'show my playlist',
    'call list',
    'ok list',
    'so playlist',
    'musica',
    'mi musica'
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
    'so',
    've',
    've a'
  ],
  action(id) {
    return handleRouter(`/tracks/${id}`, id)
  }
});

export const tracksIntent =  IntentFactory({
  type: 'TracksIntent',
  samples: [
    'play',
    '',
    'toca'
  ],
  action(func, uri) {
    return func(uri)
  }
});

export const homeIntent = IntentFactory({
  type: 'HomeIntent',
  samples: [
    'go home',
    'go back',
    'call back',
    'regresa'
  ],
  action() {
    return handleRouter(`/`)
  }
});
