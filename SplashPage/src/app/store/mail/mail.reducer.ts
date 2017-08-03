import * as MailActions from './mail.actions';
import { EmailMessage } from "app/models/emailMessage";
import * as _ from "lodash";

export interface MailThread {
    [key:string]:EmailMessage[]
}

export interface State {
    messages: EmailMessage[],
    threads: MailThread
}

const initialState: State = {
    messages : [],
    threads: {}
}


export function reducer(state = initialState, action: MailActions.All): State {
    switch (action.type) {

        case MailActions.MAIL_ADD: {
            let newState;
            if (Array.isArray(action.payload)) {
                newState = Object.assign({
                    messages: [...action.payload, ...state.messages],
                    threads: Object.assign({}, _.merge(state.threads, _.groupBy(action.payload, "threadId"))),
                })
            } else {
                newState = Object.assign(
                    {},
                    state,
                    {messages: [action.payload, ...state.messages]},
                    {[action.payload.threadId] : [...state.threads[action.payload.threadId],action.payload] }
                )
            }
            console.log("MailAdd newState: ", newState);
            return newState;
        }

        default: return state;
    }
}