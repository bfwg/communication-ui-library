// © Microsoft Corporation. All rights reserved.
import { LocalVideoStream, RemoteVideoStream } from '@azure/communication-calling';

export type GalleryParticipant = {
  displayName: string;
  userId: string;
  videoStream?: RemoteVideoStream;
};

export type LocalGalleryParticipant = {
  displayName: string;
  userId: string;
  videoStream?: LocalVideoStream;
};

type VideoGalleryVideoStream = {
  id: string;
  mediaStreamType: 'Video' | 'ScreenSharing';
  isAvailable: boolean;
  scalingMode?: 'Stretch' | 'Crop' | 'Fit';
  isMirrored?: boolean;
  target?: HTMLElement;
};

export type VideoGalleryRemoteVideoStream = VideoGalleryVideoStream;

export type VideoGalleryLocalVideoStream = VideoGalleryVideoStream;

type VideoGalleryParticipant = {
  userId: string;
  displayName?: string;
  isMuted: boolean;
};

export type VideoGalleryRemoteParticipant = VideoGalleryParticipant & {
  isSpeaking: boolean;
  videoStreams: VideoGalleryRemoteVideoStream[];
};

export type VideoGalleryLocalParticipant = VideoGalleryParticipant & {
  isScreenSharingOn: boolean;
  videoStreams: VideoGalleryLocalVideoStream[];
};
