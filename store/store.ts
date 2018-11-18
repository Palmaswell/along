import { action, observable } from 'mobx';

export interface StoreProps {
  lastUpdate: number;
  light: boolean;
}

export class Store {
  @observable lastUpdate = 0;
  @observable light = false;

  constructor (_isServer: boolean, initialData: StoreProps) {
    this.lastUpdate = initialData.lastUpdate != null
    ? initialData.lastUpdate
    : Date.now();
    this.light = !!initialData.light;
  }

  @action start = () => {
    setInterval(() => {
      this.lastUpdate = Date.now();
      this.light = true;
    }, 1000)
  }
}

export default Store;

let store = null;
const isServer: boolean = typeof window === 'undefined';

export function initializeStore (initialData) {
  if (isServer) {
    return new Store(isServer, initialData)
  }
  if (store === null) {
    store = new Store(isServer, initialData)
  }
  return store
}

