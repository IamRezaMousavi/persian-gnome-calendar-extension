/*
 * See https://www.daysoftheyear.com/
*/

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;

var GregorianEvents = class GregorianEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('7-1', [new CalendarEvent('روز جهانی بال مرغ', false)]);
        this._events.set('7-3', [new CalendarEvent('روز جهانی بدون کیسه پلاستیکی', false)]);
        this._events.set('7-6', [new CalendarEvent('روز جهانی بوسیدن', false)]);
        this._events.set('7-7', [new CalendarEvent('روز جهانی شکلات', false)]);
        this._events.set('7-13', [new CalendarEvent('روز جهانی سنگ', false)]);
        this._events.set('7-20', [new CalendarEvent('روز جهانی پرش', false)]);
        this._events.set('7-28', [new CalendarEvent('روز جهانی هپاتیت', false)]);
        this._events.set('7-13', [new CalendarEvent('روز جهانی سنگ', false)]);
        this._events.set('7-30', [new CalendarEvent('روز جهانی دوستی', false)]);
        this._events.set('8-4', [new CalendarEvent('روز جهانی پلنگ ابری', false)]);
        this._events.set('8-12', [new CalendarEvent('روز جهانی فیل', false)]);
        this._events.set('8-19', [new CalendarEvent('روز جهانی زنبور عسل', false)]);
        this._events.set('8-20', [new CalendarEvent('روز جهانی پشه', false)]);
        this._events.set('9-2', [
            new CalendarEvent('روز جهانی ریش', false),
            new CalendarEvent('روز جهانی نارگیل', false),
        ]);
        this._events.set('9-9', [new CalendarEvent('روز جهانی سودوکو', false)]);
        this._events.set('9-13', [new CalendarEvent('روز جهانی برنامه‌نویسان', false)]);
        this._events.set('9-17', [new CalendarEvent('روز جهانی موسیقی کانتری', false)]);
        this._events.set('9-21', [new CalendarEvent('روز جهانی قدردانی', false)]);
        this._events.set('9-23', [new CalendarEvent('روز جهانی زبان اشاره', false)]);
        this._events.set('9-24', [
            new CalendarEvent('روز جهانی بالیوود', false),
            new CalendarEvent('روز جهانی رودخانه‌ها', false),
        ]);
        this._events.set('9-29', [new CalendarEvent('روز جهانی نجوم', false)]);
        this._events.set('9-30', [new CalendarEvent('روز جهانی لباس توری', false)]);
    }
};
