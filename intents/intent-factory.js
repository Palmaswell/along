import { abstractCommandFactory } from '../providers/speech/speech-commands';

export function IntentFactory({ type, samples, action }) {
  return {
    type,
    samples,
    action
  }
};

export function createIntents(intent, ...args) {
  switch(intent.type) {
    case 'NavigateIntent':
      /**
       * @param [...args][0] the spotify playlist url id
       */
      return intent.samples.map(sample => ({
        callableIntent: abstractCommandFactory.register(sample),
        action: props => intent.action([...args][0])
      }));
    case 'PlaylistsIntent':
      /**
       * @param [...args][0] contains a list of playlists
       */
      return [...args][0].reduce((playlist, item) => {
        intent.samples.forEach(sample => {
          playlist.push({
            callableIntent: abstractCommandFactory.register(`${sample} ${item.name}`),
            action: props => intent.action(item.id)
          })
        });
        return playlist;
      }, []);
    case 'HomeIntent':
      console.log('show me something')
      return intent.samples.map(sample => ({
        callableIntent: abstractCommandFactory.register(sample),
        action: props => intent.action()
      }));
  }
};
