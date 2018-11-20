import Store from './store';

let stores = null;
const isServer: boolean = typeof window === 'undefined';


export const initializeStore =  (init) => {
  if (isServer) {
    return new Store(init, isServer);
  }
  if (stores === null) {
    stores = new Store(init, isServer);
  }
  return stores
};

export default initializeStore;
