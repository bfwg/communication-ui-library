// © Microsoft Corporation. All rights reserved.

import React, { useState } from 'react';
import { gridLayoutStyle } from './styles/GridLayout.styles';

export type GridLayoutType = 'standard';

export interface GridLayoutProps {
  children: React.ReactNode;
  layout?: GridLayoutType;
}

const calculateStandardLayoutRows = (numberOfItems: number, gridCol: number): number =>
  Math.ceil(numberOfItems / gridCol);

const calculateStandardLayoutColumns = (numberOfItems: number): number =>
  numberOfItems > 0 ? Math.ceil(Math.sqrt(numberOfItems)) : 1;

export const GridLayout = (props: GridLayoutProps): JSX.Element => {
  const [gridCol, setGridCol] = useState(1);
  const [gridRow, setGridRow] = useState(1);

  const { children, layout = 'standard' } = props;
  const numberOfChildren = React.Children.count(children);

  switch (layout) {
    case 'standard': {
      const numberOfColumns = calculateStandardLayoutColumns(numberOfChildren);
      if (gridCol !== numberOfColumns) setGridCol(numberOfColumns);
      const numberOfRows = calculateStandardLayoutRows(numberOfChildren, gridCol);
      if (gridRow !== numberOfRows) setGridRow(numberOfRows);
      break;
    }
  }

  return (
    <div
      className={gridLayoutStyle}
      style={{
        gridTemplateRows: `repeat(${gridRow}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${gridCol}, 1fr)`
      }}
    >
      {children}
    </div>
  );
};
