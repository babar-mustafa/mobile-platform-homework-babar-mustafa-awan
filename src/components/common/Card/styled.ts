import styled from 'styled-components/native';
import { colors, spacing } from '../../../theme';

export const StyledCard = styled.View`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: ${spacing.md}px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  elevation: 3;
`;
