import { Action } from "@ngrx/store";
import { MailMessage } from "app/store/mail/mail-message";

export const MAIL_ADD = 'MAIL_ADD';
export const MAIL_DELETE = 'MAIL_DELETE';

export class MailAdd implements Action {
    readonly type = MAIL_ADD;

    constructor (public payload: MailMessage | MailMessage[]) {}
}

export class MailDelete implements Action {
    readonly type = MAIL_DELETE;

    constructor (public payload: MailMessage | MailMessage[]) {}
}

export type All = MailAdd | MailDelete;
