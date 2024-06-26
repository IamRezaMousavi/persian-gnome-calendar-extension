// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/* exported Calendar*/

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Shell from 'gi://Shell';
import St from 'gi://St';

import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

import {PersianDate} from './persianDate.js';
import {EventSource} from './eventSource.js';
import {getDayAccessibleName} from './utils/dateformat.js';
import {toPersianDigit} from './utils/numbers.js';

const SHOW_WEEKDATE_KEY = 'show-weekdate';
const USE_PERSIAN_WEEKDAY = 'calendar-persian-weekday';
const USE_PERSIAN_NUMBER = 'calendar-persian-number';

const NC_ = (context, str) => `${context}\u0004${str}`;

function sameYear(dateA, dateB) {
    return dateA.getPersianFullYear() === dateB.getPersianFullYear();
}

function sameMonth(dateA, dateB) {
    return sameYear(dateA, dateB) && (dateA.getPersianMonth() === dateB.getPersianMonth());
}

function sameDay(dateA, dateB) {
    return sameMonth(dateA, dateB) && (dateA.getPersianDate() === dateB.getPersianDate());
}

function _isWorkDay(date) {
    /* Translators: Enter 0-6 (Sunday-Saturday) for non-work days. Examples: "0" (Sunday) "6" (Saturday) "06" (Sunday and Saturday). */
    /* calendar-no-work */
    const days = '5';
    return !days.includes(date.getDay().toString());
}

function _getCalendarDayAbbreviation(dayNumber, isPersian) {
    let abbreviations = [
        /* Translators: Calendar grid abbreviation for Sunday.
         *
         * NOTE: These grid abbreviations are always shown together
         * and in order, e.g. "S M T W T F S".
         */
        NC_('grid sunday', 'S'),
        /* Translators: Calendar grid abbreviation for Monday */
        NC_('grid monday', 'M'),
        /* Translators: Calendar grid abbreviation for Tuesday */
        NC_('grid tuesday', 'T'),
        /* Translators: Calendar grid abbreviation for Wednesday */
        NC_('grid wednesday', 'W'),
        /* Translators: Calendar grid abbreviation for Thursday */
        NC_('grid thursday', 'T'),
        /* Translators: Calendar grid abbreviation for Friday */
        NC_('grid friday', 'F'),
        /* Translators: Calendar grid abbreviation for Saturday */
        NC_('grid saturday', 'S'),

        'ی',
        'د',
        'س',
        'چ',
        'پ',
        'ج',
        'ش',
    ];
    return isPersian ? abbreviations[dayNumber + 7] : Shell.util_translate_time_string(abbreviations[dayNumber]);
}

export const Calendar = GObject.registerClass({
    Signals: {'selected-date-changed': {param_types: [GLib.DateTime.$gtype]}},
}, class Calendar extends St.Widget {
    _init(settings) {
        // this._weekStart = Shell.util_get_week_start();
        this._weekStart = 6;

        this.settings = settings;
        this.settings.connect(`changed::${USE_PERSIAN_WEEKDAY}`, this._onSettingsChange.bind(this));
        this.settings.connect(`changed::${USE_PERSIAN_NUMBER}`, this._onSettingsChange.bind(this));
        this.usePersianWeekday = this.settings.get_boolean(USE_PERSIAN_WEEKDAY);
        this.usePersianDay = this.settings.get_boolean(USE_PERSIAN_NUMBER);

        this._settings = new Gio.Settings({schema_id: 'org.gnome.desktop.calendar'});
        this._settings.connect(`changed::${SHOW_WEEKDATE_KEY}`, this._onSettingsChange.bind(this));
        this._useWeekdate = this._settings.get_boolean(SHOW_WEEKDATE_KEY);

        /**
         * Translators: The header displaying just the month name
         * standalone, when this is a month of the current year.
         * "%OB" is the new format specifier introduced in glibc 2.27,
         * in most cases you should not change it.
         */
        this._headerFormatWithoutYear = {month: 'long'};
        /**
         * Translators: The header displaying the month name and the year
         * number, when this is a month of a different year.  You can
         * reorder the format specifiers or add other modifications
         * according to the requirements of your language.
         * "%OB" is the new format specifier introduced in glibc 2.27,
         * in most cases you should not use the old "%B" here unless you
         * absolutely know what you are doing.
         */
        this._headerFormat = {year: 'numeric', month: 'long'};

        // Start off with the current date
        this._selectedDate = new PersianDate();

        this._shouldDateGrabFocus = false;

        super._init({
            style_class: 'calendar',
            layout_manager: new Clutter.GridLayout(),
            reactive: true,
        });

        this._buildHeader();
    }

    setEventSource(_eventSource) {
        if (!(_eventSource instanceof EventSource))
            throw new Error('Event source is not valid type');

        this._eventSource = _eventSource;
        this._eventSource.connect('changed', () => {
            this._rebuildCalendar();
            this._update();
        });
        this._rebuildCalendar();
        this._update();
    }

    // Sets the calendar to show a specific date
    setDate(date) {
        if (sameDay(date, this._selectedDate))
            return;

        this._selectedDate = date;

        let datetime = GLib.DateTime.new_from_unix_local(
            this._selectedDate.getTime() / 1000);
        this.emit('selected-date-changed', datetime);

        this._update();
    }

    _buildHeader() {
        let layout = this.layout_manager;
        let offsetCols = this._useWeekdate ? 1 : 0;
        this.destroy_all_children();

        // Top line of the calendar '<| September 2009 |>'
        this._topBox = new St.BoxLayout({style_class: 'calendar-month-header'});
        layout.attach(this._topBox, 0, 0, offsetCols + 7, 1);

        this._backButton = new St.Button({
            style_class: 'calendar-change-month-back pager-button',
            icon_name: 'pan-start-symbolic',
            accessible_name: _('Previous month'),
            can_focus: true,
        });
        this._topBox.add_child(this._backButton);
        this._backButton.connect('clicked', this._onPrevMonthButtonClicked.bind(this));

        this._monthLabel = new St.Label({
            style_class: 'calendar-month-label pcalendar-month-label',
            can_focus: true,
            x_align: Clutter.ActorAlign.CENTER,
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._topBox.add_child(this._monthLabel);

        this._forwardButton = new St.Button({
            style_class: 'calendar-change-month-forward pager-button',
            icon_name: 'pan-end-symbolic',
            accessible_name: _('Next month'),
            can_focus: true,
        });
        this._topBox.add_child(this._forwardButton);
        this._forwardButton.connect('clicked', this._onNextMonthButtonClicked.bind(this));

        // Add weekday labels...
        //
        // We need to figure out the abbreviated localized names for the days of the week;
        // we do this by just getting the next 7 days starting from right now and then putting
        // them in the right cell in the table. It doesn't matter if we add them in order
        let iter = new PersianDate(this._selectedDate);
        iter.setSeconds(0);
        iter.setHours(12);
        for (let i = 0; i < 7; i++) {
            // Could use iter.toLocaleFormat('%a') but that normally gives three characters
            // and we want, ideally, a single character for e.g. S M T W T F S
            let customDayAbbrev = _getCalendarDayAbbreviation(iter.getDay(), this.usePersianWeekday);
            let label = new St.Label({
                style_class: 'calendar-day-heading',
                text: customDayAbbrev,
                can_focus: true,
            });
            label.accessible_name = getDayAccessibleName(iter);
            let col;
            if (this.get_text_direction() === Clutter.TextDirection.RTL)
                col = 6 - (7 + iter.getDay() - this._weekStart) % 7;
            else
                col = offsetCols + (7 + iter.getDay() - this._weekStart) % 7;
            layout.attach(label, col, 1, 1, 1);
            iter.setDate(iter.getDate() + 1);
        }

        // All the children after this are days, and get removed when we update the calendar
        this._firstDayIndex = this.get_n_children();
    }

    vfunc_scroll_event(event) {
        switch (event.get_scroll_direction()) {
        case Clutter.ScrollDirection.UP:
        case Clutter.ScrollDirection.LEFT:
            this._onPrevMonthButtonClicked();
            break;
        case Clutter.ScrollDirection.DOWN:
        case Clutter.ScrollDirection.RIGHT:
            this._onNextMonthButtonClicked();
            break;
        }
        return Clutter.EVENT_PROPAGATE;
    }

    _onPrevMonthButtonClicked() {
        let newDate = new PersianDate(this._selectedDate);
        let oldMonth = newDate.getMonth();
        if (oldMonth === 0) {
            newDate.setMonth(11);
            newDate.setFullYear(newDate.getFullYear() - 1);
            if (newDate.getMonth() !== 11) {
                let day = 32 - new PersianDate(newDate.getFullYear() - 1, 11, 32).getDate();
                newDate = new PersianDate(newDate.getFullYear() - 1, 11, day);
            }
        } else {
            newDate.setMonth(oldMonth - 1);
            if (newDate.getMonth() !== oldMonth - 1) {
                let day = 32 - new PersianDate(newDate.getFullYear(), oldMonth - 1, 32).getDate();
                newDate = new PersianDate(newDate.getFullYear(), oldMonth - 1, day);
            }
        }

        this._backButton.grab_key_focus();

        this.setDate(newDate);
    }

    _onNextMonthButtonClicked() {
        let newDate = new PersianDate(this._selectedDate);
        let oldMonth = newDate.getMonth();
        if (oldMonth === 11) {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
            if (newDate.getMonth() !== 0) {
                let day = 32 - new PersianDate(newDate.getFullYear() + 1, 0, 32).getDate();
                newDate = new PersianDate(newDate.getFullYear() + 1, 0, day);
            }
        } else {
            newDate.setMonth(oldMonth + 1);
            if (newDate.getMonth() !== oldMonth + 1) {
                let day = 32 - new PersianDate(newDate.getFullYear(), oldMonth + 1, 32).getDate();
                newDate = new PersianDate(newDate.getFullYear(), oldMonth + 1, day);
            }
        }

        this._forwardButton.grab_key_focus();

        this.setDate(newDate);
    }

    _onSettingsChange() {
        this.usePersianWeekday = this.settings.get_boolean(USE_PERSIAN_WEEKDAY);
        this.usePersianDay = this.settings.get_boolean(USE_PERSIAN_NUMBER);
        this._useWeekdate = this._settings.get_boolean(SHOW_WEEKDATE_KEY);
        this._buildHeader();
        this._rebuildCalendar();
        this._update();
    }

    _rebuildCalendar() {
        let now = new PersianDate();

        // Remove everything but the topBox and the weekday labels
        let children = this.get_children();
        for (let i = this._firstDayIndex; i < children.length; i++)
            children[i].destroy();

        this._buttons = [];

        // Start at the beginning of the week before the start of the month
        //
        // We want to show always 6 weeks (to keep the calendar menu at the same
        // height if there are no events), so we pad it according to the following
        // policy:
        //
        // 1 - If a month has 6 weeks, we place no padding (example: Dec 2012)
        // 2 - If a month has 5 weeks and it starts on week start, we pad one week
        //     before it (example: Apr 2012)
        // 3 - If a month has 5 weeks and it starts on any other day, we pad one week
        //     after it (example: Nov 2012)
        // 4 - If a month has 4 weeks, we pad one week before and one after it
        //     (example: Feb 2010)
        //
        // Actually computing the number of weeks is complex, but we know that the
        // problematic categories (2 and 4) always start on week start, and that
        // all months at the end have 6 weeks.
        let beginDate = new PersianDate(this._selectedDate);
        beginDate.setPersianDate(
            this._selectedDate.getPersianFullYear(),
            this._selectedDate.getPersianMonth() + 1,
            1
        );

        this._calendarBegin = new PersianDate(beginDate);
        this._markedAsToday = now;

        let daysToWeekStart = (7 + beginDate.getDay() - this._weekStart) % 7;
        let startsOnWeekStart = daysToWeekStart === 0;
        let weekPadding = startsOnWeekStart ? 7 : 0;

        beginDate.setDate(beginDate.getDate() - (weekPadding + daysToWeekStart));

        let layout = this.layout_manager;
        let iter = new PersianDate(beginDate);
        let row = 2;
        // nRows here means 6 weeks + one header + one navbar
        let nRows = 8;
        while (row < nRows) {
            let button = new St.Button({
                // xgettext:no-javascript-format
                label: this.usePersianDay
                    ? toPersianDigit(iter.getPersianDate())
                    : iter.getPersianDate().toString().replace(/\d/g, x => _(x)),
                can_focus: true,
            });
            let rtl = button.get_text_direction() === Clutter.TextDirection.RTL;

            button._date = new PersianDate(iter);
            button.connect('clicked', () => {
                this._shouldDateGrabFocus = true;
                this.setDate(button._date);
                this._shouldDateGrabFocus = false;
            });

            let hasEvents = this._eventSource.hasEvents(iter);
            let isHoliday = this._eventSource.isHoliday(iter);
            let styleClass = 'calendar-day';

            let isSameMonthWithSelected = iter.getPersianMonth() === this._selectedDate.getPersianMonth();
            if (isSameMonthWithSelected) {
                if (_isWorkDay(iter))
                    styleClass += ' calendar-weekday';
                else
                    styleClass += ' pcalendar-nonwork-day';
            }

            // Hack used in lieu of border-collapse - see gnome-shell.css
            if (row === 2)
                styleClass = `calendar-day-top ${styleClass}`;

            let leftMost = rtl
                ? iter.getDay() === (this._weekStart + 6) % 7
                : iter.getDay() === this._weekStart;
            if (leftMost)
                styleClass = `calendar-day-left ${styleClass}`;

            if (sameDay(now, iter))
                styleClass += ' calendar-today';
            else if (!isSameMonthWithSelected)
                styleClass += ' calendar-other-month';

            if (hasEvents)
                styleClass += ' calendar-day-with-events';

            if (isHoliday) {
                if (isSameMonthWithSelected)
                    styleClass += ' pcalendar-nonwork-day';
                else
                    styleClass += ' pcalendar-other-month-nonwork-day';
            }

            button.style_class = styleClass;

            let offsetCols = this._useWeekdate ? 1 : 0;
            let col;
            if (rtl)
                col = 6 - (7 + iter.getDay() - this._weekStart) % 7;
            else
                col = offsetCols + (7 + iter.getDay() - this._weekStart) % 7;
            layout.attach(button, col, row, 1, 1);

            this._buttons.push(button);

            iter.setDate(iter.getDate() + 1);

            if (iter.getDay() === this._weekStart)
                row++;
        }
    }

    _update() {
        let now = new PersianDate();

        if (sameYear(this._selectedDate, now))
            this._monthLabel.text = this._selectedDate.toPersianString(this._headerFormatWithoutYear);
        else
            this._monthLabel.text = this._selectedDate.toPersianString(this._headerFormat);

        if (!this._calendarBegin || !sameMonth(this._selectedDate, this._calendarBegin) || !sameDay(now, this._markedAsToday))
            this._rebuildCalendar();

        this._buttons.forEach(button => {
            if (sameDay(button._date, this._selectedDate)) {
                button.add_style_pseudo_class('selected');
                if (this._shouldDateGrabFocus)
                    button.grab_key_focus();
            } else {
                button.remove_style_pseudo_class('selected');
            }
        });
    }
});
