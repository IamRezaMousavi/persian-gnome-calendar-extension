// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/* exported Calendar*/

const { Clutter, Gio, GLib, GObject, Shell, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const EventSource = Me.imports.eventSource;

var SHOW_WEEKDATE_KEY = 'show-weekdate';

var NC_ = (context, str) => `${context}\u0004${str}`;

function sameYear(dateA, dateB) {
    return dateA.getYear() == dateB.getYear();
}

function sameMonth(dateA, dateB) {
    return sameYear(dateA, dateB) && (dateA.getMonth() == dateB.getMonth());
}

function sameDay(dateA, dateB) {
    return sameMonth(dateA, dateB) && (dateA.getDate() == dateB.getDate());
}

function _isWorkDay(date) {
    /* Translators: Enter 0-6 (Sunday-Saturday) for non-work days. Examples: "0" (Sunday) "6" (Saturday) "06" (Sunday and Saturday). */
    let days = C_('calendar-no-work', "5");
    return !days.includes(date.getDay().toString());
}

function _getCalendarDayAbbreviation(dayNumber) {
    let abbreviations = [
        /* Translators: Calendar grid abbreviation for Sunday.
         *
         * NOTE: These grid abbreviations are always shown together
         * and in order, e.g. "S M T W T F S".
         */
        NC_("grid sunday", "S"),
        /* Translators: Calendar grid abbreviation for Monday */
        NC_("grid monday", "M"),
        /* Translators: Calendar grid abbreviation for Tuesday */
        NC_("grid tuesday", "T"),
        /* Translators: Calendar grid abbreviation for Wednesday */
        NC_("grid wednesday", "W"),
        /* Translators: Calendar grid abbreviation for Thursday */
        NC_("grid thursday", "T"),
        /* Translators: Calendar grid abbreviation for Friday */
        NC_("grid friday", "F"),
        /* Translators: Calendar grid abbreviation for Saturday */
        NC_("grid saturday", "S"),
    ];
    return Shell.util_translate_time_string(abbreviations[dayNumber]);
}

var Calendar = GObject.registerClass({
    Signals: { 'selected-date-changed': { param_types: [GLib.DateTime.$gtype] } },
}, class Calendar extends St.Widget {
    _init() {
        // this._weekStart = Shell.util_get_week_start();
        this._weekStart = 6;
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.calendar' });

        this._settings.connect(`changed::${SHOW_WEEKDATE_KEY}`, this._onSettingsChange.bind(this));
        this._useWeekdate = this._settings.get_boolean(SHOW_WEEKDATE_KEY);

        /**
         * Translators: The header displaying just the month name
         * standalone, when this is a month of the current year.
         * "%OB" is the new format specifier introduced in glibc 2.27,
         * in most cases you should not change it.
         */
        this._headerFormatWithoutYear = _('%OB');
        /**
         * Translators: The header displaying the month name and the year
         * number, when this is a month of a different year.  You can
         * reorder the format specifiers or add other modifications
         * according to the requirements of your language.
         * "%OB" is the new format specifier introduced in glibc 2.27,
         * in most cases you should not use the old "%B" here unless you
         * absolutely know what you are doing.
         */
        this._headerFormat = _('%OB %Y');

        // Start off with the current date
        this._selectedDate = new Date();

        this._shouldDateGrabFocus = false;

        super._init({
            style_class: 'calendar',
            layout_manager: new Clutter.GridLayout(),
            reactive: true,
        });

        this._buildHeader();
    }

    setEventSource(eventSource) {
        if (!(eventSource instanceof EventSource.EventSource))
            throw new Error('Event source is not valid type');

        this._eventSource = eventSource;
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
        this._update();

        let datetime = GLib.DateTime.new_from_unix_local(
            this._selectedDate.getTime() / 1000);
        this.emit('selected-date-changed', datetime);
    }

    updateTimeZone() {
        // The calendar need to be rebuilt after a time zone update because
        // the date might have changed.
        this._rebuildCalendar();
        this._update();
    }

    _buildHeader() {
        let layout = this.layout_manager;
        let offsetCols = this._useWeekdate ? 1 : 0;
        this.destroy_all_children();

        // Top line of the calendar '<| September 2009 |>'
        this._topBox = new St.BoxLayout({ style_class: 'calendar-month-header' });
        layout.attach(this._topBox, 0, 0, offsetCols + 7, 1);

        this._backButton = new St.Button({
            style_class: 'calendar-change-month-back pager-button',
            icon_name: 'pan-start-symbolic',
            accessible_name: _('Previous month'),
            can_focus: true,
        });
        this._topBox.add(this._backButton);
        this._backButton.connect('clicked', this._onPrevMonthButtonClicked.bind(this));

        this._monthLabel = new St.Label({
            style_class: 'calendar-month-label',
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
        this._topBox.add(this._forwardButton);
        this._forwardButton.connect('clicked', this._onNextMonthButtonClicked.bind(this));

        // Add weekday labels...
        //
        // We need to figure out the abbreviated localized names for the days of the week;
        // we do this by just getting the next 7 days starting from right now and then putting
        // them in the right cell in the table. It doesn't matter if we add them in order
        let iter = new Date(this._selectedDate);
        iter.setSeconds(0); // Leap second protection. Hah!
        iter.setHours(12);
        for (let i = 0; i < 7; i++) {
            // Could use iter.toLocaleFormat('%a') but that normally gives three characters
            // and we want, ideally, a single character for e.g. S M T W T F S
            let customDayAbbrev = _getCalendarDayAbbreviation(iter.getDay());
            let label = new St.Label({
                style_class: 'calendar-day-base calendar-day-heading',
                text: customDayAbbrev,
                can_focus: true,
            });
            label.accessible_name = iter.toLocaleFormat('%A');
            let col;
            if (this.get_text_direction() == Clutter.TextDirection.RTL)
                col = 6 - (7 + iter.getDay() - this._weekStart) % 7;
            else
                col = offsetCols + (7 + iter.getDay() - this._weekStart) % 7;
            layout.attach(label, col, 1, 1, 1);
            iter.setDate(iter.getDate() + 1);
        }

        // All the children after this are days, and get removed when we update the calendar
        this._firstDayIndex = this.get_n_children();
    }

    vfunc_scroll_event(scrollEvent) {
        switch (scrollEvent.direction) {
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
        let newDate = new Date(this._selectedDate);
        let oldMonth = newDate.getMonth();
        if (oldMonth == 0) {
            newDate.setMonth(11);
            newDate.setFullYear(newDate.getFullYear() - 1);
            if (newDate.getMonth() != 11) {
                let day = 32 - new Date(newDate.getFullYear() - 1, 11, 32).getDate();
                newDate = new Date(newDate.getFullYear() - 1, 11, day);
            }
        } else {
            newDate.setMonth(oldMonth - 1);
            if (newDate.getMonth() != oldMonth - 1) {
                let day = 32 - new Date(newDate.getFullYear(), oldMonth - 1, 32).getDate();
                newDate = new Date(newDate.getFullYear(), oldMonth - 1, day);
            }
        }

        this._backButton.grab_key_focus();

        this.setDate(newDate);
    }

    _onNextMonthButtonClicked() {
        let newDate = new Date(this._selectedDate);
        let oldMonth = newDate.getMonth();
        if (oldMonth == 11) {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
            if (newDate.getMonth() != 0) {
                let day = 32 - new Date(newDate.getFullYear() + 1, 0, 32).getDate();
                newDate = new Date(newDate.getFullYear() + 1, 0, day);
            }
        } else {
            newDate.setMonth(oldMonth + 1);
            if (newDate.getMonth() != oldMonth + 1) {
                let day = 32 - new Date(newDate.getFullYear(), oldMonth + 1, 32).getDate();
                newDate = new Date(newDate.getFullYear(), oldMonth + 1, day);
            }
        }

        this._forwardButton.grab_key_focus();

        this.setDate(newDate);
    }

    _onSettingsChange() {
        this._useWeekdate = this._settings.get_boolean(SHOW_WEEKDATE_KEY);
        this._buildHeader();
        this._rebuildCalendar();
        this._update();
    }

    _rebuildCalendar() {
        let now = new Date();

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
        let beginDate = new Date(
            this._selectedDate.getFullYear(), this._selectedDate.getMonth(), 1);

        this._calendarBegin = new Date(beginDate);
        this._markedAsToday = now;

        let daysToWeekStart = (7 + beginDate.getDay() - this._weekStart) % 7;
        let startsOnWeekStart = daysToWeekStart == 0;
        let weekPadding = startsOnWeekStart ? 7 : 0;

        beginDate.setDate(beginDate.getDate() - (weekPadding + daysToWeekStart));

        let layout = this.layout_manager;
        let iter = new Date(beginDate);
        let row = 2;
        // nRows here means 6 weeks + one header + one navbar
        let nRows = 8;
        while (row < nRows) {
            let button = new St.Button({
                // xgettext:no-javascript-format
                label: iter.toLocaleFormat(C_('date day number format', '%d')),
                can_focus: true,
            });
            let rtl = button.get_text_direction() == Clutter.TextDirection.RTL;

            button._date = new Date(iter);
            button.connect('clicked', () => {
                this._shouldDateGrabFocus = true;
                this.setDate(button._date);
                this._shouldDateGrabFocus = false;
            });

            let hasEvents = this._eventSource.hasEvents(iter);
            let isHoliday = this._eventSource.isHoliday(iter);
            let styleClass = 'calendar-day-base calendar-day';

            let isSameMonthWithSelected = iter.getMonth() == this._selectedDate.getMonth();
            if (isSameMonthWithSelected) {
                if (_isWorkDay(iter))
                    styleClass += ' calendar-work-day';
                else
                    styleClass += ' pcalendar-nonwork-day';
            }
            // Hack used in lieu of border-collapse - see gnome-shell.css
            if (row == 2)
                styleClass = `calendar-day-top ${styleClass}`;

            let leftMost = rtl
                ? iter.getDay() == (this._weekStart + 6) % 7
                : iter.getDay() == this._weekStart;
            if (leftMost)
                styleClass = `calendar-day-left ${styleClass}`;

            if (sameDay(now, iter))
                styleClass += ' calendar-today';
            else if (!isSameMonthWithSelected)
                styleClass += ' calendar-other-month-day';

            if (hasEvents)
                styleClass += ' calendar-day-with-events';
            
            if (isHoliday)
                if (isSameMonthWithSelected)
                    styleClass += ' pcalendar-nonwork-day';
                else
                    styleClass += ' pcalendar-other-month-nonwork-day';

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

            if (iter.getDay() == this._weekStart)
                row++;
        }

        // Signal to the event source that we are interested in events
        // only from this date range
        this._eventSource.requestRange(beginDate, iter);
    }

    _update() {
        let now = new Date();

        if (sameYear(this._selectedDate, now))
            this._monthLabel.text = this._selectedDate.toLocaleFormat(this._headerFormatWithoutYear);
        else
            this._monthLabel.text = this._selectedDate.toLocaleFormat(this._headerFormat);

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
