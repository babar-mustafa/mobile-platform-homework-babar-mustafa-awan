import styled from 'styled-components/native';
import { colors } from '../../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export const variantBg: Record<ButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.chip,
  danger: colors.danger,
};

export const variantText: Record<ButtonVariant, string> = {
  primary: colors.primaryText,
  secondary: colors.text,
  danger: colors.primaryText,
};

export const Touchable = styled.Pressable<{
  variant: ButtonVariant;
  disabled?: boolean;
}>`
  padding-vertical: 12px;
  padding-horizontal: 20px;
  border-radius: 8px;
  align-items: center;
  background-color: ${(p) => variantBg[p.variant]};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

export const ButtonLabel = styled.Text<{ variant: ButtonVariant }>`
  font-size: 16px;
  color: ${(p) => variantText[p.variant]};
`;
