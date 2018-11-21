import App, {Container} from 'next/app';
import React from 'react';
import { Provider, useStaticRendering } from 'mobx-react';

import * as Store from '../store';

const isServer: boolean = typeof window === 'undefined';
useStaticRendering(isServer);

const initStore = {
  lang: Store.Language.english,
  intLabels: [
    'german',
    'english',
    'spanish',
    'japanese'
  ]
}

export default class MyApp extends App  {
  private mobxStore;

  public static async getInitialProps(app) {

    const mobxStore = Store.initializeStore(initStore);
    app.ctx.mobxStore = mobxStore;
    let props = await App.getInitialProps(app)
    return {
      ...props,
      initialMobxState: mobxStore
    };
  }

  public constructor(props) {
    super(props);
    this.mobxStore = Store.initializeStore(props.initialMobxState);
  }

  public render(): JSX.Element {
    const { Component, pageProps } = this.props
    return (
        <Container>
            <Provider store={this.mobxStore}>
                <Component {...pageProps} />
            </Provider>
        </Container>
    );
}
}
