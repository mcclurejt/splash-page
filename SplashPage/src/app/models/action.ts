export class Action {
    type: string;
    payload?: any;
    constructor(obj? : any){
        this.type = obj && obj.type || '';
        this.payload = obj && obj.payload || null;
    }
}
