import { Action } from "@ngrx/store";
import { State } from './weather.reducer'

export const UPDATE = 'WEATHER_UPDATE';
export const START_LOADING = 'WEATHER_START_LOADING';
export const END_LOADING = 'WEATHER_END_LOADING';

export class Update implements Action {
    readonly type = UPDATE;

    constructor(public payload: State){}
}

export class StartLoading implements Action{
    readonly type = START_LOADING;
    constructor(){}
}

export class EndLoading implements Action{
    readonly type = END_LOADING;
    constructor(){}
}

export type All = Update | StartLoading | EndLoading;