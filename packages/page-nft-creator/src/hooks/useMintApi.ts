// Copyright 2020 @polkadot/app-nft authors & contributors
import BN from 'bn.js';

import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { TokenCollectionType, useNftGalleryApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

interface UseMintApiInterface {
  ownCollection: number | undefined;
  minting: boolean;
  mintToken: (ipfsPin: string) => void;
  tokenMintDeposit: BN | undefined;
}

/**
 * min token with deposit
 * @return {Array<ValidatorInfo>} filtered validators from server
 */
function useMintApi (account: string | null): UseMintApiInterface {
  const [minting, setMinting] = useState<boolean>(false);
  const [ownCollection, setOwnCollection] = useState<number>();
  const [tokenMintDeposit, setTokenMintDeposit] = useState<BN>();
  const history = useHistory();
  const { createCollection, getOwnCollection, mintDeposit, mintToken } = useNftGalleryApi(account ? keyring.getAccount(account) : undefined);

  const addMintedTokenToWallet = useCallback(() => {
    const collections: Array<any> = JSON.parse(localStorage.getItem('tokenCollections') || '[]');
    if (!collections.length || !collections.find(collection => collection.id === ownCollection)) {
      collections.push({
        decimalPoints: 0,
        description: "The NFT collection for artists to mint and display their work",
        id: ownCollection,
        isReFungible: false,
        name: "Unique Gallery",
        offchainSchema: "https://uniqueapps.usetech.com/api/images/{id",
        prefix: "GAL",
      });
      localStorage.setItem('tokenCollections', JSON.stringify(collections));
    }
    history.push('/wallet');
  }, []);

  const mintNewToken = useCallback(async (ipfsPin: string) => {
    const newToken = await mintToken(ipfsPin);
  }, []);

  const fetchMintDeposit = useCallback(async () => {
    const deposit = await mintDeposit();
    setTokenMintDeposit(deposit);
    console.log('deposit', deposit);
  }, [mintDeposit]);

  const fetchCollections = useCallback(async () => {
    if (account) {
      const collections = await getOwnCollection(account);
      if (collections && collections.length) {
        setOwnCollection(collections[0]);
      }
    }
  }, [account, getOwnCollection]);

  // create own collection
  const createOwnCollection = useCallback(async () => {
    await createCollection();
    await fetchCollections();
  }, [createCollection, fetchCollections]);

  // find or create collection for own nft`s
  useEffect(() => {
    const ownCollection: number = JSON.parse(localStorage.getItem('ownCollection') || '{}');
    if (ownCollection) {
      setOwnCollection(ownCollection);
    } else {
      void createOwnCollection();
    }
    void fetchMintDeposit();
  }, []);

  return {
    ownCollection,
    minting,
    mintToken: mintNewToken,
    tokenMintDeposit
  };
}

export default useMintApi;
