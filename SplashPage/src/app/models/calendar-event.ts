
export class CalendarEvent {
    id: string;
    summary: string;
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
        this.id = obj && obj.id || '';
        this.summary = obj && obj.summary || '';
        this.allDayEvent = obj && obj.allDayEvent || '';
        this.startDate = obj && obj.startDate || '';
        this.startTime = obj && obj.startTime || '';
        this.endDate = obj && obj.endDate  || '';
        this.endTime = obj && obj.endTime || '';
        this.calendarId = obj && obj.calendarId || '';
        this.calendarSummary = obj && obj.calendarSummary || '';
        this.calendarBackgroundColor = obj && obj.calendarBackgroundColor || '';
        this.calendarForegroundColor = obj && obj.calendarBoregroundColor || '';
    }   
}
