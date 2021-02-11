// Copyright 2020 @polkadot/app-nft authors & contributors

import { useCallback, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { useApi, useNftGalleryApi, TokenDetailsType } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import galleryStateMachine from './stateMachine';

type UserActionType =
  'SUBMIT_APPRECIATION_AMOUNT'
  | 'APPRECIATE_SUCCESS'
  | 'APPRECIATE_FAIL'
  | 'BUY'
  | 'CANCEL'
  | 'CANCEL_OFFER'
  | 'APPRECIATE'
  | 'ACCEPT_OFFER'
  | 'TOGGLE_DISPLAY'
  | 'REPORT_ART'
  | 'ACCEPT_REPORT'
  | 'CLEAR_REPORT'
  | 'REMOVE_ART'
  | 'ENTER_RECIPIENT_ADDRESS'
  | 'TRANSFER'
  | 'SUBMIT_TRANSFER'
  | 'TRANSFER_SUCCESS'
  | 'TRANSFER_FAIL'
  | 'SUBMIT_OFFER'
  | 'OFFER_TRANSACTION_SUCCESS'
  | 'OFFER_TRANSACTION_FAIL'
  | 'CANCEL_OFFER_SUCCESS'
  | 'CANCEL_OFFER_FAIL';

interface GalleryStagesInterface {
  sendCurrentUserAction: (action: UserActionType) => void;
  showCancelOfferButton: boolean;
  state: { matches: (val: string) => boolean };
  tokenDetails: TokenDetailsType | undefined;
}

export const useGalleryStages = (account: string, collectionId: string, tokenId: string): GalleryStagesInterface => {
  const { api } = useApi();
  const [state, send] = useMachine(galleryStateMachine);
  const { getTokenDetails, getOwnAppreciations, getOffers, offers, ownAppreciations, tokenDetails } = useNftGalleryApi(account ? keyring.getAccount(account) : undefined);
  // if we have offer for this token to cancel
  const [showCancelOfferButton, setShowCancelOfferButton] = useState<boolean>(false);

  const sendCurrentUserAction = useCallback((userAction: UserActionType) => {
    send(userAction);
  }, [send]);

  const loadInitialInfo = useCallback(() => {
    try {
      getTokenDetails(collectionId, tokenId);
      getOffers(account);
      getOwnAppreciations(account);
    } catch (e) {
      console.error('token balance calculation error', e);
    }
  }, [account, collectionId, getTokenDetails, getOffers, getOwnAppreciations, tokenId]);

  const buy = useCallback(() => {
    send('ENTER_OFFER_PRICE');
    // Transaction #2: Invoke ask method on market contract to set the price
    //     await this.askAsync(punkId, priceBN.toString(), ownerAddress);
    /* queueExtrinsic({
        accountId: account && account.toString(),
          extrinsic: api.tx.contracts
          .call(config.marketContractAddress, config.value, config.maxgas, abi.messages.ask(collectionId, tokenId, 2, tokenPriceForSale)),
          isUnsigned: false,
          txFailedCb: () => send('REGISTER_SALE_FAIL'),
          txStartCb: () => console.log('registerSale start'),
          txSuccessCb: () => send('REGISTER_SALE_SUCCESS'),
          txUpdateCb: () => console.log('registerSale update')
      }); */
  }, [account, api, collectionId, tokenId]);

  useEffect(() => {
    switch (true) {
      // on load - update token state
      case state.matches('loadingTokenInfo'):
        // eslint-disable-next-line no-void
        void loadInitialInfo();
        break;
      case state.matches('buy'):
        buy();
        break;
      case state.matches('transfer'):
        send('ENTER_RECIPIENT_ADDRESS');
        break;
      default:
        break;
    }
  }, [buy, send, state, loadInitialInfo]);

  useEffect(() => {
    send('UPDATE_TOKEN_STATE');
  }, [send]);

  console.log('state.value', state.value);

  return {
    sendCurrentUserAction,
    showCancelOfferButton,
    state,
    tokenDetails
  };
};
