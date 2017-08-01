import { Action } from '@ngrx/store';
import * as firebase from 'firebase/app';

export const HANDLE_SIGNIN = 'HANDLE_SIGNIN';
export const HANDLE_SIGNOUT = 'HANDLE_SIGNOUT';
export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';

export class HandleSignIn implements Action {
    readonly type = HANDLE_SIGNIN;

    constructor(public payload : firebase.User){}
}

export class HandleSignOut implements Action {
    readonly type = HANDLE_SIGNOUT;

    constructor(){}
}

export class StartLoading implements Action {
    readonly type = START_LOADING;
    constructor(){}
}

export class StopLoading implements Action {
    readonly type = STOP_LOADING;
    constructor(){}
}

export type All = HandleSignIn | HandleSignOut | StartLoading | StopLoading;