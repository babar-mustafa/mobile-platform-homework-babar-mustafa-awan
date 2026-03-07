import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useApp } from '../../context/AppContext';
import { HomeScreen } from '../../screens/HomeScreen';
import { ExploreScreen } from '../../screens/ExploreScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { AgentFlyout } from '../../components/AgentFlyout';
import { ROUTE_HOME, ROUTE_EXPLORE, ROUTE_PROFILE } from '../../constants';
import { colors } from '../../theme';
import {
  FullScreen,
  ContentArea,
  ScreenLayer,
  TabBarRow,
  Tab,
  TabInner,
  TabIconWrap,
  TabLabel,
} from './styled';

const TABS: { name: typeof ROUTE_HOME | typeof ROUTE_EXPLORE | typeof ROUTE_PROFILE; label: string; icon: string; iconOutline: string }[] = [
  { name: ROUTE_HOME, label: 'Home', icon: 'home', iconOutline: 'home-outline' },
  { name: ROUTE_EXPLORE, label: 'Explore', icon: 'compass', iconOutline: 'compass-outline' },
  { name: ROUTE_PROFILE, label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
];

function TabBar({ currentScreen }: { currentScreen: string }) {
  const { setCurrentScreen } = useApp();
  const insets = useSafeAreaInsets();
  return (
    <TabBarRow style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      {TABS.map(({ name, label, icon, iconOutline }) => {
        const active = currentScreen === name;
        return (
          <Tab key={name} onPress={() => setCurrentScreen(name)}>
            <TabInner>
              <TabIconWrap>
                <Ionicons
                  name={active ? icon : iconOutline}
                  size={24}
                  color={active ? colors.primary : colors.textMuted}
                />
              </TabIconWrap>
              <TabLabel active={active}>{label}</TabLabel>
            </TabInner>
          </Tab>
        );
      })}
    </TabBarRow>
  );
}

export function RootNavigator() {
  const { flyoutOpen, setFlyoutOpen, currentScreen } = useApp();

  return (
    <>
      <NavigationContainer>
        <FullScreen>
          <ContentArea>
            <ScreenLayer visible={currentScreen === ROUTE_HOME}>
              <HomeScreen />
            </ScreenLayer>
            <ScreenLayer visible={currentScreen === ROUTE_EXPLORE}>
              <ExploreScreen />
            </ScreenLayer>
            <ScreenLayer visible={currentScreen === ROUTE_PROFILE}>
              <ProfileScreen />
            </ScreenLayer>
          </ContentArea>
          <TabBar currentScreen={currentScreen} />
        </FullScreen>
      </NavigationContainer>
      <AgentFlyout visible={flyoutOpen} onClose={() => setFlyoutOpen(false)} />
    </>
  );
}
