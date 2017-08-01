export class CalendarEvent {
  id: string;
  summary: string;
  foregroundColor: string;
  backgroundColor: string;
  allDayEvent: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  calendarId: string;
  timeZone: string;
  provider: string;
  constructor(obj?: any) {
    this.id = obj && obj.id || '';
    this.summary = obj && obj.summary || '';
    if ((obj != null) && (obj.allDayEvent != null)) {
      this.allDayEvent = obj.allDayEvent;
    } else {
      this.allDayEvent = true;
    }
    this.foregroundColor = obj && obj.foregroundColor || '#000000';
    this.backgroundColor = obj && obj.backgroundColor || '#ffffff';
    this.startDate = obj && obj.startDate || '';
    this.startTime = obj && obj.startTime || '00:00';
    this.endDate = obj && obj.endDate || '';
    this.endTime = obj && obj.endTime || '00:00';
    this.calendarId = obj && obj.calendarId || '';
    this.timeZone = obj && obj.timeZone || '';
    this.provider = obj && obj.provider || '';
  }
}
