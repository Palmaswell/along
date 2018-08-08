import { abstractCommandFactory } from '../providers/speech/commands';
import { handleRouter } from '../utils/handle-router';
import { IntentProps} from './intents';

export function registerIntent(intent: IntentProps, ...args) {
  switch(intent.type) {
    case 'NavigateIntent':
      /**
       * @param [...args][0] the spotify playlist url id
       */
      return intent.samples.map(sample => ({
        callableIntent: abstractCommandFactory.register(sample),
        action: () => intent.action([...args][0])
      }));
    case 'PlaylistsIntent':
      /**
       * @param [...args][0] contains a list of playlists
       */
      return [...args][0].reduce((playlist, item) => {
        intent.samples.forEach(sample => {
          playlist.push({
            callableIntent: abstractCommandFactory.register(`${sample} ${item.name}`),
            action: () => intent.action(item.id)
          })
        });
        playlist.push({
          callableIntent: abstractCommandFactory.register('home'),
          action: () => handleRouter(`/`)
        });
        playlist.push({
          callableIntent: abstractCommandFactory.register('go home'),
          action: () => handleRouter(`/`)
        });
        return playlist;
      }, []);
    case 'TracksIntent':
      /**
       * @param [...args][0] contains a list of tracks
       * @param [...args][1] contains a function to play track
       * @param [...args][2] contains a function to pause track
       * @param [...args][3] contains a function to resume track
       * @param [...args][4] contains a prop with the user id
       */
      const tracks = [...args][0].reduce((track, item) => {
        intent.samples.forEach(sample => {
          track.push({
            callableIntent: abstractCommandFactory.register(`${sample} ${item.track.name}`),
            action: () => [...args][1](item.track.album.uri)
          });
          track.push({
            callableIntent: abstractCommandFactory.register(`${sample} ${item.track.name.replace(/ /g, '').toLowerCase()}`),
            action: () => [...args][1](item.track.album.uri)
          });
        });
        return track;
      }, []);
      tracks.push({
        callableIntent: abstractCommandFactory.register('pause'),
        action: () => [...args][2]()
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('stop'),
        action: () => [...args][2]()
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('continue'),
        action: () => [...args][3]()
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('go back'),
        action: () => handleRouter(`/playlists/${[...args][4]}`, [...args][4])
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('call back'),
        action: () => handleRouter(`/playlists/${[...args][4]}`, [...args][4])
      });
      return tracks;
  }
};
