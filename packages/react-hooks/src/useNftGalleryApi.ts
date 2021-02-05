// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import { useCallback, useState, useContext } from 'react';

import type { ApiTypes, SubmittableExtrinsic } from '@polkadot/api/types';
import { useApi, useFetch, ErrorType } from '@polkadot/react-hooks';
import type { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
import type { IKeyringPair } from '@polkadot/types/types';

import { StatusContext } from '@polkadot/react-components/Status';

export type TokenCollectionType = {
  collectionId: number;
  ownerAddress?: string;
  createdDate?: string;
}

export type TokenDetailsType = {
  collectionId: string;
  tokenId: string;
  creator?: string;
  metadata: string;
  ownerAddress?: string;
  createdDate?: string;
  status?: 'Display' | 'Hide' | 'ReportPending' | 'Reported';
  reportReason?: 'None' | 'Illegal' | 'Plagiarism' | 'Duplicate';
}

export type AppreciationType = {
  collectionId: number;
  tokenId: number;
  createdDate: string;
  ipfsUrl: string;
  artist: string;
  appreciator: string;
  amount: BN;
}

export type OfferType = {
  collectionId: number;
  tokenId: number;
  sellerAddress: string;
  buyerAddress: string;
  price: BN;
  offerStatus: string;
}

export type OfferEventsType = 'OfferCreated';

export enum TransactionStatus {
  Success,
  Fail,
  NotReady
}

export interface EventType extends EventRecord {
  event: {
    data: { method: string };
    method: string;
  }
}

export function useNftGalleryApi (account?: IKeyringPair | undefined) {
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const { fetchData } = useFetch();
  const [nftList, setNftList] = useState<TokenDetailsType[]>();
  const [ownNftList, setOwnNftList] = useState<TokenDetailsType[]>([]);
  const [createdNftList, setCreatedNftList] = useState<TokenDetailsType[]>();
  const [ownAppreciations, setOwnAppreciations] = useState<AppreciationType[]>();
  const [offers, setOffers] = useState<OfferType[]>();
  const [ownCollections, setOwnCollections] = useState<string[]>([]);
  const [reports, setReports] = useState<TokenDetailsType[]>();
  const [tokenDetails, setTokenDetails] = useState<TokenDetailsType>();
  const [error, setError] = useState<ErrorType>();

  const getRpcInformation = useCallback(async () => {
    return await api.rpc.system.properties();
  }, [api]);

  const submitTransaction = useCallback(async (successEventName: string, transaction: SubmittableExtrinsic<ApiTypes>): Promise<any | null> => {
    queueExtrinsic({
      accountId: account && account.toString(),
      extrinsic: transaction,
      isUnsigned: false,
      txFailedCb: () => console.log('tx fail'),
      txStartCb: () => console.log('tx start'),
      txSuccessCb: () => console.log(successEventName),
      txUpdateCb: () => console.log('tx update')
    });
  }, [account, queueExtrinsic]);

  /**
   * Create collection
   * Permissions: any
   * @return {Promise<number | null>} collectionId
   */
  const createCollection = useCallback(async (): Promise<number | null> => {
    const tx = api.tx.artGalleryPallet.createCollection();

    return await submitTransaction('CollectionCreated', tx) as Promise<number | null>;
  }, [api, submitTransaction]);

  /**
   * Mint token
   * Permission: Collection owner
   * @param {string} ipfsPin
   * @return {Promise<{ collectionId: number, tokenId: number } | null>}
   */
  const mintToken = useCallback(async (ipfsPin: string): Promise<{ collectionId: number, tokenId: number } | null> => {
    const tx = api.tx.artGalleryPallet.mint(ipfsPin);

    return submitTransaction('CollectionCreated', tx) as Promise<{ collectionId: number, tokenId: number } | null>;
  }, [api, submitTransaction]);

  /**
   * State variable that stores the amount of KSM that will be locked when NFT is created
   * Permission: any
   * @return {Promise<BN>}
   */
  const mintDeposit = useCallback(async (): Promise<BN> => {
    return await api.query.artGalleryPallet.mintDeposit() as unknown as Promise<BN>;
  }, [api]);

  /**
   * Set mint deposit
   * Permission: Curator
   * @param {BN} deposit
   * @return {Promise<any | null>}
   */
  const setMintDeposit = useCallback(async (deposit: BN): Promise<any | null> => {
    const tx = api.tx.artGalleryPallet.setMintDeposit(deposit);

    return await submitTransaction('DepositSet', tx) as Promise<any | null>;
  }, [api, submitTransaction]);

  /**
   * Burn token
   * Permission: Owner or Curator
   * @param {number} collectionId
   * @param {number} tokenId
   * @return {Promise<{ collectionId: number, tokenId: number } | null>}
   */
  const burnToken = useCallback(async (collectionId: number, tokenId: number): Promise<{ collectionId: string, tokenId: string } | null> => {
    const tx = api.tx.artGalleryPallet.burn(collectionId, tokenId);

    return await submitTransaction('NFTBurned', tx) as Promise<{ collectionId: string, tokenId: string } | null>;
  }, [api, submitTransaction]);

  /**
   * Transfer token
   * Permission: Owner
   * @param {number} collectionId
   * @param {number} tokenId
   * @param {string} recipient
   * @return {Promise<{ collectionId: number | string, tokenId: number | string, recipient: string } | null>}
   */
  const transferToken = useCallback(async (collectionId: number | string, tokenId: number | string, recipient: string): Promise<{ collectionId: number | string, tokenId: number | string, recipient: string | string } | null> => {
    const tx = api.tx.artGalleryPallet.transfer(collectionId, tokenId, recipient);

    return await submitTransaction('NFTTransfer', tx) as Promise<{ collectionId: number, tokenId: number, recipient: string } | null>;
  }, [api, submitTransaction]);

  /**
   * Create offer
   * Permission: any
   * @param {number} collectionId
   * @param {number} tokenId
   * @param {BN} price
   * @return {Promise<{ collectionId: number, tokenId: number, price: BN, buyerAddress: string } | null>}
   */
  const createOffer = useCallback(async (collectionId: number, tokenId: number, price: BN): Promise<{ collectionId: number, tokenId: number, price: BN, buyerAddress: string } | null> => {
    const tx = api.tx.artGalleryPallet.createOffer(collectionId, tokenId, price);

    return await submitTransaction('OfferCreated', tx) as Promise<{ collectionId: number, tokenId: number, price: BN, buyerAddress: string } | null>;
  }, [api, submitTransaction]);

  /**
   * Accept offer
   * Permission: Token owner who received the offer
   * @param {number} collectionId
   * @param {number} tokenId
   * @param {string} buyerAddress
   * @return {Promise<{ collectionId: number, tokenId: number, sellerAddress: string, buyerAddress: string } | null>}
   */
  const acceptOffer = useCallback(async (collectionId: number, tokenId: number, buyerAddress: string): Promise<{ collectionId: number, tokenId: number, sellerAddress: string, buyerAddress: string } | null> => {
    const tx = api.tx.artGalleryPallet.acceptOffer(collectionId, tokenId, buyerAddress);

    return await submitTransaction('OfferAccepted', tx) as Promise<{ collectionId: number, tokenId: number, sellerAddress: string, buyerAddress: string } | null>;
  }, [api, submitTransaction]);

  /**
   * Cancel offer
   * Permission: Buyer (who made this offer)
   * @param {number} collectionId
   * @param {number} tokenId
   * @return {Promise<{ collectionId: number, tokenId: number, sellerAddress: string, buyerAddress: string } | null>}
   */
  const cancelOffer = useCallback(async (collectionId: number, tokenId: number): Promise<{ collectionId: number, tokenId: number, sellerAddress: string, buyerAddress: string } | null> => {
    const tx = api.tx.artGalleryPallet.cancelOffer(collectionId, tokenId);

    return await submitTransaction('OfferCanceled', tx) as Promise<{ collectionId: number, tokenId: number, sellerAddress: string, buyerAddress: string } | null>;
  }, [api, submitTransaction]);

  /**
   * Appreciation Limit
   * Permission: any
   * @return {Promise<number | null>}
   */
  const appreciationLimit = useCallback(async (): Promise<number | null> => {
    return await api.query.artGalleryPallet.appreciationLimit() as unknown as Promise<number>;
  }, [api]);

  /**
   * Appreciate.
   * The sender can include KSM amount with the transaction up to an AppreciationLimit threshold
   * Permission: any
   * @param {number} collectionId
   * @param {number} tokenId
   * @param {BN} amount
   * @return {Promise<{ collectionId: number, tokenId: number, amount: BN } | null>}
   */
  const appreciate = useCallback(async (collectionId: number, tokenId: number, amount: BN): Promise<{ collectionId: number, tokenId: number, amount: BN } | null> => {
    const tx = api.tx.artGalleryPallet.appreciate(collectionId, tokenId, amount);

    return await submitTransaction('AppreciationReceived', tx) as Promise<{ collectionId: number, tokenId: number, amount: BN } | null>;
  }, [api, submitTransaction]);

  /**
   * Toggle display
   * Permission: Owner
   * @param {number} collectionId
   * @param {number} tokenId
   * @param {boolean} display
   * @return {Promise<boolean | null>}
   */
  const toggleDisplay = useCallback(async (collectionId: number, tokenId: number, display: boolean): Promise<boolean | null> => {
    const tx = api.tx.artGalleryPallet.toggleDisplay(collectionId, tokenId, display);

    return await submitTransaction('ToggleDisplay', tx) as Promise<boolean | null>;
  }, [api, submitTransaction]);

  /**
   * Report
   * Sets the report state to `report_pending`. Sets the report reason for the NFT
   * Permission: any
   * @param {number} collectionId
   * @param {number} tokenId
   * @param {'illegal' | 'plagiarism' | 'duplicate'} reason
   * @return {Promise<{ collectionId: number, tokenId: number, reason: 'illegal' | 'plagiarism' | 'duplicate' } | null>}
   */
  const reportReason = useCallback(async (collectionId: number, tokenId: number, reason: 'illegal' | 'plagiarism' | 'duplicate'): Promise<{ collectionId: number, tokenId: number, reason: 'illegal' | 'plagiarism' | 'duplicate' } | null> => {
    const tx = api.tx.artGalleryPallet.report(collectionId, tokenId, reason);

    return await submitTransaction('ArtReported', tx) as Promise<{ collectionId: number, tokenId: number, reason: 'illegal' | 'plagiarism' | 'duplicate' } | null>;
  }, [api, submitTransaction]);

  /**
   * Accept report
   * Accept the art report made by a user. Sets the report state to “Reported”
   * Permission: Curator
   * @param {number} collectionId
   * @param {number} tokenId
   * @return {Promise<{ collectionId: number, tokenId: number } | null>}
   */
  const acceptReport = useCallback(async (collectionId: number, tokenId: number): Promise<{ collectionId: number, tokenId: number } | null> => {
    const tx = api.tx.artGalleryPallet.acceptReport(collectionId, tokenId);

    return await submitTransaction('ArtReportAccepted', tx) as Promise<{ collectionId: number, tokenId: number } | null>;
  }, [api, submitTransaction]);

  /**
   * Clear report
   * Set the report status and report reason to “None”
   * Permission: Curator
   * @param {number} collectionId
   * @param {number} tokenId
   * @return {Promise<{ collectionId: number, tokenId: number } | null>}
   */
  const clearReport = useCallback(async (collectionId: number, tokenId: number): Promise<{ collectionId: number, tokenId: number } | null> => {
    const tx = api.tx.artGalleryPallet.acceptReport(collectionId, tokenId);

    return await submitTransaction('ArtReportCleared', tx) as Promise<{ collectionId: number, tokenId: number } | null>;
  }, [api, submitTransaction]);

  /**
   * Set curator
   * Set the curator address.
   * Permission: Root
   * @param {string} curatorAddress
   * @return {Promise<any | null>}
   */
  const setCurator = useCallback(async (curatorAddress: string): Promise<any | null> => {
    const tx = api.tx.artGalleryPallet.setCurator(curatorAddress);

    return await submitTransaction('CuratorSet', tx) as Promise<any | null>;
  }, [api, submitTransaction]);

  // GET /wallet/collections/{address}
  // Return the list of collection IDs for collections created by this address. (Initial requirement - there will only be one collection per address).

  /**
   * Return the list of collection IDs for collections created by this address.
   * (Initial requirement - there will only be one collection per address).
   * @param {string} address
   */
  const getOwnCollection = useCallback((address: string) => {
    fetchData<string[]>(`/api/wallet/collections/${address}`).subscribe((result: string[] | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setOwnCollections(result);
      }
    });
  }, [fetchData]);

  /**
   * Get NFT information. Includes the owner address,
   * the URL or IPFS pin for images/files to be displayed,
   * NFT status (display, hide, report_pending, or reported)
   * and report reason (none, illegal, plagiarism, duplicate).
   * @param {number} collectionId
   * @param {number} tokenId
   */
  const getTokenDetails = useCallback((collectionId: number | string, tokenId: number | string) => {
    fetchData<TokenDetailsType>(`/api/nft/${collectionId}/${tokenId}`).subscribe((result: TokenDetailsType | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setTokenDetails(result);
      }
    });
  }, [fetchData]);

  /**
   * Return the list of NFTs displayed in the gallery.
   * Includes the URLs for images to display for each NFT.
   * Does not include NFTs with “Hidden”, “Reported” or “burned” status.
   */
  const getNftList = useCallback(() => {
    fetchData<TokenDetailsType[]>('/api/display').subscribe((result: TokenDetailsType[] | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setNftList(result);
      }
    });
  }, [fetchData]);

  /**
   * Return the list of NFTs owned by the address.
   * Includes the URLs for images to display for each NFT.
   * Includes NFTs with “Hidden” and “Reported” status,
   * does not include NFTs with “Burned” status.
   * @param {string} address
   */
  const getOwnNftList = useCallback((address: string) => {
    fetchData<TokenDetailsType[]>(`/api/wallet/ownedNfts/${address}`).subscribe((result: TokenDetailsType[] | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setOwnNftList(result);
      }
    });
  }, [fetchData]);

  /**
   * Return the list of NFTs created by the address.
   * Includes the URLs for images to display for each NFT.
   * @param {string} address
   */
  const getOwnCreatedNftList = useCallback((address: string) => {
    fetchData<TokenDetailsType[]>(`/api/wallet/createdNfts/${address}`).subscribe((result: TokenDetailsType[] | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setCreatedNftList(result);
      }
    });
  }, [fetchData]);

  /**
   * Return the list of appreciations given or received by an address.
   * @param {string} address
   */
  const getOwnAppreciations = useCallback((address: string) => {
    fetchData<AppreciationType[]>(`/api/wallet/appreciation/${address}`).subscribe((result: AppreciationType[] | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setOwnAppreciations(result);
      }
    });
  }, [fetchData]);

  /**
   * Returns the offers made by or to the address.
   * Includes collection id, token id, date of creation,
   * seller address, buyer address, price, and offer status (pending, completed, or canceled)
   * @param {string} address
   * @return {Promise<Array<OfferType>>} offersList - list of own offers
   */
  const getOffers = useCallback((address?: string) => {
    fetchData<OfferType[]>(`/api/offers${address ? `?address=${address}` : ''}`).subscribe((result: OfferType[] | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setOffers(result);
      }
    });
  }, [fetchData]);

  /**
   * Returns the list of all currently reported NFTs.
   * Each entry of the list includes all fields
   * from the token table (collection_id, token_id, etc.).
   */
  const getReports = useCallback((queryString?: string) => {
    fetchData<TokenDetailsType[]>(`/api/report${queryString || ''}`).subscribe((result: TokenDetailsType[] | ErrorType) => {
      if ('error' in result) {
        setError(result);
      } else {
        setReports(result);
      }
    });
  }, [fetchData]);

  return {
    createCollection,
    createdNftList,
    error,
    getNftList,
    getOffers,
    getOwnAppreciations,
    getOwnCollection,
    getOwnCreatedNftList,
    getOwnNftList,
    getReports,
    getRpcInformation,
    getTokenDetails,
    mintDeposit,
    mintToken,
    nftList,
    offers,
    ownAppreciations,
    ownCollections,
    ownNftList,
    reports,
    tokenDetails,
    transferToken
  };
}

export default useNftGalleryApi;
