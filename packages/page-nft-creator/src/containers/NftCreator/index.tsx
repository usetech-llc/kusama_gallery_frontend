// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import { AccountSelector, Button, Input, FormatBalance } from '@polkadot/react-components';
import { useBalance } from '@polkadot/react-hooks/useBalance';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

// local imports and components
import useMintApi from '../../hooks/useMintApi';
import './styles.scss';

interface MintTokensProps {
  className?: string;
}

function NftCreator ({ className }: MintTokensProps): React.ReactElement<MintTokensProps> {
  const [imageIpfsPin, setImageIpfsPin] = useState<string | undefined>();
  const [account, setAccount] = useState<string | null>(null);
  const { minting, mintToken, ownCollection, tokenMintDeposit } = useMintApi(account);
  const { balance } = useBalance(account);

  console.log('balance', balance);

  const onChangeString = useCallback((value) => {
    setImageIpfsPin(value);
  }, []);

  const onSaveToken = useCallback(() => {
    if (imageIpfsPin && ownCollection && account) {
      // User uploads the file to IPFS, e.g. using https://globalupload.io/
      // uploadImage(newToken);
      // User initiates NFT creation in “NFT Creator”
      // User specifies the IPFS file pin for the uploaded NFT image
      // Checks KSM balance for the user and, if it is sufficient to pay the Art Display deposit, proceeds
      // api.query.artGalleryPallet.mintDeposit - get deposit
      void mintToken(imageIpfsPin);
    }
  }, [imageIpfsPin]);

  const isBalanceEnough = (tokenMintDeposit && balance && balance.free && balance.free.lt(tokenMintDeposit));

  return (
    <main className='nft-creator'>
      <Header as='h1'>Nft Creator</Header>
      <Form className='collection-search'>
        <Grid className='mint-grid'>
          <Grid.Row>
            <Grid.Column width={12}>
              <AccountSelector onChange={setAccount} />
            </Grid.Column>
            <Grid.Column width={4}>
              { balance && (
                <div className='balance-block'>
                  <label>Your account balance is:</label>
                  <FormatBalance value={balance.free} className='balance' />
                </div>
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Field>
                <Input
                  className='explorer--query input-search'
                  label={<span>Enter your token ipfs pin</span>}
                  onChange={onChangeString}
                  // value={searchString}
                  placeholder='Token IPFS pin'
                  withLabel
                />
              </Form.Field>
              { isBalanceEnough && imageIpfsPin && (
                <Button
                  icon='check'
                  label='Save'
                  onClick={onSaveToken}
                />
              )}
              { isBalanceEnough && (
                <span>Your balance is too low to mint token</span>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        { minting && (
          <div className='dimmer-loader'>
            <Loader
              active
              inline='centered'
            >
              Minting NFT...
            </Loader>
          </div>
        )}
      </Form>
    </main>
  );
}

export default React.memo(NftCreator);
