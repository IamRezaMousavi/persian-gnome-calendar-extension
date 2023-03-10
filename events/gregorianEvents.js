// 
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;

var GregorianEvents = class GregorianEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('3-4', [new CalendarEvent('روز جهانی مهندسی برای توسعه پایدار', false)]);
        this._events.set('3-8', [new CalendarEvent('روز جهانی زن', false)]);
        this._events.set('3-14', [new CalendarEvent('روز جهانی ریاضیات', false)]);
        this._events.set('3-20', [new CalendarEvent('روز جهانی فرانکفونی (بزرگداشت زبان و فرهنگ فرانسوی)', false)]);
        this._events.set('3-22', [new CalendarEvent('روز جهانی آب', false)]);
    }
}
