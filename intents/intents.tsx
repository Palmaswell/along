import { handleRouter } from '../utils/handle-router';

export type IntentTypes = 'NavigateIntent' | 'PlaylistsIntent' | 'TracksIntent' | 'HomeIntent';

export interface IntentProps {
  type: IntentTypes;
  samples: string[];
  action(param: string | undefined): string | void;
}

export function IntentFactory({ type, samples, action }): IntentProps {
  return {
    type,
    samples,
    action
  }
};

export const navigateIntent: IntentProps =  IntentFactory({
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
  action(id: string) {
    return handleRouter(`/playlists/${id}`, id);
  }
});

export const playlistsIntent: IntentProps =  IntentFactory({
  type: 'PlaylistsIntent',
  samples: [
    'go to',
    'show me',
    'show me',
    'so',
    've',
    've a'
  ],
  action(id: string) {
    return handleRouter(`/tracks/${id}`, id)
  }
});

export const tracksIntent: IntentProps =  IntentFactory({
  type: 'TracksIntent',
  samples: [
    'play',
    '',
    'toca'
  ],
  action(func, uri: string) {
    return func(uri)
  }
});

export const homeIntent: IntentProps = IntentFactory({
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
