import { Action } from "@ngrx/store";
import { MailMessage } from "app/store/mail/mail-message";

export const ON_STATE_CHANGE = 'MAIL_ON_STATE_CHANGE';
export const OPEN_DETAIL_DIALOG = 'MAIL_OPEN_DETAIL_DIALOG';
export const MARK_READ = 'MAIL_MARK_READ';
export const HANDLE_MARK_READ = 'MAIL_HANDLE_MARK_READ'
export const MAIL_ADD = 'MAIL_ADD';
export const HANDLE_MAIL_ADD = 'HANDLE_MAIL_ADD';
export const FULL_MESSAGE_ADD = 'FULL_MESSAGE_ADD';
export const FULL_THREAD_ADD = 'MAIL_FULL_THREAD_ADD';
export const HANDLE_FULL_MESSAGE_ADD = 'HANDLE_FULL_MESSAGE_ADD';
export const LOAD_MORE_MESSAGES = 'LOAD_MORE_MESSAGES'
export const MAIL_DELETE = 'MAIL_DELETE';
export const HANDLE_MAIL_DELETE = 'HANDLE_MAIL_DELETE';
export const MAIL_CLEAR_ALL = 'MAIL_CLEAR_ALL';
export const START_LOADING = 'MAIL_START_LOADING';
export const STOP_LOADING = 'MAIL_STOP_LOADING';

export class OnStateChange implements Action{
    readonly type = ON_STATE_CHANGE;

    constructor(){}
}

export class OpenDetailDialog implements Action{
    readonly type= OPEN_DETAIL_DIALOG;

    constructor(public payload: MailMessage){}
}

export class MarkRead implements Action{
    readonly type = MARK_READ;

    constructor(public payload: MailMessage){}
}

export class HandleMarkRead implements Action{
    readonly type = HANDLE_MARK_READ;

    constructor(public payload: MailMessage){}
}

export class MailAdd implements Action {
    readonly type = MAIL_ADD;

    constructor (public payload: any) {}
}

export class HandleMailAdd implements Action{
    readonly type = HANDLE_MAIL_ADD;

    constructor(public payload: MailMessage | MailMessage[]){}
}

export class FullMessageAdd implements Action{
    readonly type = FULL_MESSAGE_ADD;

    constructor(public payload: string){}
}

export class FullThreadAdd implements Action{
    readonly type = FULL_THREAD_ADD;

    constructor(public payload: MailMessage){}
}

export class HandleFullMessageAdd implements Action{
    readonly type = HANDLE_FULL_MESSAGE_ADD;

    constructor(public payload: MailMessage | MailMessage[]){}
}

export class LoadMoreMessages implements Action{
    readonly type = LOAD_MORE_MESSAGES;

    constructor(){}
}

export class MailDelete implements Action {
    readonly type = MAIL_DELETE;

    constructor (public payload: MailMessage) {}
}

export class HandleMailDelete implements Action{
    readonly type = HANDLE_MAIL_DELETE;

    constructor(public payload: MailMessage){}
}

export class ClearAll implements Action {
    readonly type = MAIL_CLEAR_ALL;

    constructor(){}
}

export class StartLoading implements Action{
    readonly type = START_LOADING;

    constructor(){}    
}

export class StopLoading implements Action{
    readonly type = STOP_LOADING;

    constructor(){}    
}

export type All = OnStateChange | OpenDetailDialog  | MarkRead | HandleMarkRead | MailAdd | HandleMailAdd | FullMessageAdd | FullThreadAdd | HandleFullMessageAdd | LoadMoreMessages | MailDelete | HandleMailDelete |  ClearAll | StartLoading | StopLoading;
