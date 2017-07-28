import { CalendarEvent } from 'app/models/calendar-event';
export class Calendar {
    id: string;
    provider: string;
    summary: string;
    foregroundColor: string;
    backgroundColor: string;
    events: CalendarEvent[];
    
    constructor(obj?:any){
        this.id = obj && obj.id || '';
        this.provider = obj && obj.provider || '';
        this.summary = obj && obj.summary || '';
        this.foregroundColor = obj && obj.foregroundColor || '';
        this.backgroundColor = obj && obj.backgroundColor || '';
        this.events = obj && obj.events || [];
    }
}
