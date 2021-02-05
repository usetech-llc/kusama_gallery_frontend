// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import '../styles.scss';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Link, Route, Switch } from 'react-router-dom';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';

import { LabelHelp, NftDetailsModal, NftTokenCard } from '@polkadot/react-components';
import { useBalance, useNftCollection } from '@polkadot/react-hooks';

import AccountSelector from '../../components/AccountSelector';
import FormatBalance from '../../components/FormatBalance';

function OwnedNfts (): React.ReactElement {
  const [account, setAccount] = useState<string | null>(null);
  const { ownCollection, ownNftList } = useNftCollection(account);
  const history = useHistory();
  const { balance } = useBalance(account);
  const currentAccount = useRef<string | null | undefined>();

  const openDetailedInformationModal = useCallback((collectionId: string, tokenId: string) => {
    history.push(`/wallet/token-details?collectionId=${collectionId}&tokenId=${tokenId}`);
  }, [history]);

  useEffect(() => {
    currentAccount.current = account;
  }, [account]);

  console.log('balance.free', balance);

  /*
  Created NFTs
  Owned NFTs
  Personal trade history (sold or purchased pieces)
  Actions of appreciation (given or received)
   */

  return (
    <div className='nft-wallet'>
      <Header as='h1'>Own NFTs</Header>
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
      <Header as='h2'>
        My collections
        <LabelHelp
          className='small-help'
          help={'Your tokens are here'}
        />
      </Header>
      { !ownCollection && (
        <div className='no-collections'>No collections found. <Link to='nftCreator'>Create collection</Link></div>
      )}
      { ownCollection && (
        <Grid.Row>
          <Grid.Column width={14}>
            <div className='gallery-pallet'>
              <h2>Collection # {ownCollection}</h2>
              <div className='nft-tokens'>
                { account && ownCollection && ownNftList && ownNftList.map((token) => (
                  <NftTokenCard
                    account={account}
                    collectionId={ownCollection}
                    key={token.tokenId}
                    openDetailedInformationModal={openDetailedInformationModal}
                    token={token}
                  />
                )) }
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      )}
      { account && ownCollection && (
        <Switch>
          <Route
            key='TokenDetailsModal'
            path='*/token-details'
          >
            <NftDetailsModal account={account} />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default React.memo(OwnedNfts);
