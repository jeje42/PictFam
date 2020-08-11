import { FeedbackAction, FeedbackActionTypes, FeedbackState } from './types';

const initialState: FeedbackState = {
  messages: [],
};

export function feedbackReducer(state = initialState, action: FeedbackActionTypes): FeedbackState {
  switch (action.type) {
    case FeedbackAction.InitFeedbackState:
      return {
        messages: [],
      };
    case FeedbackAction.PushMessage:
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case FeedbackAction.ShiftMessage:
      const [, ...rest] = state.messages;
      return {
        ...state,
        messages: rest,
      };
    default:
      return state;
  }
}
