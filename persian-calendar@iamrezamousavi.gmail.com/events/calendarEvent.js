// Interface for Calendar Events
/* exported CalendarEvent, CalendarEvents */

var CalendarEvent = class CalendarEvent {
    constructor(summary, isHoliday) {
        this.isHoliday = isHoliday;
        this.summary = summary;
    }
};

var CalendarEvents = class CalendarEvents {
    constructor() {
        this._events = new Map();
    }

    getEvents(day) {
        let events = this._events.get(`${day.getMonth() + 1}-${day.getDate()}`);
        if (Array.isArray(events))
            return events;
        return [];
    }

    hasEvents(day) {
        let events = this.getEvents(day);
        return events.length !== 0;
    }

    isHoliday(day) {
        let events = this.getEvents(day);
        for (let i = 0; i < events.length; i++) {
            if (events[i].isHoliday)
                return true;
        }
        return false;
    }
};
