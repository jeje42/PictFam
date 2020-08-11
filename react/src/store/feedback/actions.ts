import { FeedbackAction, FeedbackMessage, PushMessageAction, ShiftMessageAction } from './types';

export const pushMessageAction = (message: FeedbackMessage): PushMessageAction => ({
  type: FeedbackAction.PushMessage,
  message,
});

export const shiftMessageAction = (): ShiftMessageAction => ({
  type: FeedbackAction.ShiftMessage,
});
