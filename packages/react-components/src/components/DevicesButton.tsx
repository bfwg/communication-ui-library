// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuItemStyles,
  IContextualMenuProps,
  IContextualMenuStyles,
  merge
} from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles } from './ControlBarButton';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';
import { buttonFlyoutItemStyles } from './styles/ControlBar.styles';
import { preventDismissOnEvent } from './utils/common';

/**
 * Styles for the {@link DevicesButton} menu.
 *
 * @public
 */
export interface DevicesButtonContextualMenuStyles extends IContextualMenuStyles {
  /**
   * Styles for the items inside the {@link DevicesButton} button menu.
   */
  menuItemStyles?: IContextualMenuItemStyles;
}

/**
 * Styles for the Devices button menu items.
 *
 * @public
 */
export interface DevicesButtonStyles extends ControlBarButtonStyles {
  /**
   * Styles for the {@link DevicesButton} menu.
   */
  menuStyles?: Partial<DevicesButtonContextualMenuStyles>;
}

/**
 * A device, e.g. camera, microphone, or speaker, in the {@link DevicesButton} flyout.
 *
 * @public
 */
export interface OptionsDevice {
  /**
   * Device unique identifier
   */
  id: string;
  /**
   * Device name
   */
  name: string;
}

/**
 * Strings of {@link DevicesButton} that can be overridden.
 *
 * @public
 */
export interface DevicesButtonStrings {
  /**
   * Label of button
   */
  label: string;
  /**
   * Button tooltip content.
   */
  tooltipContent?: string;
  /**
   * Title of camera menu
   */
  cameraMenuTitle: string;
  /**
   * Title of microphone menu
   */
  microphoneMenuTitle: string;
  /**
   * Title of speaker menu
   */
  speakerMenuTitle: string;
  /**
   * Tooltip of camera menu
   */
  cameraMenuTooltip: string;
  /**
   * Tooltip of microphone menu
   */
  microphoneMenuTooltip: string;
  /**
   * Tooltip of speaker menu
   */
  speakerMenuTooltip: string;
}

/**
 * Props for {@link DevicesButton}.
 *
 * @public
 */
export interface DevicesButtonProps extends ControlBarButtonProps {
  /**
   * Available microphones for selection
   */
  microphones?: OptionsDevice[];
  /**
   * Available speakers for selection
   */
  speakers?: OptionsDevice[];
  /**
   * Available cameras for selection
   */
  cameras?: OptionsDevice[];
  /**
   * Microphone that is shown as currently selected
   */
  selectedMicrophone?: OptionsDevice;
  /**
   * Speaker that is shown as currently selected
   */
  selectedSpeaker?: OptionsDevice;
  /**
   * Camera that is shown as currently selected
   */
  selectedCamera?: OptionsDevice;
  /**
   * Callback when a camera is selected
   */
  onSelectCamera?: (device: OptionsDevice) => Promise<void>;
  /**
   * Callback when a microphone is selected
   */
  onSelectMicrophone?: (device: OptionsDevice) => Promise<void>;
  /**
   * Speaker when a speaker is selected
   */
  onSelectSpeaker?: (device: OptionsDevice) => Promise<void>;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<DevicesButtonStrings>;
  /**
   * Option to increase the touch targets of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  styles?: DevicesButtonStyles;
}

/**
 * Subset props for various buttons that show device selection menus.
 *
 * @private
 */
export interface DeviceMenuProps {
  microphones?: OptionsDevice[];
  speakers?: OptionsDevice[];
  cameras?: OptionsDevice[];
  selectedMicrophone?: OptionsDevice;
  selectedSpeaker?: OptionsDevice;
  selectedCamera?: OptionsDevice;
  onSelectCamera?: (device: OptionsDevice) => Promise<void>;
  onSelectMicrophone?: (device: OptionsDevice) => Promise<void>;
  onSelectSpeaker?: (device: OptionsDevice) => Promise<void>;
  styles?: Partial<DeviceMenuStyles>;
}

/**
 * Subset of strings for various buttons that show device selection menus.
 *
 * @private
 */
export interface DeviceMenuStrings {
  /**
   * Title for Camera section in the contextual menu
   */
  cameraMenuTitle?: string;
  /**
   * Title for Audio Device section in the contextual menu
   *
   * @remark Used in place of microphoneMenuTitle when speakers can be enumerated
   */
  audioDeviceMenuTitle?: string;
  /**
   * Title for Microphone section in the contextual menu
   *
   * @remark Used when speakers can be enumerated
   */
  microphoneMenuTitle?: string;
  /**
   * Title for Speaker section in the contextual menu
   */
  speakerMenuTitle?: string;
  /**
   * Tooltip label for Camera section in the contextual menu
   */
  cameraMenuTooltip?: string;
  /**
   * Tooltip label for Audio Device section in the contextual menu
   *
   * @remark Used in place of microphoneMenuTooltip when speakers can be enumerated
   */
  audioDeviceMenuTooltip?: string;
  /**
   * Tooltip label for Microphone section in the contextual menu
   *
   * @remark Used when speakers can be enumerated
   */
  microphoneMenuTooltip?: string;
  /**
   * Tooltip label for Speaker section in the contextual menu
   */
  speakerMenuTooltip?: string;
}

/**
 * Styles for flyouts used by various buttons for device selection flyouts.
 *
 * @private
 */
export interface DeviceMenuStyles extends IContextualMenuStyles {
  menuItemStyles?: IContextualMenuItemStyles;
}

/**
 * Generates default {@link IContextualMenuProps} for buttons that
 * show a drop-down to select devices to use.
 *
 * @private
 */
export const generateDefaultDeviceMenuProps = (
  props: DeviceMenuProps,
  strings: DeviceMenuStrings
): { items: IContextualMenuItem[] } | undefined => {
  const {
    microphones,
    speakers,
    cameras,
    selectedMicrophone,
    selectedSpeaker,
    selectedCamera,
    onSelectCamera,
    onSelectMicrophone,
    onSelectSpeaker
  } = props;

  const defaultMenuProps: IContextualMenuProps = {
    items: [],
    styles: props.styles,
    calloutProps: {
      styles: {
        root: {
          // Confine the menu to the parents bounds.
          // More info: https://github.com/microsoft/fluentui/issues/18835
          // NB: 95% to keep some space for margin, drop shadow etc around the Callout.
          maxWidth: '95%'
        }
      },
      preventDismissOnEvent
    }
  };

  const menuItemStyles = merge(buttonFlyoutItemStyles, props.styles?.menuItemStyles ?? {});

  if (cameras && selectedCamera && onSelectCamera) {
    defaultMenuProps.items.push({
      key: 'sectionCamera',
      title: strings.cameraMenuTooltip,
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: strings.cameraMenuTitle,
        items: cameras.map((camera) => ({
          key: camera.id,
          text: camera.name,
          title: camera.name,
          iconProps: { iconName: 'OptionsCamera', styles: { root: { lineHeight: 0 } } },
          itemProps: {
            styles: menuItemStyles
          },
          canCheck: true,
          isChecked: camera.id === selectedCamera?.id,
          onClick: () => {
            if (camera.id !== selectedCamera?.id) {
              onSelectCamera(camera);
            }
          }
        }))
      }
    });
  }

  if (microphones && selectedMicrophone && onSelectMicrophone) {
    // Set props as Microphone if speakers can be enumerated else set as Audio Device
    const speakersAvailable = speakers && speakers.length > 0;
    const key = speakersAvailable ? 'sectionMicrophone' : 'sectionAudioDevice';
    const title = speakersAvailable ? strings.microphoneMenuTooltip : strings.audioDeviceMenuTooltip;
    const sectionPropsTitle = speakersAvailable ? strings.microphoneMenuTitle : strings.audioDeviceMenuTitle;
    const iconName = speakersAvailable ? 'OptionsMic' : 'OptionsSpeaker';

    defaultMenuProps.items.push({
      key: key,
      title: title,
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: sectionPropsTitle,
        items: microphones.map((microphone) => ({
          key: microphone.id,
          text: microphone.name,
          title: microphone.name,
          iconProps: { iconName: iconName, styles: { root: { lineHeight: 0 } } },
          itemProps: {
            styles: menuItemStyles
          },
          canCheck: true,
          isChecked: microphone.id === selectedMicrophone?.id,
          onClick: () => {
            if (microphone.id !== selectedMicrophone?.id) {
              onSelectMicrophone(microphone);
            }
          }
        }))
      }
    });
  }

  if (speakers && selectedSpeaker && onSelectSpeaker) {
    defaultMenuProps.items.push({
      key: 'sectionSpeaker',
      title: strings.speakerMenuTooltip,
      itemType: ContextualMenuItemType.Section,
      sectionProps: {
        title: strings.speakerMenuTitle,
        items: speakers.map((speaker) => ({
          key: speaker.id,
          text: speaker.name,
          title: speaker.name,
          iconProps: { iconName: 'OptionsSpeaker', styles: { root: { lineHeight: 0 } } },
          itemProps: {
            styles: menuItemStyles
          },
          canCheck: true,
          isChecked: speaker.id === selectedSpeaker?.id,
          onClick: () => {
            if (speaker.id !== selectedSpeaker?.id) {
              onSelectSpeaker(speaker);
            }
          }
        }))
      }
    });
  }

  if (defaultMenuProps.items.length === 0) {
    // Avoids creating an empty context menu.
    return undefined;
  }
  return defaultMenuProps;
};

/**
 * A button to open a menu that controls device options.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const DevicesButton = (props: DevicesButtonProps): JSX.Element => {
  const { onRenderIcon } = props;

  const localeStrings = useLocale().strings.devicesButton;
  const strings = { ...localeStrings, ...props.strings };

  const devicesButtonMenu =
    props.menuProps ?? generateDefaultDeviceMenuProps({ ...props, styles: props.styles?.menuStyles }, strings);

  const onRenderOptionsIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonOptions" />
  );

  return (
    <ControlBarButton
      {...props}
      menuProps={devicesButtonMenu}
      menuIconProps={{ hidden: true }}
      onRenderIcon={onRenderIcon ?? onRenderOptionsIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'devicesButtonLabel'}
    />
  );
};
