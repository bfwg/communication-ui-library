// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { ReactChild } from 'react';
import {
  PictureInPictureInPicturePrimaryTile,
  PictureInPictureInPictureSecondaryTile,
  _PictureInPictureInPictureTileProps
} from './PictureInPictureInPictureTile';

/**
 * Strings of {@link _PictureInPictureInPicture} that can be overridden.
 *
 * @internal
 */
export interface _PictureInPictureInPictureStrings {
  /** Aria-label for the focusable root of the PictureInPictureInPicture component. */
  rootAriaLabel: string;
}

/**
 * Props for {@link _PictureInPictureInPicture} component.
 *
 * @internal
 */
export interface _PictureInPictureInPictureProps {
  /**
   * Callback when the {@link _PictureInPictureInPicture} is clicked.
   */
  onClick?: () => void;

  primaryTile: _PictureInPictureInPictureTileProps;
  secondaryTile?: _PictureInPictureInPictureTileProps;

  strings: _PictureInPictureInPictureStrings;
}

/**
 * Component that displays a video feed for use as a Picture-in-Picture style component.
 * It contains a secondary video feed resulting in an inner Picture-in-Picture style feed.
 *
 * @remarks
 * The double nature of the Picture-in-Picture styles is where this component gets its name; Picture-in-Picture-in-Picture.
 *
 * @internal
 */
export const _PictureInPictureInPicture = (props: _PictureInPictureInPictureProps): JSX.Element => {
  return (
    <PictureInPictureInPictureContainer
      onClick={props.onClick}
      primaryView={<PictureInPictureInPicturePrimaryTile {...props.primaryTile} />}
      secondaryView={props.secondaryTile && <PictureInPictureInPictureSecondaryTile {...props.secondaryTile} />}
      ariaLabel={props.strings.rootAriaLabel}
    />
  );
};
/**
 * Container for the picture in picture in picture component.
 * This governs positioning and floating of the secondary PiP.
 */
const PictureInPictureInPictureContainer = (props: {
  primaryView: ReactChild;
  secondaryView?: ReactChild;
  onClick?: () => void;
  ariaLabel: string;
}): JSX.Element => (
  <aside
    style={tileContainerStyles}
    onClick={props.onClick}
    onKeyPress={(e) => props.onClick && handleKeyDown(e, props.onClick)}
    aria-label={props.ariaLabel}
    tabIndex={props.onClick ? 0 : -1} // Only allow focus to be set if there is a click handler
  >
    {props.primaryView}
    <div style={secondaryTileFloatingStyles}>{props.secondaryView}</div>
  </aside>
);

/**
 * For keyboard navigation - when this component has active focus, enter key and space keys should have the same behavior as mouse click.
 */
const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, onClickCallback: () => void): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    onClickCallback();
  }
};

const tileContainerStyles: React.CSSProperties = {
  display: 'inline-block',
  width: 'min-content',
  position: 'relative',
  cursor: 'pointer'
};

const secondaryTileFloatingStyles: React.CSSProperties = {
  // The secondary tile should float above the primary tile, aligned to the bottom right.
  position: 'absolute',
  bottom: '0.125rem',
  right: '0.125rem'
};
