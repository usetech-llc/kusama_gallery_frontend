// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import Tabs from '@polkadot/react-components/Tabs';
import NftGallery from './containers/NftGallery';
import './styles.scss';

function App ({ basePath }: Props): React.ReactElement<Props> {

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'nftGallery',
      text: 'Gallery'
    }
  ], []);

  return (
    <main className='nft--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={basePath}>
          <NftGallery />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(App);
