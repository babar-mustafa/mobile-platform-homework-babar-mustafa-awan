import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScreenContainer,
  PageTitle,
  Label,
  Row,
  ButtonWrap,
  Button,
} from '../../components/common';
import { Hint } from './styled';

const FILTERS = ['all', 'recent', 'favorites'] as const;
const SORTS = ['name', 'date', 'relevance'] as const;

export function ExploreScreen() {
  const { exploreFilter, exploreSort, setExploreFilter, setExploreSort, setFlyoutOpen } = useApp();

  return (
    <ScreenContainer>
      <PageTitle>Explore</PageTitle>

      <Label>Filter</Label>
      <Row>
        {FILTERS.map((f) => (
          <ButtonWrap key={f}>
            <Button
              title={f}
              onPress={() => setExploreFilter(f)}
              variant={exploreFilter === f ? 'primary' : 'secondary'}
            />
          </ButtonWrap>
        ))}
      </Row>

      <Label>Sort</Label>
      <Row>
        {SORTS.map((s) => (
          <ButtonWrap key={s}>
            <Button
              title={s}
              onPress={() => setExploreSort(s)}
              variant={exploreSort === s ? 'primary' : 'secondary'}
            />
          </ButtonWrap>
        ))}
      </Row>

      <Hint>Current: {exploreFilter} · {exploreSort}</Hint>
      <Button title="Open Agent" onPress={() => setFlyoutOpen(true)} variant="secondary" />
    </ScreenContainer>
  );
}
