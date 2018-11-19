import { action, observable } from 'mobx';

export interface StoreProps {
  lastUpdate: number;
  light: boolean;
}

export class Store {
  @observable lastUpdate = 0;
  @observable light = false;

  constructor (init: StoreProps, _isServer: boolean) {
    this.lastUpdate = init.lastUpdate != null
    ? init.lastUpdate
    : Date.now();
    this.light = !!init.light;
  }

  @action start = () => {
    setInterval(() => {
      this.lastUpdate = Date.now();
      this.light = true;
    }, 1000)
  }
}

export default Store;



