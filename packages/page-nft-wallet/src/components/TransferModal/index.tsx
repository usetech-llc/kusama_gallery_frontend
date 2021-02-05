// Copyright 2020 UseTech authors & contributors

import React, { useState, useCallback, useEffect } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import { Button, Input } from '@polkadot/react-components';
import { TxButton } from '@polkadot/react-components';
import { NftCollectionInterface, useBalance } from '@polkadot/react-hooks';

import './transferModal.scss';

interface Props {
  account: string | null;
  balance: number;
  canTransferTokens: boolean;
  collection: NftCollectionInterface;
  closeModal: () => void;
  tokenId: string;
  updateTokens: (collectionId: number) => void;
}

function TransferModal({ account, balance, canTransferTokens, collection, closeModal, tokenId, updateTokens }: Props): React.ReactElement<Props> {
  const [recipient, setRecipient] = useState<string | null>(null);
  const [tokenPart, setTokenPart] = useState<number>(0);
  const [isAddressError, setIsAddressError] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const balanceInfo = useBalance(recipient);

  const setRecipientAddress = useCallback((value) => {
    // setRecipient
    if (!value) {
      setIsAddressError(true);
    }
    if(value.length !== '5D73wtH5pqN99auP4b6KQRQAbketaSj4StkBJxACPBUAUdiq'.length) {
      setIsAddressError(true);
    }
    setRecipient(value);
  }, [setIsAddressError, setRecipient]);

  const setTokenPartToTransfer = useCallback((value) => {
    const numberValue = parseFloat(value);
    if (!numberValue) {
      console.log('token part error');
    }
    if (numberValue > balance || numberValue > 1 || numberValue < (1 / Math.pow(10, collection.decimalPoints))) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setTokenPart(parseFloat(value));
  }, []);

  useEffect(() => {
    const { balanceError } = balanceInfo;
    setIsAddressError(balanceError);
  }, [balanceInfo]);

  // @todo address validation
  return (
    <Modal size='tiny' open onClose={closeModal}>
      <Modal.Header>
        <h2>Transfer NFT Token</h2>
      </Modal.Header>
      <Modal.Content image>
        <Form className='transfer-form'>
          <Form.Field>
            <Input
              className='label-small'
              isError={isAddressError}
              label='Please enter an address you want to transfer'
              onChange={setRecipientAddress}
              placeholder='Recipient address'
            />
          </Form.Field>
          { collection.isReFungible && (
            <Form.Field>
              <Input
                className='label-small'
                min={1 / (collection.decimalPoints * 10)}
                isError={isError}
                label={`Please enter part of token you want to transfer, your token balance is: ${balance}`}
                onChange={setTokenPartToTransfer}
                placeholder='Part of re-fungible address'
                type='number'
              />
            </Form.Field>
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='times'
          label='Cancel'
          onClick={closeModal}
        />
        {/* if tokenPart === 0 - it will transfer all parts of token */}
        <TxButton
          accountId={account}
          isDisabled={!canTransferTokens || !recipient || isError}
          label='Submit'
          onStart={closeModal}
          onSuccess={updateTokens.bind(null, collection.id)}
          params={[recipient, collection.id, tokenId, (tokenPart * Math.pow(10, collection.decimalPoints))]}
          tx='nft.transfer'
        />
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(TransferModal);
