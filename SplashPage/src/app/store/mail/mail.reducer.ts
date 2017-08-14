import * as MailActions from './mail.actions';
import { MailMessage } from "app/store/mail/mail-message";
import * as _ from "lodash";

export interface MailThread {
  [key: string]: MailMessage[]
}

export interface MailMessageLookup {
  [key : string]: MailMessage;
}

export interface State {
  messages: MailMessage[],
  threads: MailThread,
  messageLookup: MailMessageLookup,
  loading: boolean,
}

const initialState: State = {
  messages: [],
  threads: {},
  messageLookup: {},
  loading: false,
}


export function reducer(state = initialState, action: MailActions.All): State {
  switch (action.type) {

    case MailActions.HANDLE_MAIL_ADD: {
      console.log(MailActions.HANDLE_MAIL_ADD);
      let newState;
      if (Array.isArray(action.payload)) {
        newState = Object.assign({
          messages: [...action.payload, ...state.messages],
          threads: Object.assign({}, _.merge(state.threads, _.groupBy(action.payload, "threadId"))),
          messageLookup: Object.assign({}, state.messageLookup),
          loading: state.loading,
        })
      } else {
        let threadObj = { threads: Object.assign({}, state.threads) }
        if (!_.keys(threadObj.threads).includes(action.payload.threadId)) {
          threadObj.threads[action.payload.threadId] = [];
        }
        threadObj.threads[action.payload.threadId].push(action.payload);
        newState = Object.assign(
          {},
          state,
          { messages: [action.payload, ...state.messages] },
          { messageLookup: state.messageLookup },
          threadObj,
        )
      }
      // console.log("MailAdd newState: ", newState);
      return newState;
    }

    case MailActions.HANDLE_FULL_MESSAGE_ADD: {
      console.log(MailActions.HANDLE_FULL_MESSAGE_ADD);
      let newState = Object.assign({},state);
      newState.messageLookup[action.payload.id] = action.payload;
      return newState;
    }

    case MailActions.MAIL_CLEAR_ALL: {
      console.log(MailActions.MAIL_CLEAR_ALL);
      return Object.assign({}, initialState);
    }

    case MailActions.START_LOADING: {
      console.log(MailActions.START_LOADING);
      let newState = Object.assign({},state);
      newState.loading = true;
      return newState;
    }

    case MailActions.STOP_LOADING: {
      console.log(MailActions.STOP_LOADING);
      let newState = Object.assign({},state);
      newState.loading = false;
      return newState;
    }

    default: return state;
  }
}