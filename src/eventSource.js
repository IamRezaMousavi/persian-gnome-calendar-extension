// Abstraction for an appointment/event in a calendar
/* exported EventSource */

import GObject from 'gi://GObject';

import {
    GregorianEvents,
    PersianEvents,
    HijriEvents,
    InternationalEvents
} from './events.js';


const GREGORIAN_EVENT_ACTIVE_KEY = 'gregorian-events-active';
const PERSIAN_EVENT_ACTIVE_KEY = 'persian-events-active';
const HIJRI_EVENT_ACTIVE_KEY = 'hijri-events-active';
const INTERNATIONAL_EVENT_ACTIVE_KEY = 'international-events-active';

// Repository for appointments/events - e.g. the contents of a calendar

export const EventSource = GObject.registerClass({
    Signals: {'changed': {}},
}, class EventSource extends GObject.Object {
    _init(settings) {
        super._init();
        this.settings = settings;

        this.gregorianEventsActive = this.settings.get_boolean(GREGORIAN_EVENT_ACTIVE_KEY);
        this.persianEventsActive = this.settings.get_boolean(PERSIAN_EVENT_ACTIVE_KEY);
        this.hijriEventsActive = this.settings.get_boolean(HIJRI_EVENT_ACTIVE_KEY);
        this.internationalEventsActive = this.settings.get_boolean(INTERNATIONAL_EVENT_ACTIVE_KEY);

        this._gregorianEvents = new GregorianEvents();
        this._persianEvents = new PersianEvents();
        this._hijriEvents = new HijriEvents();
        this._InternationalEvents = new InternationalEvents();
    }

    _onSettingsChange() {
        this.gregorianEventsActive = this.settings.get_boolean(GREGORIAN_EVENT_ACTIVE_KEY);
        this.persianEventsActive = this.settings.get_boolean(PERSIAN_EVENT_ACTIVE_KEY);
        this.hijriEventsActive = this.settings.get_boolean(HIJRI_EVENT_ACTIVE_KEY);
        this.internationalEventsActive = this.settings.get_boolean(INTERNATIONAL_EVENT_ACTIVE_KEY);
    }

    getEvents(_begin, _end) {
        this._result = [];

        if (this.gregorianEventsActive) {
            let gregorianEvents = this._gregorianEvents.getEvents(_begin);
            this._result = this._result.concat(gregorianEvents);
        }

        if (this.persianEventsActive) {
            let persianEvents = this._persianEvents.getEvents(_begin);
            this._result = this._result.concat(persianEvents);
        }

        if (this.hijriEventsActive) {
            let hijriEvents = this._hijriEvents.getEvents(_begin);
            this._result = this._result.concat(hijriEvents);
        }

        if (this.internationalEventsActive) {
            let internationalEvents = this._InternationalEvents.getEvents(_begin);
            this._result = this._result.concat(internationalEvents);
        }

        return this._result;
    }

    hasEvents(_day) {
        let has = false;
        if (this.gregorianEventsActive)
            has ||= this._gregorianEvents.hasEvents(_day);
        if (this.persianEventsActive)
            has ||= this._persianEvents.hasEvents(_day);
        if (this.hijriEventsActive)
            has ||= this._hijriEvents.hasEvents(_day);
        if (this.internationalEventsActive)
            has ||= this._InternationalEvents.hasEvents(_day);
        return has;
    }

    isHoliday(_day) {
        let answer = false;
        if (this.gregorianEventsActive)
            answer ||= this._gregorianEvents.isHoliday(_day);
        if (this.persianEventsActive)
            answer ||= this._persianEvents.isHoliday(_day);
        if (this.hijriEventsActive)
            answer ||= this._hijriEvents.isHoliday(_day);
        return answer;
    }
});
