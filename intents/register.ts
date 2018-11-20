import { abstractCommandFactory } from '../speech/commands';
import { handleRouter } from '../utils/handle-router';
import { Intent, IntentProps} from './intents';

export function registerIntent(intent: IntentProps, ...args) {
  switch(intent.type) {
    case Intent.lang:
        const [setLang] = [...args];
        return intent.samples
          .map(sample => ({
            callableIntent: abstractCommandFactory.register(sample),
            action: () => intent.action(setLang)
          }))
          .forEach(intent => {
            // @ts-ignore: Block-scoped variable is used before declaration
            intent.callableIntent.unregister(registeredCallback);
            const registeredCallback = intent.callableIntent.register(intent.action);
          });
    case Intent.navigate:
      const [id] = [...args];
      return intent.samples
        .map(sample => ({
          callableIntent: abstractCommandFactory.register(sample),
          action: () => intent.action(id)
        }))
        .forEach(intent => {
          // @ts-ignore: Block-scoped variable is used before declaration
          intent.callableIntent.unregister(registeredCallback);
          const registeredCallback = intent.callableIntent.register(intent.action);
        });
    case Intent.playlists:
      const [playlists] = [...args];
      return playlists.reduce((playlist, item) => {
        intent.samples.forEach(sample => {
          playlist.push({
            callableIntent: abstractCommandFactory.register(`${sample} ${item.name}`),
            action: () => intent.action(item.id)
          });
        });
        playlist.push({
          callableIntent: abstractCommandFactory.register('home'),
          action: () => handleRouter(`/`)
        });
        playlist.push({
          callableIntent: abstractCommandFactory.register('go home'),
          action: () => handleRouter(`/`)
        });
        playlist.forEach(intent => {
          // @ts-ignore: Block-scoped variable is used before declaration
          intent.callableIntent.unregister(registeredCallback);
          const registeredCallback = intent.callableIntent.register(intent.action);
        });
        return playlist;
      }, []);
    case Intent.tracks:
      /**
       * @param [...args][0] contains a list of tracks
       * @param [...args][1] contains a function to play track
       * @param [...args][2] contains a function to pause track
       * @param [...args][3] contains a function to resume track
       * @param [...args][4] contains a prop with the playlist id
       */
      const [spotifyTracks, play, pause, resume, playlistId] = [...args];
      const tracks = spotifyTracks.reduce((track, item) => {
        intent.samples.forEach(sample => {
          track.push({
            callableIntent: abstractCommandFactory.register(`${sample} ${item.track.name}`),
            action: () => play(item.track.album.uri)
          });
          track.push({
            callableIntent: abstractCommandFactory.register(`${sample} ${item.track.name.replace(/ /g, '').toLowerCase()}`),
            action: () => play(item.track.album.uri)
          })
        });
        return track;
      }, []);
      tracks.push({
        callableIntent: abstractCommandFactory.register('pause'),
        action: () => pause()
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('stop'),
        action: () => pause()
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('continue'),
        action: () => resume()
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('go back'),
        action: () => handleRouter(`/playlists/${playlistId}`, playlistId)
      });
      tracks.push({
        callableIntent: abstractCommandFactory.register('call back'),
        action: () => handleRouter(`/playlists/${playlistId}`, playlistId)
      });
      tracks.forEach(intent => {
        // @ts-ignore: Block-scoped variable is used before declaration
        intent.callableIntent.unregister(registeredCallback);
        const registeredCallback = intent.callableIntent.register(intent.action);
      });
      return tracks;
    case Intent.overlay:
      const [setState] = [...args];
      return intent.samples
        .map(sample => ({
          callableIntent: abstractCommandFactory.register(sample),
          action: () => intent.action(setState)
        }))
        .forEach(intent => {
          // @ts-ignore: Block-scoped variable is used before declaration
          intent.callableIntent.unregister(registeredCallback);
          const registeredCallback = intent.callableIntent.register(intent.action);
        });
  }
};
