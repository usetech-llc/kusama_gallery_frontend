// Copyright 2020 UseTech authors & contributors

import React, { useCallback, useState, useRef, useEffect } from 'react';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import { Button, Input, Table, Label, LabelHelp } from '@polkadot/react-components';
import { useCollections, NftCollectionInterface } from '@polkadot/react-hooks';

import { useApi } from '@polkadot/react-hooks';

import './CollectionSearch.scss';

interface Props {
  account: string | null | undefined;
  addCollection: (item: NftCollectionInterface) => void;
  collections: Array<{ id: number, name: string }>;
}

function CollectionSearch({ addCollection, account, collections }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [collectionsAvailable, setCollectionsAvailable] = useState<Array<NftCollectionInterface>>([]);
  const [collectionsMatched, setCollectionsMatched] = useState<Array<NftCollectionInterface>>([]);
  const [searchString, setSearchString] = useState<string>('');
  const { presetTokensCollections } = useCollections();
  const currentAccount = useRef<string | null | undefined>();

  const searchCollection = useCallback(async () => {
    const filteredCollections = collectionsAvailable.filter((collection) => {
      if (
        collection.name.indexOf(searchString.toLowerCase()) !== -1
        || collection.id.toString().toLowerCase().indexOf(searchString.toLowerCase()) !== -1
      ) {
        return collection;
      } return null;
    });
    setCollectionsMatched(filteredCollections);
  }, [collectionsAvailable, searchString]);

  const hasThisCollection = useCallback((collectionInfo) => {
    return !!collections.find(collection => collection.id === collectionInfo.id);
  }, [collections]);

  const addCollectionToAccount = useCallback((item: NftCollectionInterface) => {
    addCollection(item)
  }, [addCollection]);

  const getCollections = useCallback(async () => {
    const collections = await presetTokensCollections();
    if (collections && collections.length) {
      setCollectionsAvailable(collections);
    }
  }, []);

  // clear search results if account changed
  useEffect(() => {
    if (currentAccount.current && currentAccount.current !== account) {
      setCollectionsMatched([]);
      setSearchString('');
    }
    currentAccount.current = account;
  }, [account]);

  useEffect(() => {
    void getCollections();
  }, [api]);

  return (
    <>
      <Header as='h2'>
        Find token collection
        <LabelHelp
          className='small-help'
          help={'Enter the collection number or name'}
        />
      </Header>
      <Form className='collection-search' onSubmit={searchCollection}>
        <Grid>
          { account && (
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.Field>
                  <Input
                    className='explorer--query label-small'
                    isDisabled={!collectionsAvailable.length}
                    label={<span>Find and add your token collection. For example, you can add tokens from <a href='https://ipfs-gateway.usetech.com/ipns/QmaMtDqE9nhMX9RQLTpaCboqg7bqkb6Gi67iCKMe8NDpCE/' target='_blank' rel='noopener noreferrer'>SubstraPunks</a></span>}
                    onChange={setSearchString}
                    value={searchString}
                    placeholder='Search...'
                    withLabel
                  >
                    <Button
                      icon='play'
                      onClick={searchCollection}
                    />
                  </Input>
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          )}
          <Label
            className='small-help-label'
            help={'Add the collection you want'}
            label={'Search results'}
          />
          <Table
            empty={'No results'}
            header={[]}
          >
            {collectionsMatched.map((item) => (
              <tr className='collection-row' key={item.id}>
                <td className='collection-name'>
                  Collection name: <strong>{item.name}</strong>
                </td>
                <td className='collection-actions'>
                  <Button
                    isBasic
                    isDisabled={hasThisCollection(item)}
                    icon='plus'
                    label='Add collection'
                    onClick={addCollectionToAccount.bind(null, item)}
                  />
                </td>
              </tr>
            ))}
          </Table>
        </Grid>
      </Form>
    </>

  )
}

export default React.memo(CollectionSearch);
