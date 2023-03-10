// 
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;

var PersianEvents = class PersianEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('12-15', [new CalendarEvent('روز درختکاری', false)]);
        this._events.set('12-29', [new CalendarEvent('ملی شدن صنعت نفت ایران (1329 ه.ش)', true)]);
    }
    getEvents(day) {
        let events = this._events.get(day.getPersianMonth() + '-' + day.getPersianDate());
        if (events instanceof Array)
            return events;
        return [];
    }
}
