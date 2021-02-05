// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef, useCallback, useEffect } from 'react';
import moment from 'moment';
import { AccountSelector, FormatBalance, ListComponent } from '@polkadot/react-components';
import { useNftGalleryApi, AppreciationType, useBalance } from '@polkadot/react-hooks';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

interface Props {
  className?: string;
}

function AppreciationActions (props: Props): React.ReactElement<Props> {
  const [account, setAccount] = useState<string>();
  const { getOwnAppreciations, ownAppreciations } = useNftGalleryApi();
  const { balance } = useBalance(account);

  // with state 'completed'
  const fetchAppreciations = useCallback(() => {
    if (account) {
      getOwnAppreciations(account);
    }
  }, [account, getOwnAppreciations]);

  const headerRef = useRef([
    ['Amount', 'start', 2],
    ['Collection', 'start'],
    ['Token', 'start'],
    ['Created Date', 'start'],
    ['Appreciator', 'start']
  ]);

  useEffect(() => {
    fetchAppreciations();
  }, [fetchAppreciations]);

  return (
    <div className='appreciation-actions'>
      <Header as='h1'>Appreciations</Header>
      <Header as='h2'>Account</Header>
      <Grid className='account-selector'>
        <Grid.Row>
          <Grid.Column width={12}>
            <AccountSelector onChange={setAccount} />
          </Grid.Column>
          <Grid.Column width={4}>
            { balance && (
              <div className='balance-block'>
                <label>Your account balance is:</label>
                <FormatBalance
                  className='balance'
                  value={balance.free}
                />
              </div>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <br />
      <ListComponent
        empty={'No trades found'}
        header={headerRef.current}
      >
        { ownAppreciations && ownAppreciations.map((offer: AppreciationType) => (
          <tr key={`${offer.collectionId}${offer.tokenId}`}>
            <td
              className='start'
              colSpan={2}
            >
              {offer.amount}
            </td>
            <td className='overflow'>
              {offer.collectionId}
            </td>
            <td className='overflow'>
              {offer.tokenId}
            </td>
            <td className='overflow'>
              {moment(offer.createdDate).format('DD MMMM YYYY')}
            </td>
            <td className='overflow'>
              {offer.appreciator}
            </td>
          </tr>
        ))}
      </ListComponent>
    </div>
  );
}

export default React.memo(AppreciationActions);
