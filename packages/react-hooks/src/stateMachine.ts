// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Machine } from 'xstate';

const marketplaceStateMachine = Machine({
  id: 'marketplace',
  initial: 'idle',
  states: {
    acceptOffer: {
      on: {
        ACCEPT_TRANSACTION_FAIL: 'loadingTokenInfo',
        ACCEPT_TRANSACTION_SUCCESS: 'loadingTokenInfo'
      }
    },
    acceptReport: {
      on: {
        ACCEPT_REPORT_TRANSACTION_FAIL: 'loadingTokenInfo',
        ACCEPT_REPORT_TRANSACTION_SUCCESS: 'loadingTokenInfo'
      }
    },
    appreciate: {
      on: {
        CANCEL: 'loadingTokenInfo',
        SUBMIT_APPRECIATION_AMOUNT: 'submitAppreciationAmount'
      }
    },
    burnTransactionSuccess: {
      on: {
        REVERT_DEPOSIT_FAIL: 'loadingTokenInfo',
        REVERT_DEPOSIT_SUCCESS: 'loadingTokenInfo'
      }
    },
    buy: {
      on: {
        CANCEL: 'loadingTokenInfo',
        SUBMIT_OFFER: 'submitOffer'
      }
    },
    cancelOffer: {
      on: {
        CANCEL_OFFER_FAIL: 'loadingTokenInfo',
        CANCEL_OFFER_SUCCESS: 'loadingTokenInfo'
      }
    },
    clearReport: {
      on: {
        CLEAR_REPORT_TRANSACTION_FAIL: 'loadingTokenInfo',
        CLEAR_REPORT_TRANSACTION_SUCCESS: 'loadingTokenInfo'
      }
    },
    enterRecipientAddress: {
      on: {
        CANCEL: 'loadingTokenInfo',
        SUBMIT_TRANSFER: 'submitTransfer'
      }
    },
    idle: {
      on: {
        UPDATE_TOKEN_STATE: 'loadingTokenInfo'
      }
    },
    loadingTokenInfo: {
      on: {
        ACCEPT_OFFER: 'acceptOffer',
        ACCEPT_REPORT: 'acceptReport',
        APPRECIATE: 'appreciate',
        BUY: 'buy',
        CANCEL_OFFER: 'cancelOffer',
        CLEAR_REPORT: 'clearReport',
        REMOVE_ART: 'removeArt',
        REPORT_ART: 'reportArt',
        TOGGLE_DISPLAY: 'toggleDisplay',
        TRANSFER: 'transfer'
      }
    },
    removeArt: {
      on: {
        BURN_TRANSACTION_FAIL: 'loadingTokenInfo',
        BURN_TRANSACTION_SUCCESS: 'burnTransactionSuccess'
      }
    },
    reportArt: {
      on: {
        CANCEL: 'loadingTokenInfo',
        SELECT_REPORT_REASON: 'selectReportReason'
      }
    },
    selectReportReason: {
      on: {
        CANCEL: 'loadingTokenInfo',
        REPORT_TRANSACTION_SUCCESS: 'loadingTokenInfo'
      }
    },
    submitAppreciationAmount: {
      on: {
        APPRECIATE_FAIL: 'loadingTokenInfo',
        APPRECIATE_SUCCESS: 'loadingTokenInfo'
      }
    },
    submitOffer: {
      on: {
        OFFER_TRANSACTION_FAIL: 'buy',
        OFFER_TRANSACTION_SUCCESS: 'loadingTokenInfo'
      }
    },
    submitTransfer: {
      on: {
        TRANSFER_FAIL: 'loadingTokenInfo',
        TRANSFER_SUCCESS: 'loadingTokenInfo'
      }
    },
    toggleDisplay: {
      on: {
        TOGGLE_DISPLAY_FAIL: 'loadingTokenInfo',
        TOGGLE_DISPLAY_SUCCESS: 'loadingTokenInfo'
      }
    },
    transfer: {
      on: {
        CANCEL: 'loadingTokenInfo',
        ENTER_RECIPIENT_ADDRESS: 'enterRecipientAddress'
      }
    }
  }
});

export default marketplaceStateMachine;
