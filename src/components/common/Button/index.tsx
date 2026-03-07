import React from 'react';
import type { ButtonProps } from '../../../types';
import { Touchable, ButtonLabel } from './styled';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
}: ButtonProps) {
  return (
    <Touchable
      variant={variant}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
    >
      <ButtonLabel variant={variant}>{title}</ButtonLabel>
    </Touchable>
  );
}
