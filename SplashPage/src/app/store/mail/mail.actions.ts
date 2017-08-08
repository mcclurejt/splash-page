import { Action } from "@ngrx/store";
import { MailMessage } from "app/store/mail/mail-message";

export const MAIL_ADD = 'MAIL_ADD';
export const MAIL_DELETE = 'MAIL_DELETE';
export const MAIL_CLEAR_ALL = 'MAIL_CLEAR_ALL';

export class MailAdd implements Action {
    readonly type = MAIL_ADD;

    constructor (public payload: MailMessage | MailMessage[]) {}
}

export class MailDelete implements Action {
    readonly type = MAIL_DELETE;

    constructor (public payload: MailMessage | MailMessage[]) {}
}

export class ClearAll implements Action {
    readonly type = MAIL_CLEAR_ALL;

    constructor(){}
}

export type All = MailAdd | MailDelete;
