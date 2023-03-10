// Abstraction for an appointment/event in a calendar

const { GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const GregorianEvents = Me.imports.events.gregorianEvents.GregorianEvents;
const PersianEvents = Me.imports.events.persianEvents.PersianEvents;
const HijriEvents = Me.imports.events.hijriEvents.HijriEvents;


// Interface for appointments/events - e.g. the contents of a calendar

var EventSource = GObject.registerClass({
    Signals: { 'changed': {} }
}, class EventSource extends GObject.Object {
    _init() {
        super._init();
        this._gregorianEvents = new GregorianEvents();
        this._persianEvents = new PersianEvents();
        this._hijriEvents = new HijriEvents();
    }
    get isLoading() {
        return false;
    }

    get hasCalendars() {
        return true;
    }

    requestRange(_begin, _end) {
    }

    getEvents(_begin, _end) {
        this._result = [];
        let gEvents = this._gregorianEvents.getEvents(_begin);
        let pEvents = this._persianEvents.getEvents(_begin);
        let hEvents = this._hijriEvents.getEvents(_begin);
        
        this._result = this._result.concat(hEvents);
        this._result = this._result.concat(pEvents);
        this._result = this._result.concat(gEvents);
        return this._result;
    }

    hasEvents(_day) {
        let n = this._gregorianEvents.hasEvents(_day);
        n += this._persianEvents.hasEvents(_day);
        n += this._hijriEvents.hasEvents(_day);
        return n > 0;
    }

    isHoliday(_day) {
        return this._gregorianEvents.isHoliday(_day) || 
               this._persianEvents.isHoliday(_day) ||
               this._hijriEvents.isHoliday(_day);
    }
});