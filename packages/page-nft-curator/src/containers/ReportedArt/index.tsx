// Copyright 2017-2021 UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import { AccountSelector, FormatBalance, ListComponent } from '@polkadot/react-components';
import { useBalance, useNftGalleryApi, TokenDetailsType } from '@polkadot/react-hooks';

interface Props {
  className?: string;
}

function ReportedArt (props: Props): React.ReactElement<Props> {
  const [account, setAccount] = useState<string | null>(null);
  const { balance } = useBalance(account);
  const currentAccount = useRef<string | null | undefined>();
  const { getReports, reports } = useNftGalleryApi();

  const headerRef = useRef([
    ['Report Reason', 'start', 2],
    ['Creator', 'start'],
    ['Created at', 'start'],
    ['Owner', 'start'],
    ['Collection', 'start'],
    ['Token', 'start']
  ]);

  useEffect(() => {
    currentAccount.current = account;
    getReports();
  }, [account, getReports]);

  console.log('balance.free', balance);

  return (
    <div className='app-list pending-reports'>
      <Header as='h1'>Curator</Header>
      <Header as='h2'>Account</Header>
      <Grid className='account-selector'>
        <Grid.Row>
          <Grid.Column width={12}>
            <AccountSelector onChange={setAccount} />
          </Grid.Column>
          <Grid.Column width={4}>
            { balance && (
              <div className='balance-block'>
                <label>Your account balance is:</label>
                <FormatBalance
                  className='balance'
                  value={balance.free}
                />
              </div>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <br />
      <ListComponent
        empty={'No trades found'}
        header={headerRef.current}
      >
        { reports && reports.map((report: TokenDetailsType) => (
          <tr key={`${report.collectionId}${report.tokenId}`}>
            <td
              className='start'
              colSpan={2}
            >
              {report.reportReason}
            </td>
            <td className='overflow'>
              {report.creator}
            </td>
            <td className='overflow'>
              {moment(report.createdDate).format('DD MMMM YYYY')}
            </td>
            <td className='overflow'>
              {report.ownerAddress}
            </td>
            <td className='overflow'>
              {report.collectionId}
            </td>
            <td className='overflow'>
              {report.tokenId}
            </td>
          </tr>
        ))}
      </ListComponent>
    </div>
  );
}

export default React.memo(ReportedArt);
