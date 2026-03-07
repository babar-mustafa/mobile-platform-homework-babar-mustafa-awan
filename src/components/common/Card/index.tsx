import React from 'react';
import type { CardProps } from '../../../types';
import { StyledCard } from './styled';

export function Card({ children, style }: CardProps) {
  return <StyledCard style={style}>{children}</StyledCard>;
}
