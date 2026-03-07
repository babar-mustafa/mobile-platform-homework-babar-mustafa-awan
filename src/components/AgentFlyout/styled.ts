import styled from 'styled-components/native';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import { colors, spacing } from '../../theme';

export const Overlay = styled(KeyboardAvoidingView)`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const Sheet = styled.View`
  background-color: ${colors.surface};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-height: 85%;
  padding-bottom: ${spacing.lg}px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text};
`;

export const CloseText = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
`;

export const MessagesScroll = styled(ScrollView)`
  max-height: 280px;
`;

export const MessagesContent = styled.View`
  padding: ${spacing.md}px;
`;

export const Hint = styled.Text`
  color: ${colors.textMuted};
  margin-bottom: ${spacing.md}px;
`;

export const ProposedWrap = styled.View`
  margin-horizontal: ${spacing.md}px;
  margin-vertical: ${spacing.sm}px;
`;

export const ProposedTitle = styled.Text`
  font-weight: 600;
  margin-bottom: ${spacing.xs}px;
`;

export const ProposedCmd = styled.Text`
  font-size: 12px;
  color: ${colors.textMuted};
  margin-bottom: ${spacing.xs}px;
`;

export const ConfirmRow = styled.View`
  flex-direction: row;
  margin-top: ${spacing.sm}px;
`;

export const Spacer = styled.View`
  width: ${spacing.sm}px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md}px;
  padding-top: ${spacing.sm}px;
`;

export const SendBtn = styled.Pressable`
  padding-vertical: 10px;
  padding-horizontal: ${spacing.md}px;
  margin-left: ${spacing.sm}px;
`;

export const SendText = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
  font-weight: 600;
`;
