import { CalendarEvent } from 'app/store/calendar/calendar-event';
export class Calendar {
    id: string;
    provider: string;
    summary: string;
    foregroundColor: string;
    backgroundColor: string;
    syncToken?: string;
    pageToken?: string;
    timeZone: string;
    constructor(obj?:any){
        this.id = obj && obj.id || '';
        this.provider = obj && obj.provider || '';
        this.summary = obj && obj.summary || '';
        this.foregroundColor = obj && obj.foregroundColor || '';
        this.backgroundColor = obj && obj.backgroundColor || '';
        this.syncToken = obj && obj.syncToken || '';
        this.pageToken = obj && obj.pageToken || '';
        this.timeZone = obj && obj.timeZone || '';
    }
}

