// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './styles.scss';

// external imports
import React, { memo, ReactElement, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';

import { AccountSelector, FormatBalance, NftDetailsModal, NftTokenCard } from '@polkadot/react-components';
import { useBalance, useNftGalleryApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

const NftGallery = (): ReactElement => {
  const history = useHistory();
  const [account, setAccount] = useState<string | null>(null);
  const { getNftList, nftList } = useNftGalleryApi(account ? keyring.getAccount(account) : undefined);
  const { balance } = useBalance(account);

  const openDetailedInformationModal = useCallback((collectionId: string, tokenId: string) => {
    history.push(`/gallery/token-details?collectionId=${collectionId}&tokenId=${tokenId}`);
  }, [history]);

  const fetchNft = useCallback(() => {
    getNftList();
  }, [getNftList]);

  useEffect(() => {
    fetchNft();
  }, [fetchNft]);

  return (
    <div className='nft-gallery'>
      <Header as='h2'>Nft Tokens</Header>
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
        <Grid.Row>
          <Grid.Column width={16}>
            <div className='gallery-pallet'>
              <div className='nft-tokens'>
                { account && nftList && nftList.map((token) => (
                  <NftTokenCard
                    account={account}
                    collectionId={token.collectionId}
                    key={token.tokenId}
                    openDetailedInformationModal={openDetailedInformationModal}
                    token={token}
                  />
                )) }
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      { account && (
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
};

export default memo(NftGallery);
