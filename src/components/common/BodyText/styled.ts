import styled from 'styled-components/native';
import { colors, spacing } from '../../../theme';

export const BodyText = styled.Text`
  font-size: 16px;
  color: ${colors.textMuted};
`;

export const BodyTextCentered = styled(BodyText)`
  text-align: center;
  margin-bottom: ${spacing.lg}px;
`;
