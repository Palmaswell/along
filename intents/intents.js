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

