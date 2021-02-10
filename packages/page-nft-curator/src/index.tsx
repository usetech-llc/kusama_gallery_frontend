// Copyright 2020 UseTech authors & contributors

// global app props and types
import './styles.scss';

// external imports
import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { AppProps as Props } from '@polkadot/react-components/types';
import basicMd from './md/basic.md';

import TradeHistory from './containers/TradeHistory';
import PendingReports from './containers/PendingReports';
import ReportedArt from './containers/ReportedArt';

function App ({ basePath, className }: Props): React.ReactElement<Props> {

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'pending-reports',
      text: 'Pending Reports'
    },
    {
      name: 'reported-art',
      text: 'Reported Art'
    },
    {
      name: 'trade-history',
      text: 'Trade History'
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
        <Route path={`${basePath}/reported-art`}>
          <ReportedArt />
        </Route>
        <Route path={`${basePath}/trade-history`}>
          <TradeHistory />
        </Route>
        <Route path={basePath}>
          <PendingReports />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(App);
