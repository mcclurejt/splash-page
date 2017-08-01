import { Action } from "@ngrx/store";
import { State } from './weather.reducer'

export const UPDATE = 'UPDATE';
export const TOGGLE_LOADING = 'START_LOADING';

export class Update implements Action {
    readonly type = UPDATE;

    constructor(public payload: State){}
}

export class ToggleLoading implements Action{
    readonly type = TOGGLE_LOADING;
    constructor(public payload?: boolean){}
}

export type All = Update | ToggleLoading;