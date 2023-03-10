// 
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;
const HijriDate = Me.imports.hijriDate;

var HijriEvents = class HijriEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('8-3', [new CalendarEvent('ولادت حضرت امام حسین (ع) (4 ه.ق) و روز پاسدار', false)]);
        this._events.set('8-15', [new CalendarEvent('ولادت حضرت قائم (عج) (255 ه.ق) و روز جهانی مستضعفان', true)]);
    }
    getEvents(day) {
        let hDate = HijriDate.fromGregorian(
            day.getFullYear(),
            day.getMonth() + 1,
            day.getDate()
        );
        let events = this._events.get(hDate.month + '-' + hDate.day);
        if (events instanceof Array)
            return events;
        return [];
    }
}
