import { handleRouter } from '../utils/handle-router';

export enum Intent {
  navigate = 'NavigateIntent',
  playlists = 'PlaylistsIntent',
  tracks = 'TracksIntent',
  home = 'HomeIntent',
  overlay = 'Overlay',
}

export interface IntentProps {
  type: Intent;
  samples: string[];
  action(param: string | undefined): string | void;
}

export const IntentFactory = ({ type, samples, action }): IntentProps => ({
  type,
  samples,
  action
});

export const navigateIntent: IntentProps =  IntentFactory({
  type: Intent.navigate,
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
  type: Intent.playlists,
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
  type: Intent.tracks,
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
  type: Intent.home,
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

export const overlayIntent: IntentProps =  IntentFactory({
  type: Intent.overlay,
  samples: [
    'language',
    'show language',
    'open language',
    'show languages',
    'open languages',
    'close languages',
    'close language',
    'lenguajes',
    'lenguaje',
    'idiomas',
    'enseñame idiomas',
    'enseñame lenguajes',
    'cierra lenguajes',
  ],
  action(func) {
    return func();
  }
});
