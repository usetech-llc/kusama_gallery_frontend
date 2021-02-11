// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props, ThemeDef, ThemeProps } from '@polkadot/react-components/types';

import React, { useContext, useMemo } from 'react';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';

import styled, { ThemeContext } from 'styled-components';

import { getSystemChainColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import WarmUp from './WarmUp';

export const PORTAL_ID = 'portals';

function Apps ({ className = '' }: Props): React.ReactElement<Props> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { systemChain, systemName } = useApi();
  const location = useLocation();

  const uiHighlight = useMemo(
    () => getSystemChainColor(systemChain, systemName),
    [systemChain, systemName]
  );

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <div className={`apps--Wrapper theme--${theme} ${className}`}>
        <Menu tabular>
          <Menu.Item
            active={location.pathname === '/gallery'}
            as={NavLink}
            name='gallery'
            to='/gallery'
          />
          <Menu.Item
            active={location.pathname === '/wallet'}
            as={NavLink}
            name='wallet'
            to='/wallet'
          />
          <Menu.Item
            active={location.pathname === '/creator'}
            as={NavLink}
            name='creator'
            to='/creator'
          />
          <Menu.Item
            active={location.pathname === '/curator'}
            as={NavLink}
            name='curator'
            to='/curator'
          />
        </Menu>
        <Signer>
          <Content />
        </Signer>
        <ConnectingOverlay />
        <div id={PORTAL_ID} />
      </div>
      <WarmUp />
    </>
  );
}

export default React.memo(styled(Apps)(({ theme }: ThemeProps) => `
  background: ${theme.bgPage};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`));
