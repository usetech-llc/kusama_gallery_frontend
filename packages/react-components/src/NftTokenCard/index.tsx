// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import { TokenDetailsType } from '@polkadot/react-hooks';

import './styles.scss';

interface Props {
  account: string;
  collectionId: string;
  openDetailedInformationModal: (collectionId: string, tokenId: string) => void;
  token: TokenDetailsType;
}

const NftTokenCard = ({ collectionId, openDetailedInformationModal, token }: Props): React.ReactElement<Props> => {
  return (
    <Card
      className='token-card'
      key={token.tokenId}
      onClick={openDetailedInformationModal.bind(null, collectionId, token.tokenId)}
    >
      { token && (
        <Image
          src={token.metadata}
          ui={false}
          wrapped
        />
      )}
      { token && (
        <Card.Content>
          <Card.Header>{collectionId} #{token.tokenId}</Card.Header>
          <Card.Meta>
            <span className='date'>Creator: {token.creator}</span>
          </Card.Meta>
          <Card.Description>
            Owner: {token.ownerAddress}
          </Card.Description>
        </Card.Content>
      )}
    </Card>
  );
};

export default React.memo(NftTokenCard);
