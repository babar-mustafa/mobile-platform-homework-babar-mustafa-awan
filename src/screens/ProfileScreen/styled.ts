import styled from 'styled-components/native';
import { colors, spacing } from '../../theme';

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: ${spacing.sm}px;
`;

export const CardMargin = styled.View`
  margin-bottom: ${spacing.lg}px;
`;

export const LogCardMargin = styled.View`
  margin-bottom: ${spacing.md}px;
`;

export const EmptyLog = styled.Text`
  color: ${colors.textMuted};
  font-style: italic;
`;

export const LogEntry = styled.View`
  margin-bottom: ${spacing.md}px;
  padding-bottom: ${spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

export const Outcome = styled.Text<{ rejected?: boolean }>`
  font-weight: 600;
  color: ${(p) => (p.rejected ? colors.danger : colors.success)};
`;

export const CommandType = styled.Text`
  color: ${colors.textSecondary};
`;

export const Reason = styled.Text`
  font-size: 12px;
  color: ${colors.textMuted};
  margin-top: ${spacing.xs}px;
`;

export const ButtonSpacer = styled.View`
  height: ${spacing.sm}px;
`;
