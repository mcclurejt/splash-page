import * as MailActions from './mail.actions';
import { MailMessage } from "app/store/mail/mail-message";
import * as _ from "lodash";

export interface MailThread {
  [key: string]: MailMessage[]
}

export interface MailMessageLookup {
  [key: string]: MailMessage;
}

export enum Filter {
  all,
  inbox,
  unread,
  personal,
  social,
  promotions
}

export interface State {
  messages: MailMessage[],
  threads: MailThread,
  messageLookup: MailMessageLookup,
  loading: boolean,
  unreadMessages: string[],
  currentFilter: Filter
}

const initialState: State = {
  messages: [],
  threads: {},
  messageLookup: {},
  loading: false,
  unreadMessages: [],
  currentFilter: Filter.all,
}


export function reducer(state = initialState, action: MailActions.All): State {
  switch (action.type) {

    case MailActions.HANDLE_MAIL_ADD: {
      console.log(MailActions.HANDLE_MAIL_ADD);
      let newState = Object.assign({},state);
      newState.threads = Object.assign({},state.threads);
      if (Array.isArray(action.payload)) {
        newState.messages = [...newState.messages,...action.payload];
        newState.threads = Object.assign({}, _.merge(newState.threads, _.groupBy(action.payload, "threadId")));
        let unreadMessages = _.filter(action.payload,(message) => message.labelIds.includes('UNREAD')).map((message) => message.id);
        unreadMessages = _.filter(unreadMessages, (id) => !newState.unreadMessages.includes(id))
        newState.unreadMessages = [...newState.unreadMessages, ...unreadMessages]
      } else {
        if (!_.keys(newState.threads).includes(action.payload.threadId)) {
          newState.threads[action.payload.threadId] = [];
        }
        newState.threads[action.payload.threadId].push(action.payload);
        newState.messages = [...newState.messages,action.payload]
        if(action.payload.labelIds.includes('UNREAD')){
          newState.unreadMessages.push(action.payload.id);
        }
      }
      return newState;
    }

    case MailActions.HANDLE_FULL_MESSAGE_ADD: {
      console.log(MailActions.HANDLE_FULL_MESSAGE_ADD);
      let newState = Object.assign({}, state);
      newState.threads = Object.assign({},state.threads);      
      let ar;
      if(Array.isArray(action.payload)){
        // console.log('Adding Full Message Array',action.payload);
        ar = true;
        for(let message of action.payload){
          newState.messageLookup[message.id] = message;
        }
      } else {
        newState.messageLookup[action.payload.id] = action.payload;
      }
      if(ar){
        // console.log('Full message array new State',newState);
      }
      return newState;
    }

    case MailActions.HANDLE_MARK_READ: {
      console.log(MailActions.MARK_READ);
      let newState = Object.assign({},state);
      newState.threads = Object.assign({},state.threads);      
      _.remove(newState.unreadMessages, (messageId) => messageId == action.payload.id);
      newState.threads[action.payload.threadId].find((message) => message.id == action.payload.id).labelIds = action.payload.labelIds;
      return newState;
    }

    case MailActions.HANDLE_MAIL_DELETE: {
      console.log(MailActions.HANDLE_MAIL_DELETE);
      let newState = Object.assign({}, state);
      newState.threads = Object.assign({},state.threads);      
      let messages = _.remove(newState.messages, (message) => message.id == action.payload.id);
      newState.messages = messages;
      return newState;
    }

    case MailActions.MAIL_CLEAR_ALL: {
      console.log(MailActions.MAIL_CLEAR_ALL);
      return Object.assign({},initialState);
    }

    case MailActions.START_LOADING: {
      console.log(MailActions.START_LOADING);
      let newState = Object.assign({}, state);
      newState.threads = Object.assign({},state.threads);      
      newState.loading = true;
      return newState;
    }

    case MailActions.STOP_LOADING: {
      console.log(MailActions.STOP_LOADING);
      let newState = Object.assign({}, state);
      newState.threads = Object.assign({},state.threads);      
      newState.loading = false;
      return newState;
    }

    case MailActions.UPDATE_FILTER: {
      let newState = Object.assign({}, state);
      newState.threads = Object.assign({},state.threads);
      newState.currentFilter = action.payload;
      return newState;
    }

    default: return state;
  }
}