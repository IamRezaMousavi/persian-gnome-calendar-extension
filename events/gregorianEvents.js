// 
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;

var GregorianEvents = class GregorianEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('3-4', [new CalendarEvent('HBD', true)]);
    }
}
