import { Machine } from 'xstate';

const marketplaceStateMachine = Machine({
  id: 'marketplace',
  initial: 'idle',
  states: {
    idle: {
      on: {
        UPDATE_TOKEN_STATE: 'loadingTokenInfo'
      }
    },
    loadingTokenInfo: {
      on: {
        TRANSFER: 'transfer',
        BUY: 'buy',
        CANCEL_OFFER: 'cancelOffer',
        APPRECIATE: 'appreciate',
        ACCEPT_OFFER: 'acceptOffer',
        TOGGLE_DISPLAY: 'toggleDisplay',
        REPORT_ART: 'reportArt',
        ACCEPT_REPORT: 'acceptReport',
        CLEAR_REPORT: 'clearReport',
        REMOVE_ART: 'removeArt',
      }
    },
    appreciate: {
      on: {
        SUBMIT_APPRECIATION_AMOUNT: 'submitAppreciationAmount',
        CANCEL: 'loadingTokenInfo'
      }
    },
    submitAppreciationAmount: {
      on: {
        APPRECIATE_SUCCESS: 'loadingTokenInfo',
        APPRECIATE_FAIL: 'loadingTokenInfo'
      }
    },
    transfer: {
      on: {
        ENTER_RECIPIENT_ADDRESS: 'enterRecipientAddress',
        CANCEL: 'loadingTokenInfo'
      }
    },
    enterRecipientAddress: {
      on: {
        SUBMIT_TRANSFER: 'submitTransfer',
        CANCEL: 'loadingTokenInfo'
      }
    },
    submitTransfer: {
      on: {
        TRANSFER_SUCCESS: 'loadingTokenInfo',
        TRANSFER_FAIL: 'loadingTokenInfo'
      }
    },
    buy: {
      on: {
        SUBMIT_OFFER: 'submitOffer',
        CANCEL: 'loadingTokenInfo'
      }
    },
    submitOffer: {
      on: {
        OFFER_TRANSACTION_SUCCESS: 'loadingTokenInfo',
        OFFER_TRANSACTION_FAIL: 'buy'
      }
    },
    cancelOffer: {
      on: {
        CANCEL_OFFER_SUCCESS: 'loadingTokenInfo',
        CANCEL_OFFER_FAIL: 'loadingTokenInfo'
      }
    },
    acceptOffer: {
      on: {
        ACCEPT_TRANSACTION_SUCCESS: 'loadingTokenInfo',
        ACCEPT_TRANSACTION_FAIL: 'loadingTokenInfo'
      }
    },
    toggleDisplay: {
      on: {
        TOGGLE_DISPLAY_SUCCESS: 'loadingTokenInfo',
        TOGGLE_DISPLAY_FAIL: 'loadingTokenInfo'
      }
    },
    reportArt: {
      on: {
        SELECT_REPORT_REASON: 'selectReportReason',
        CANCEL: 'loadingTokenInfo'
      }
    },
    selectReportReason: {
      on: {
        REPORT_TRANSACTION_SUCCESS: 'loadingTokenInfo',
        CANCEL: 'loadingTokenInfo'
      }
    },
    acceptReport: {
      on: {
        ACCEPT_REPORT_TRANSACTION_SUCCESS: 'loadingTokenInfo',
        ACCEPT_REPORT_TRANSACTION_FAIL: 'loadingTokenInfo'
      }
    },
    clearReport: {
      on: {
        CLEAR_REPORT_TRANSACTION_SUCCESS: 'loadingTokenInfo',
        CLEAR_REPORT_TRANSACTION_FAIL: 'loadingTokenInfo'
      }
    },
    removeArt: {
      on: {
        BURN_TRANSACTION_SUCCESS: 'burnTransactionSuccess',
        BURN_TRANSACTION_FAIL: 'loadingTokenInfo'
      }
    },
    burnTransactionSuccess: {
      on: {
        REVERT_DEPOSIT_SUCCESS: 'loadingTokenInfo',
        REVERT_DEPOSIT_FAIL: 'loadingTokenInfo'
      }
    }
  }
});

export default marketplaceStateMachine;
