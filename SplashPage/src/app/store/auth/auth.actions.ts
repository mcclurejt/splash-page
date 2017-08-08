import { Action } from '@ngrx/store';
import * as firebase from 'firebase/app';

export const SIGNIN = 'AUTH_SIGNIN';
export const SIGNOUT = 'AUTH_SIGNOUT';
export const START_LOADING = 'AUTH_START_LOADING';
export const STOP_LOADING = 'AUTH_STOP_LOADING';
export const STATE_CHANGE = 'AUTH_STATE_CHANGE';
export const DEFAULT = 'AUTH_DEFAULT'

export class SignIn implements Action {
    readonly type = SIGNIN;

    constructor(public payload: string){}
}

export class SignOut implements Action {
    readonly type = SIGNOUT;

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

export class StateChange implements Action {
    readonly type = STATE_CHANGE;
    constructor(public payload : firebase.User){}
}

export class Default implements Action {
    readonly type = DEFAULT;
    constructor(){}
}

export type All = StartLoading | StopLoading | StateChange | Default;