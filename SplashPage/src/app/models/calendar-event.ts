
export class CalendarEvent {
    id: string;
    summary: string;
    timeZone: string;
    start: {
        date: string;
        dateTime: string;
    };
    end: {
        date: string;
        dateTime: string;
    }
    calendar:{
        id: string;
        summary: string;
        foregroundColor: string;
        backgroundColor: string;
    }
    constructor(obj? : any){
        this.id = obj && obj.id || '';
        this.summary = obj && obj.summary || '';
        this.timeZone = obj && obj.timeZone || '';
        this.start = obj && obj.start || {};
        this.end = obj && obj.end  || {};
        this.calendar = obj && obj.calendar || {}
        this.calendar.id = obj && obj.calendar.id || '';
        this.calendar.summary = obj && obj.calendar.summary || '';
        this.calendar.backgroundColor = obj && obj.calendar.backgroundColor || '';
        this.calendar.foregroundColor = obj && obj.calendar.foregroundColor || '';
    }   
}
