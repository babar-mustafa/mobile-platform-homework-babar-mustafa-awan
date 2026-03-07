import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenContainer, PageTitle, BodyTextCentered, Button } from '../../components/common';
import { Centered, Spacer } from './styled';

export function HomeScreen() {
  const { setFlyoutOpen } = useApp();

  return (
    <ScreenContainer>
      <Centered>
        <PageTitle>Home</PageTitle>
        <BodyTextCentered>Use the agent below to navigate or control the app.</BodyTextCentered>
        <Spacer />
        <Button title="Open Agent" onPress={() => setFlyoutOpen(true)} variant="primary" />
      </Centered>
    </ScreenContainer>
  );
}
