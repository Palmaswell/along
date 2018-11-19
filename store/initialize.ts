import Store from './store';
import LangStore from './language';

let stores = null;
const isServer: boolean = typeof window === 'undefined';

export const initializeStore =  (init) => {
  if (isServer) {
    return {
      store: new Store(init, isServer),
      langStore: new LangStore(init, isServer)
    }
  }
  if (stores === null) {
    stores = {
      store: new Store(init, isServer),
      langStore: new LangStore(init, isServer)
    }
  }
  return stores
};

export default initializeStore;
