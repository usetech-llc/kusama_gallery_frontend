// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AccountSelector, FormatBalance, ListComponent } from '@polkadot/react-components';
import { useNftGalleryApi, OfferType, useBalance } from '@polkadot/react-hooks';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

function TradeHistory (): React.ReactElement {
  const [account, setAccount] = useState<string>();
  const { getOffers, offers } = useNftGalleryApi();
  const { balance } = useBalance(account);

  // with state 'completed'
  const fetchOffers = useCallback(() => {
    if (account) {
      getOffers(account);
    }
  }, [account, getOffers]);

  const headerRef = useRef([
    ['Price', 'start', 2],
    ['Collection', 'start'],
    ['Token', 'start'],
    ['Buyer', 'start']
  ]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <div className='appreciation-actions'>
      <Header as='h1'>Trade History</Header>
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
        { offers && offers.map((offer: OfferType) => (
          <tr key={`${offer.collectionId}${offer.tokenId}`}>
            <td
              className='start'
              colSpan={2}
            >
              {offer.price}
            </td>
            <td className='overflow'>
              {offer.collectionId}
            </td>
            <td className='overflow'>
              {offer.tokenId}
            </td>
            <td className='overflow'>
              {offer.buyerAddress}
            </td>
          </tr>
        ))}
      </ListComponent>
    </div>
  );
}

export default React.memo(TradeHistory);
