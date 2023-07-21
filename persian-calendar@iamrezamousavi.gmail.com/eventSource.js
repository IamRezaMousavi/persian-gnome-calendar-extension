// Abstraction for an appointment/event in a calendar

const {GObject} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const GregorianEvents = Me.imports.events.gregorianEvents.GregorianEvents;
const PersianEvents = Me.imports.events.persianEvents.PersianEvents;
const HijriEvents = Me.imports.events.hijriEvents.HijriEvents;
const UnofficialWorldEvents = Me.imports.events.unofficialWorldEvents.GregorianEvents;


// Interface for appointments/events - e.g. the contents of a calendar

var EventSource = GObject.registerClass({
    Signals: {'changed': {}},
}, class EventSource extends GObject.Object {
    _init(settings) {
        super._init();
        this.settings = settings;
        this._gregorianEvents = new GregorianEvents();
        this._persianEvents = new PersianEvents();
        this._hijriEvents = new HijriEvents();
        this._unofficialWorldEvents = new UnofficialWorldEvents();
    }

    getEvents(_begin, _end) {
        this._result = [];

        let geventsActive = this.settings.get_boolean('gevents-active');
        if (geventsActive) {
            let gEvents = this._gregorianEvents.getEvents(_begin);
            this._result = this._result.concat(gEvents);
        }

        let peventsActive = this.settings.get_boolean('pevents-active');
        if (peventsActive) {
            let pEvents = this._persianEvents.getEvents(_begin);
            this._result = this._result.concat(pEvents);
        }

        let heventsActive = this.settings.get_boolean('hevents-active');
        if (heventsActive) {
            let hEvents = this._hijriEvents.getEvents(_begin);
            this._result = this._result.concat(hEvents);
        }

        let unoffeventsActive = this.settings.get_boolean('unoffevents-active');
        if (unoffeventsActive) {
            let unoffEvents = this._unofficialWorldEvents.getEvents(_begin);
            this._result = this._result.concat(unoffEvents);
        }

        return this._result;
    }

    hasEvents(_day) {
        let geventsActive = this.settings.get_boolean('gevents-active');
        let peventsActive = this.settings.get_boolean('pevents-active');
        let heventsActive = this.settings.get_boolean('hevents-active');
        let unoffeventsActive = this.settings.get_boolean('unoffevents-active');
        let n = 0;
        if (geventsActive)
            n += this._gregorianEvents.hasEvents(_day);
        if (peventsActive)
            n += this._persianEvents.hasEvents(_day);
        if (heventsActive)
            n += this._hijriEvents.hasEvents(_day);
        if (unoffeventsActive)
            n += this._unofficialWorldEvents.hasEvents(_day);
        return n > 0;
    }

    isHoliday(_day) {
        let answer = false;
        let geventsActive = this.settings.get_boolean('gevents-active');
        let peventsActive = this.settings.get_boolean('pevents-active');
        let heventsActive = this.settings.get_boolean('hevents-active');
        if (geventsActive)
            answer = answer || this._gregorianEvents.isHoliday(_day);
        if (peventsActive)
            answer = answer || this._persianEvents.isHoliday(_day);
        if (heventsActive)
            answer = answer || this._hijriEvents.isHoliday(_day);
        return answer;
    }
});
