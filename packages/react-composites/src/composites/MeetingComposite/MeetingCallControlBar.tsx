// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallControls, CallControlOptions } from '../CallComposite/components/CallControls';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { ChatButton } from './ChatButton';
import { PeopleButton } from './PeopleButton';
import { mergeStyles, Stack } from '@fluentui/react';
import { reduceCallControlsForMobile } from '../CallComposite/utils';
import { controlBarContainerStyles } from '../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../CallComposite/styles/CallPage.styles';
import { MeetingCallControlOptions } from './MeetingComposite';
/**
 * @private
 */
export interface MeetingCallControlBarProps {
  callAdapter: CallAdapter;
  chatButtonChecked: boolean;
  peopleButtonChecked: boolean;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  mobileView: boolean;
  disableButtonsForLobbyPage: boolean;
  meetingCallControlOptions?: MeetingCallControlOptions;
}

/**
 * @private
 */
export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  // Set the desired control buttons from the meetings composite. particiapantsButton is always false since there is the peopleButton.
  let callControlsOptions: CallControlOptions | false = {
    ...props.meetingCallControlOptions,
    participantsButton: false,
    screenShareButton:
      props.mobileView || props.meetingCallControlOptions?.screenShareButton === false
        ? false
        : { disabled: props.disableButtonsForLobbyPage }
  };

  /**
   * Helper function to determine if a meeting control bar button is enabled or not.
   * @private
   */
  const isEnabled = (option: boolean | undefined): boolean => !(option === false);

  // Reduce the controls shown when mobile view is enabled.
  if (props.mobileView) {
    callControlsOptions = reduceCallControlsForMobile(callControlsOptions);
  }

  /**
   * Until mobile meetings is worked on, statically set the width of the
   * control bar such that all controls can be accessed.
   */
  const temporaryMeetingControlBarStyles = props.mobileView ? { width: '23.5rem' } : undefined;

  return (
    <Stack
      horizontal
      className={mergeStyles(temporaryMeetingControlBarStyles, callControlsContainerStyles, controlBarContainerStyles)}
    >
      <Stack.Item grow>
        <CallAdapterProvider adapter={props.callAdapter}>
          <CallControls options={callControlsOptions} increaseFlyoutItemSize={props.mobileView} />
        </CallAdapterProvider>
      </Stack.Item>
      <Stack.Item>
        {isEnabled(props.meetingCallControlOptions?.chatButton) !== false && (
          <ChatButton
            checked={props.chatButtonChecked}
            showLabel={true}
            onClick={props.onChatButtonClicked}
            data-ui-id="meeting-composite-chat-button"
            disabled={props.disableButtonsForLobbyPage}
          />
        )}
        {isEnabled(props.meetingCallControlOptions?.peopleButton) !== false && (
          <PeopleButton
            checked={props.peopleButtonChecked}
            showLabel={true}
            onClick={props.onPeopleButtonClicked}
            data-ui-id="meeting-composite-people-button"
            disabled={props.disableButtonsForLobbyPage}
          />
        )}
      </Stack.Item>
    </Stack>
  );
};
