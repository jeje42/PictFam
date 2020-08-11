export enum FeedbackAction {
  InitFeedbackState = 'InitFeedbackState',
  PushMessage = 'PushMessage',
  ShiftMessage = 'ShiftMessage',
}

export interface FeedbackMessage {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export interface FeedbackState {
  messages: FeedbackMessage[];
}

export interface InitFeedbackStateAction {
  type: typeof FeedbackAction.InitFeedbackState;
}

export interface PushMessageAction {
  type: typeof FeedbackAction.PushMessage;
  message: FeedbackMessage;
}

export interface ShiftMessageAction {
  type: typeof FeedbackAction.ShiftMessage;
}

export type FeedbackActionTypes = InitFeedbackStateAction | PushMessageAction | ShiftMessageAction;
