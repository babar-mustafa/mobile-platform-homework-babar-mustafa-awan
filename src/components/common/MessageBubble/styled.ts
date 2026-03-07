import styled from 'styled-components/native';
import { colors, spacing } from '../../../theme';

export const Bubble = styled.View<{ isUser: boolean }>`
  padding: ${spacing.md}px;
  border-radius: 12px;
  margin-bottom: ${spacing.sm}px;
  max-width: 90%;
  align-self: ${(p) => (p.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(p) => (p.isUser ? colors.primary : colors.chip)};
`;

export const BubbleText = styled.Text<{ isUser: boolean }>`
  font-size: 15px;
  color: ${(p) => (p.isUser ? colors.primaryText : colors.text)};
`;
