// 
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;

var PersianEvents = class PersianEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('1-1', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-2', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-3', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-4', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-12', [new CalendarEvent('روز جمهوری اسلامی', true)]);
        this._events.set('1-13', [new CalendarEvent('روز طبیعت', true)]);
        this._events.set('3-14', [new CalendarEvent('رحلت امام خمینی', true)]);
        this._events.set('3-15', [new CalendarEvent('قیام خونین ۱۵ خرداد', true)]);
        this._events.set('4-7', [new CalendarEvent('شهادت دکتر بهشتی', false)]);
        this._events.set('6-8', [new CalendarEvent('روز مبارزه با تروریسم', false)]);
        this._events.set('9-16', [new CalendarEvent('روز دانشجو', false)]);
        this._events.set('9-30', [new CalendarEvent('شب یلدا', false)]);
        this._events.set('11-22', [new CalendarEvent('پیروزی انقلاب اسلامی', true)]);
        this._events.set('12-29', [new CalendarEvent('روز ملی شدن صنعت نفت', true)]);
    }
    getEvents(day) {
        let events = this._events.get(day.getPersianMonth() + '-' + day.getPersianDate());
        if (events instanceof Array)
            return events;
        return [];
    }
}
