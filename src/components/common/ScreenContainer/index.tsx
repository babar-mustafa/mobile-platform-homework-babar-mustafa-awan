import React from 'react';
import type { ScreenContainerProps } from '../../../types';
import { Wrapper } from './styled';

export function ScreenContainer({ children }: ScreenContainerProps) {
  return <Wrapper>{children}</Wrapper>;
}
