import styled from 'styled-components/native';
import { spacing } from '../../../theme';

export const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${spacing.md}px;
`;

export const RowWithGap = styled.View`
  flex-direction: row;
  margin-bottom: ${spacing.sm}px;
`;

export const ButtonWrap = styled.View`
  margin-right: ${spacing.sm}px;
  margin-bottom: ${spacing.sm}px;
`;
