
export class CalendarEvent {
    id: string;
    summary: string;
    timeZone: string;
    allDayEvent: boolean;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    calendarId: string;
    calendarSummary: string;
    calendarForegroundColor: string;
    calendarBackgroundColor: string;
    constructor(obj? : any){
        // this.id = obj && obj.id || '';
        // this.summary = obj && obj.summary || '';
        // this.timeZone = obj && obj.timeZone || '';
        // this.allDayEvent = obj && obj.allDayEvent || '';
        // this.start = obj && obj.start || {};
        // this.end = obj && obj.end  || {};
        // this.calendar = obj && obj.calendar || {}
        // this.calendar.id = obj && obj.calendar.id || '';
        // this.calendar.summary = obj && obj.calendar.summary || '';
        // this.calendar.backgroundColor = obj && obj.calendar.backgroundColor || '';
        // this.calendar.foregroundColor = obj && obj.calendar.foregroundColor || '';
    }   
}
