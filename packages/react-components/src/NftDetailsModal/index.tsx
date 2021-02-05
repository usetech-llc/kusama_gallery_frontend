// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import './styles.scss';

import BN from 'bn.js';
import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import { Button, Input, InputBalance, TxButton } from '@polkadot/react-components';
import { useBalance, useGalleryStages } from '@polkadot/react-hooks';
import { useApi } from '@polkadot/react-hooks/useApi';

interface Props {
  account: string;
}

function NftDetailsModal ({ account }: Props): React.ReactElement<Props> {
  const query = new URLSearchParams(useLocation().search);
  const { api } = useApi();
  const tokenId = query.get('tokenId') || '0';
  const collectionId = query.get('collectionId') || '';
  const [recipient, setRecipient] = useState<string>();
  const [isAddressError, setIsAddressError] = useState<boolean>(true);
  const [tokenOfferPrice, setTokenOfferPrice] = useState<BN>();
  const [appreciatePrice, setAppreciatePrice] = useState<BN>();
  const { sendCurrentUserAction,
    showCancelOfferButton,
    state,
    tokenDetails } = useGalleryStages(account, collectionId, tokenId);
  const { balance } = useBalance(account);
  const appreciationLimit = api.consts.artGalleryPallet?.appreciationLimit || new BN(1000);

  console.log('appreciationLimit', appreciationLimit);

  const showRecipientAddress = useMemo(() => {
    return state.matches('enterRecipientAddress') || state.matches('submitTransfer');
  }, [state]);

  const showOfferPrice = useMemo(() => {
    return state.matches('buy') || state.matches('enterOfferPrice');
  }, [state]);

  const showAppreciatePrice = useMemo(() => {
    return state.matches('appreciate') || state.matches('submitAppreciationAmount');
  }, [state]);

  const uOwnIt = tokenDetails && tokenDetails.owner_address && tokenDetails.owner_address.toString() === account;
  const yourOffer = showCancelOfferButton;
  const youAreCurator = true;
  const tokenHasReport = true;

  const closeModal = useCallback(() => {
    history.back();
  }, []);

  const setRecipientAddress = useCallback((value: string) => {
    // setRecipient
    if (!value) {
      setIsAddressError(true);
    } else if (value.length !== 'F2ayNEiGWQdi1Vi2J8yXLToSJTSGnsokH4uSxHJjmbwtTZ4'.length) {
      setIsAddressError(true);
    }

    setIsAddressError(false);
    setRecipient(value);
  }, [setIsAddressError, setRecipient]);

  const onBuy = useCallback(() => {
    sendCurrentUserAction('BUY');
  }, [sendCurrentUserAction]);

  const onAppreciate = useCallback(() => {
    sendCurrentUserAction('APPRECIATE');
  }, [sendCurrentUserAction]);

  const onAcceptOffer = useCallback(() => {
    sendCurrentUserAction('ACCEPT_OFFER');
  }, [sendCurrentUserAction]);

  const onToggleDisplay = useCallback(() => {
    sendCurrentUserAction('TOGGLE_DISPLAY');
  }, [sendCurrentUserAction]);

  const onReportArt = useCallback(() => {
    sendCurrentUserAction('REPORT_ART');
  }, [sendCurrentUserAction]);

  const onAcceptReport = useCallback(() => {
    sendCurrentUserAction('ACCEPT_REPORT');
  }, [sendCurrentUserAction]);

  const onClearReport = useCallback(() => {
    sendCurrentUserAction('CLEAR_REPORT');
  }, [sendCurrentUserAction]);

  const onRemoveArt = useCallback(() => {
    sendCurrentUserAction('REMOVE_ART');
  }, [sendCurrentUserAction]);

  const onTransfer = useCallback(() => {
    sendCurrentUserAction('TRANSFER');
  }, [sendCurrentUserAction]);

  const onCancel = useCallback(() => {
    sendCurrentUserAction('CANCEL');
  }, [sendCurrentUserAction]);

  return (
    <Modal className='nft-details'
      onClose={closeModal}
      open
      size='small'>
      <Modal.Header>NFT Token Details</Modal.Header>
      <Modal.Content>
        { tokenDetails && (
          <div className='token-image'>
            <img src={tokenDetails.metadata} />
          </div>
        )}
        <div className='token-info'>
          <Header as='h3'>{collectionId} #{tokenId}</Header>
          { uOwnIt && (
            <p><strong>You own it!</strong> (address: {account})</p>
          )}
          { !!(!uOwnIt && tokenDetails && tokenDetails.owner_address) && (
            <p><strong>The owner is </strong>{tokenDetails.owner_address.toString()}</p>
          )}
          { state.matches('loadingTokenInfo') && (
            <Button.Group>
              { !uOwnIt && (
                <>
                  <Button
                    icon='shopping-cart'
                    label='Buy it'
                    onClick={onBuy}
                  />
                  { yourOffer && (
                    <TxButton
                      accountId={account}
                      label='Cancel offer'
                      onFailed={sendCurrentUserAction.bind(null, 'CANCEL_OFFER_FAIL')}
                      onStart={sendCurrentUserAction.bind(null, 'CANCEL_OFFER')}
                      onSuccess={sendCurrentUserAction.bind(null, 'CANCEL_OFFER_SUCCESS')}
                      params={[collectionId, tokenId]}
                      tx={api.tx?.artGalleryPallet?.cancelOffer}
                    />
                  )}
                </>
              )}
              { uOwnIt && (
                <>
                  <Button
                    icon='search-dollar'
                    label='Appreciate'
                    onClick={onAppreciate}
                  />
                  <Button
                    icon='check'
                    label='Accept offer'
                    onClick={onAcceptOffer}
                  />
                  <Button
                    icon='toggle-on'
                    label='Toggle display'
                    onClick={onToggleDisplay}
                  />
                  <Button
                    icon='exchange-alt'
                    label='Transfer'
                    onClick={onTransfer}
                  />
                </>
              )}
              { (uOwnIt || youAreCurator) && (
                <Button
                  icon='trash-alt'
                  label='Remove art'
                  onClick={onRemoveArt}
                />
              )}
              { (youAreCurator && tokenHasReport) && (
                <>
                  <Button
                    icon='user-check'
                    label='Accept report'
                    onClick={onAcceptReport}
                  />
                  <Button
                    icon='broom'
                    label='Clear report'
                    onClick={onClearReport}
                  />
                </>
              )}
              <Button
                icon='file'
                label='Report art'
                onClick={onReportArt}
              />
            </Button.Group>
          )}
          { showOfferPrice && (
            <Form className='transfer-form'>
              <Form.Field>
                <InputBalance
                  className='small'
                  defaultValue={new BN(0)}
                  isFull
                  isZeroable
                  maxValue={balance?.free || new BN(0)}
                  onChange={setTokenOfferPrice}
                  withMax
                />
              </Form.Field>
              <Form.Field>
                <TxButton
                  accountId={account}
                  isDisabled={!tokenOfferPrice || tokenOfferPrice.lte(new BN(0))}
                  label='Create offer'
                  onFailed={sendCurrentUserAction.bind(null, 'OFFER_TRANSACTION_FAIL')}
                  onStart={sendCurrentUserAction.bind(null, 'SUBMIT_OFFER')}
                  onSuccess={sendCurrentUserAction.bind(null, 'OFFER_TRANSACTION_SUCCESS')}
                  params={[collectionId, tokenId, tokenOfferPrice]}
                  tx={api.tx?.artGalleryPallet?.createOffer}
                />
              </Form.Field>
            </Form>
          )}
          { showAppreciatePrice && (
            <Form className='transfer-form'>
              <Form.Field>
                <InputBalance
                  className='small'
                  defaultValue={new BN(0)}
                  isFull
                  isZeroable
                  maxValue={balance?.free || new BN(0)}
                  onChange={setAppreciatePrice}
                  withMax
                />
              </Form.Field>
              <Form.Field>
                <TxButton
                  accountId={account}
                  isDisabled={!appreciatePrice || appreciatePrice.lte(new BN(0))}
                  label='Appreciate'
                  onFailed={sendCurrentUserAction.bind(null, 'APPRECIATE_FAIL')}
                  onStart={sendCurrentUserAction.bind(null, 'SUBMIT_APPRECIATION_AMOUNT')}
                  onSuccess={sendCurrentUserAction.bind(null, 'APPRECIATE_SUCCESS')}
                  params={[collectionId, tokenId, appreciatePrice]}
                  tx={api.tx?.artGalleryPallet?.appreciate}
                />
              </Form.Field>
            </Form>
          )}
          <Form className='transfer-form'>
            { showRecipientAddress && (
              <Form.Field>
                <Input
                  className='label-small'
                  isError={isAddressError}
                  label='Please enter an address you want to transfer'
                  onChange={setRecipientAddress}
                  placeholder='Recipient address'
                />
              </Form.Field>
            )}
            { showRecipientAddress && (
              <Form.Field>
                <TxButton
                  accountId={account}
                  isDisabled={isAddressError}
                  label='Submit'
                  onFailed={sendCurrentUserAction.bind(null, 'TRANSFER_FAIL')}
                  onStart={sendCurrentUserAction.bind(null, 'SUBMIT_TRANSFER')}
                  onSuccess={sendCurrentUserAction.bind(null, 'TRANSFER_SUCCESS')}
                  params={[recipient, collectionId, tokenId]}
                  tx={api.tx?.artGalleryPallet?.transfer}
                />
              </Form.Field>
            )}
            { !state.matches('loadingTokenInfo') && (
              <Form.Field>
                <Button
                  icon='window-close'
                  label='Cancel'
                  onClick={onCancel}
                />
              </Form.Field>
            )}
          </Form>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='window-close'
          label='Close'
          onClick={closeModal}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(NftDetailsModal);
