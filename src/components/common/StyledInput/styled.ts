import styled from 'styled-components/native';
import { colors } from '../../../theme';

export const Input = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-color: ${colors.borderLight};
  border-radius: 8px;
  padding-horizontal: 12px;
  padding-vertical: 10px;
  font-size: 16px;
  color: ${colors.text};
`;
