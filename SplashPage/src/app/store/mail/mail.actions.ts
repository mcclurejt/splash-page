import { Action } from "@ngrx/store";
import { EmailMessage } from "app/models/emailMessage";

export const MAIL_ADD = 'MAIL_ADD';
export const MAIL_DELETE = 'MAIL_DELETE';

export class MailAdd implements Action {
    readonly type = MAIL_ADD;

    constructor (public payload: EmailMessage | EmailMessage[]) {}
}

export class MailDelete implements Action {
    readonly type = MAIL_DELETE;

    constructor (public payload: EmailMessage | EmailMessage[]) {}
}

export type All = MailAdd | MailDelete;
