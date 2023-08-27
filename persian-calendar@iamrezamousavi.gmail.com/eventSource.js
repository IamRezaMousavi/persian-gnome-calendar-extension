// Abstraction for an appointment/event in a calendar

import GObject from 'gi://GObject';

import {
    GregorianEvents,
    PersianEvents,
    HijriEvents,
    UnofficialWorldEvents
} from './events.js';


// Interface for appointments/events - e.g. the contents of a calendar

export const EventSource = GObject.registerClass({
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

        let gregorianEventsActive = this.settings.get_boolean('gregorian-events-active');
        if (gregorianEventsActive) {
            let gregorianEvents = this._gregorianEvents.getEvents(_begin);
            this._result = this._result.concat(gregorianEvents);
        }

        let persianEventsActive = this.settings.get_boolean('persian-events-active');
        if (persianEventsActive) {
            let persianEvents = this._persianEvents.getEvents(_begin);
            this._result = this._result.concat(persianEvents);
        }

        let hijriEventsActive = this.settings.get_boolean('hijri-events-active');
        if (hijriEventsActive) {
            let hijriEvents = this._hijriEvents.getEvents(_begin);
            this._result = this._result.concat(hijriEvents);
        }

        let unofficialEventsActive = this.settings.get_boolean('unofficial-events-active');
        if (unofficialEventsActive) {
            let unofficialEvents = this._unofficialWorldEvents.getEvents(_begin);
            this._result = this._result.concat(unofficialEvents);
        }

        return this._result;
    }

    hasEvents(_day) {
        let gregorianEventsActive = this.settings.get_boolean('gregorian-events-active');
        let persianEventsActive = this.settings.get_boolean('persian-events-active');
        let hijriEventsActive = this.settings.get_boolean('hijri-events-active');
        let unofficialEventsActive = this.settings.get_boolean('unofficial-events-active');
        let has = false;
        if (gregorianEventsActive)
            has ||= this._gregorianEvents.hasEvents(_day);
        if (persianEventsActive)
            has ||= this._persianEvents.hasEvents(_day);
        if (hijriEventsActive)
            has ||= this._hijriEvents.hasEvents(_day);
        if (unofficialEventsActive)
            has ||= this._unofficialWorldEvents.hasEvents(_day);
        return has;
    }

    isHoliday(_day) {
        let answer = false;
        let gregorianEventsActive = this.settings.get_boolean('gregorian-events-active');
        let persianEventsActive = this.settings.get_boolean('persian-events-active');
        let hijriEventsActive = this.settings.get_boolean('hijri-events-active');
        if (gregorianEventsActive)
            answer ||= this._gregorianEvents.isHoliday(_day);
        if (persianEventsActive)
            answer ||= this._persianEvents.isHoliday(_day);
        if (hijriEventsActive)
            answer ||= this._hijriEvents.isHoliday(_day);
        return answer;
    }
});
