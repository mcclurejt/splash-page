export function weatherReducer(state: any = null, {type, payload}){
    switch (type) {
        case 'ADD_WEATHER':
            return payload;
        default:
            return state;
    }
}