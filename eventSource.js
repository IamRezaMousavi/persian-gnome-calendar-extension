// Abstraction for an appointment/event in a calendar

const { GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const GregorianEvents = Me.imports.events.gregorianEvents.GregorianEvents;


function sameYear(dateA, dateB) {
    return dateA.getYear() == dateB.getYear();
}

function sameMonth(dateA, dateB) {
    return sameYear(dateA, dateB) && (dateA.getMonth() == dateB.getMonth());
}

function sameDay(dateA, dateB) {
    return sameMonth(dateA, dateB) && (dateA.getDate() == dateB.getDate());
}

// Interface for appointments/events - e.g. the contents of a calendar

var EventSource = GObject.registerClass({
    Signals: { 'changed': {} }
}, class EventSource extends GObject.Object {
    _init() {
        super._init();
        this._gregorianEvents = new GregorianEvents();
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
        this._result = this._result.concat(gEvents);
        return this._result;
    }

    hasEvents(_day) {
        return this._gregorianEvents.hasEvents(_day);
    }

    isHoliday(_day) {
        return this._gregorianEvents.isHoliday(_day);
    }
});