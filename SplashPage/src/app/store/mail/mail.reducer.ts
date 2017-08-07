import * as MailActions from './mail.actions';
import { MailMessage } from "app/store/mail/mail-message";
import * as _ from "lodash";

export interface MailThread {
    [key: string]: MailMessage[]
}

export interface State {
    messages: MailMessage[],
    threads: MailThread
}

const initialState: State = {
    messages: [],
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
                let threadObj = {threads: Object.assign({},state.threads)}
                if (!_.keys(threadObj.threads).includes(action.payload.threadId)) {
                    threadObj.threads[action.payload.threadId] = [];
                }
                threadObj.threads[action.payload.threadId].push(action.payload);
                newState = Object.assign(
                    {},
                    state,
                    { messages: [action.payload, ...state.messages] },
                    threadObj,
                )
            }
            // console.log("MailAdd newState: ", newState);
            return newState;
        }

        default: return state;
    }
}