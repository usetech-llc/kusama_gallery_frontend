// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { AppProps as Props } from '@polkadot/react-components/types';
import basicMd from './md/basic.md';

import CreatedNfts from './containers/CreatedNfts';
import OwnedNfts from './containers/OwnedNfts';
import TradeHistory from './containers/TradeHistory';
import AppreciationActions from './containers/AppreciationActions';

function App ({ basePath }: Props): React.ReactElement<Props> {

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'owned',
      text: 'Owned NFTs'
    },
    {
      name: 'created',
      text: 'Created NFTs'
    },
    {
      name: 'trade-history',
      text: 'Trade History'
    },
    {
      name: 'appreciation-actions',
      text: 'Actions of appreciation'
    }
  ]);

  return (
    <main className='nft--App'>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          items={tabsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/created`}>
          <CreatedNfts />
        </Route>
        <Route path={`${basePath}/trade-history`}>
          <TradeHistory />
        </Route>
        <Route path={`${basePath}/appreciation-actions`}>
          <AppreciationActions />
        </Route>
        <Route>
          <OwnedNfts />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(App);
