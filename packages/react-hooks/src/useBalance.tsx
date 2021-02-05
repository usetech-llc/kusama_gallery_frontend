// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useCallback, useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

export interface BalanceInterface {
  free: BN;
  feeFrozen: BN;
  miscFrozen: BN;
  reserved: BN;
}

export interface UseBalanceInterface {
  balance: BalanceInterface | undefined;
  balanceError: boolean;
  existentialDeposit: BN;
}

export const useBalance = (accountId: string | null | undefined): UseBalanceInterface => {
  const { api } = useApi();
  const [balance, setBalance] = useState<BalanceInterface>();
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [existentialDeposit, setExistentialDeposit] = useState<BN>(new BN(0));
  const getAccountBalance = useCallback(async () => {
    try {
      if (!accountId || !api) {
        return;
      }

      const accountBalance: { data: BalanceInterface } = await api.query.system.account(accountId);

      setBalance(accountBalance.data);
      setBalanceError(false);
      const existentialDeposit = api.consts.balances.existentialDeposit;

      setExistentialDeposit(existentialDeposit);
      // add transfer fees
      // const transferFees = await api.tx.nft.transfer('0', '0', accountId).paymentInfo(accountId);
      // console.log('transferFees', transferFees);
    } catch (e) {
      console.log('getAccountBalance error', e);
      setBalanceError(true);
    }
  }, [accountId, api]);

  useEffect(() => {
    // eslint-disable-next-line no-void
    void getAccountBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, api]);

  return {
    balance,
    balanceError,
    existentialDeposit
  };
};
