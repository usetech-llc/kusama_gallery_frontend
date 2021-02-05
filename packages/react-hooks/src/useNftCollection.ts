// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useCallback } from 'react';
import { useNftGalleryApi, TokenDetailsType } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

export interface UseNftCollectionInterface {
  ownCollection: string | undefined;
  ownNftList: TokenDetailsType[] | undefined;
}

/**
 * Get validators from server if health "connected":true
 * @return {Array<ValidatorInfo>} filtered validators from server
 */
export const useNftCollection = (account: string | null): UseNftCollectionInterface => {
  const [ownCollection, setOwnCollection] = useState<string>();
  const { createCollection, getOwnCollection, getOwnNftList, ownCollections, ownNftList } = useNftGalleryApi(account ? keyring.getAccount(account) : undefined);

  const fetchCollections = useCallback(() => {
    if (account) {
      getOwnCollection(account);
    }
  }, [account, getOwnCollection]);

  const fetchTokens = useCallback(() => {
    console.log('fetchTokens');

    if (account) {
      getOwnNftList(account);
    }
  }, [account, getOwnNftList]);

  // create own collection, fetch it and tokens
  const createOwnCollection = useCallback(async () => {
    await createCollection();
    fetchCollections();
  }, [createCollection, fetchCollections]);

  const findOrCreateCollection = useCallback(async () => {
    if (account) {
      const storedCollections: string[] = JSON.parse(localStorage.getItem('ownCollections') || '[]') as string[];

      if (storedCollections && storedCollections.length) {
        setOwnCollection(storedCollections[0]);
        void fetchTokens();
      } else {
        await createOwnCollection();
        fetchTokens();
      }
    }
  }, [account, createOwnCollection, fetchTokens]);

  // find or create collection for own nft`s
  useEffect(() => {
    void findOrCreateCollection();
  }, [findOrCreateCollection]);

  useEffect(() => {
    localStorage.setItem('ownCollections', JSON.stringify(ownCollections));

    if (ownCollections && ownCollections.length) {
      setOwnCollection(ownCollections[0]);
    }
  }, [ownCollections]);

  return {
    ownCollection,
    ownNftList
  };
};

export default useNftCollection;
