// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Routes } from './types';

import nftWallet from './nft-wallet';
import nftCreator from './nft-creator';
import nftCurator from './nft-curator';
import nftGallery from './nft-gallery';

export default function create (t: TFunction): Routes {
  return [
    nftWallet(t),
    nftCreator(t),
    nftCurator(t),
    nftGallery(t)
  ];
}
