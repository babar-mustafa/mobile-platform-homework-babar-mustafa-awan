import styled from 'styled-components/native';
import { colors, spacing } from '../../theme';

/** Wrapper that fills available space so TabBar stays at bottom */
export const FullScreen = styled.View`
  flex: 1;
  flex-direction: column;
`;

/** Content area: screens stack here; takes all space above tab bar */
export const ContentArea = styled.View`
  flex: 1;
  position: relative;
`;

export const ScreenLayer = styled.View<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${(p) => (p.visible ? 1 : 0)};
  pointer-events: ${(p) => (p.visible ? 'auto' : 'none')};
`;

export const TabBarRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: ${colors.border};
  background-color: ${colors.surface};
  padding-top: ${spacing.sm}px;
  padding-bottom: ${spacing.lg}px;
`;

export const Tab = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const TabInner = styled.View`
  align-items: center;
`;

export const TabIconWrap = styled.View`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

export const TabLabel = styled.Text<{ active?: boolean }>`
  font-size: 12px;
  color: ${(p) => (p.active ? colors.primary : colors.textMuted)};
`;
