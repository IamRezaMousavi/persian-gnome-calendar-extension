// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/* exported DateMenuButton */

const {
    Clutter, Gio, GLib, GnomeDesktop,
    GObject, Pango, Shell, St,
} = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const {calendar, persianDate, hijriDate, eventSource} = Me.imports;
const Calendar = calendar.Calendar;
const EventSource = eventSource.EventSource;
const PersianDate = persianDate.PersianDate;

function _isToday(date) {
    let now = new PersianDate();
    return now.getYear() == date.getYear() &&
           now.getMonth() == date.getMonth() &&
           now.getDate() == date.getDate();
}

function _gDateTimeToDate(datetime) {
    return new PersianDate(datetime.to_unix() * 1000 + datetime.get_microsecond() / 1000);
}

var TodayButton = GObject.registerClass(
class TodayButton extends St.Button {
    _init(calendar) {
        // Having the ability to go to the current date if the user is already
        // on the current date can be confusing. So don't make the button reactive
        // until the selected date changes.
        super._init({
            style_class: 'datemenu-today-button',
            x_expand: true,
            can_focus: true,
            reactive: false,
        });

        let hbox = new St.BoxLayout({ vertical: true });
        this.add_actor(hbox);

        this._dayLabel = new St.Label({
            style_class: 'day-label pday-label'
        });
        hbox.add_actor(this._dayLabel);

        this._dateLabel = new St.Label({ style_class: 'date-label pdate-label' });
        hbox.add_actor(this._dateLabel);

        this._calendar = calendar;
        this._calendar.connect('selected-date-changed', (_calendar, datetime) => {
            // Make the button reactive only if the selected date is not the
            // current date.
            this.reactive = !_isToday(_gDateTimeToDate(datetime));
        });
    }

    vfunc_clicked() {
        this._calendar.setDate(new PersianDate(), false);
    }

    setDate(date) {
        this._dayLabel.set_text(date.toPersianString({weekday: 'long'}));

        /* Translators: This is the date format to use when the calendar popup is
         * shown - it is shown just below the time in the top bar (e.g.,
         * "Tue 9:29 AM").  The string itself should become a full date, e.g.,
         * "February 17 2015".
         */
        // let dateFormat = Shell.util_translate_time_string(N_("%B %-d %Y"));
        let dateFormat = {month: 'long', day: 'numeric', year: 'numeric'};
        this._dateLabel.set_text(date.toPersianString(dateFormat));

        /* Translators: This is the accessible name of the date button shown
         * below the time in the shell; it should combine the weekday and the
         * date, e.g. "Tuesday February 17 2015".
         */
        dateFormat = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'};
        this.accessible_name = date.toPersianString(dateFormat);
    }
});

var EventsSection = GObject.registerClass(
class EventsSection extends St.Button {
    _init() {
        super._init({
            style_class: 'events-button',
            can_focus: true,
            x_expand: true,
            child: new St.BoxLayout({
                style_class: 'events-box',
                vertical: true,
                x_expand: true,
            }),
        });

        this._startDate = null;
        this._endDate = null;

        this._eventSource = null;
        this._calendarApp = null;

        this._title = new St.Label({
            style_class: 'pevents-title',
        });
        this.child.add_child(this._title);

        this._eventsList = new St.BoxLayout({
            style_class: 'events-list',
            vertical: true,
            x_expand: true,
        });
        this.child.add_child(this._eventsList);

        this._appSys = Shell.AppSystem.get_default();
        this._appSys.connect('installed-changed',
            this._appInstalledChanged.bind(this));
        this._appInstalledChanged();
    }

    setDate(date) {
        this._startDate =
            new PersianDate(date.getFullYear(), date.getMonth(), date.getDate());
        this._endDate =
            new PersianDate(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        this._updateTitle();
        this._reloadEvents();
    }

    setEventSource(eventSource) {
        if (!(eventSource instanceof EventSource))
            throw new Error('Event source is not valid type');

        this._eventSource = eventSource;
    }

    _updateTitle() {
        /* Translators: Shown on calendar heading when selected day occurs on current year */
        const sameYearFormat = {month: 'long', day: 'numeric'};

        /* Translators: Shown on calendar heading when selected day occurs on different year */
        const otherYearFormat = {month: 'long', day: 'numeric', year: 'numeric'};

        const timeSpanDay = GLib.TIME_SPAN_DAY / 1000;
        const now = new PersianDate();

        if (this._startDate <= now && now < this._endDate)
            this._title.text = _('امروز');
        else if (this._endDate <= now && now - this._endDate < timeSpanDay)
            this._title.text = _('دیروز');
        else if (this._startDate > now && this._startDate - now <= timeSpanDay)
            this._title.text = _('فردا');
        else if (this._startDate.getPersianYear() === now.getPersianYear())
            this._title.text = this._startDate.toPersianString(sameYearFormat);
        else
            this._title.text = this._startDate.toPersianString(otherYearFormat);
    }

    _reloadEvents() {
        [...this._eventsList].forEach(c => c.destroy());
        const events =
            this._eventSource.getEvents(this._startDate, this._endDate);

        for (let event of events) {
            const box = new St.BoxLayout({
                style_class: 'event-box',
                vertical: true,
            });

            let pstyle = 'pevent-summary';
            if (event.isHoliday)
                pstyle += ' pevent-summary-holyday';

            box.add(new St.Label({
                text: event.summary,
                style_class: pstyle,
            }));
            
            this._eventsList.add_child(box);
        }
        
        if (this._eventsList.get_n_children() === 0) {
            const placeholder = new St.Label({
                text: _('بدون رویداد'),
                style_class: 'event-placeholder pevent-placeholder',
            });
            this._eventsList.add_child(placeholder);
        }
    }

    vfunc_clicked() {
        Main.overview.hide();
        Main.panel.closeCalendar();

        const appInfo = this._calendarApp;
        const context = global.create_app_launch_context(0, -1);
        if (appInfo.get_id() === 'org.gnome.Evolution.desktop')
            appInfo.launch_action('calendar', context);
        else
            appInfo.launch([], context);
    }

    _appInstalledChanged() {
        const apps = Gio.AppInfo.get_recommended_for_type('text/calendar');
        if (apps && (apps.length > 0)) {
            const app = Gio.AppInfo.get_default_for_type('text/calendar', false);
            const defaultInRecommended = apps.some(a => a.equal(app));
            this._calendarApp = defaultInRecommended ? app : apps[0];
        } else {
            this._calendarApp = null;
        }
    }
});

var CalendarColumnLayout = GObject.registerClass(
class CalendarColumnLayout extends Clutter.BoxLayout {
    _init(actors) {
        super._init({ orientation: Clutter.Orientation.VERTICAL });
        this._colActors = actors;
    }

    vfunc_get_preferred_width(container, forHeight) {
        const actors =
            this._colActors.filter(a => a.get_parent() === container);
        if (actors.length === 0)
            return super.vfunc_get_preferred_width(container, forHeight);
        return actors.reduce(([minAcc, natAcc], child) => {
            const [min, nat] = child.get_preferred_width(forHeight);
            return [Math.max(minAcc, min), Math.max(natAcc, nat)];
        }, [0, 0]);
    }
});

var DateMenuButton = GObject.registerClass(
class DateMenuButton extends PanelMenu.Button {
    _init() {
        let hbox;

        super._init(0.5);

        this._calendarDisplay = new St.Label({ style_class: 'clock' });
        this._calendarDisplay.clutter_text.y_align = Clutter.ActorAlign.CENTER;
        this._calendarDisplay.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;

        let box = new St.BoxLayout({ style_class: 'clock-display-box' });
        box.add_actor(this._calendarDisplay);
        this.label_actor = this._calendarDisplay;
        this.add_actor(box);
        this.add_style_class_name('clock-display');

        let layout = new Clutter.BinLayout();
        let bin = new St.Widget({ layout_manager: layout });
        // For some minimal compatibility with PopupMenuItem
        bin._delegate = this;
        this.menu.box.add_child(bin);

        hbox = new St.BoxLayout({ name: 'calendarArea' });
        bin.add_actor(hbox);

        this._calendar = new Calendar();
        this._calendar.connect('selected-date-changed', (_calendar, datetime) => {
            let date = _gDateTimeToDate(datetime);
            this._eventsItem.setDate(date);
        });
        this._date = new TodayButton(this._calendar);

        this.menu.connect('open-state-changed', (menu, isOpen) => {
            // Whenever the menu is opened, select today
            if (isOpen) {
                let now = new PersianDate();
                this._calendar.setDate(now);
                this._date.setDate(now);
                this._eventsItem.setDate(now);
            }
        });

        // Fill up the second column
        const boxLayout = new CalendarColumnLayout([this._calendar, this._date]);
        const vbox = new St.Widget({
            style_class: 'datemenu-calendar-column',
            layout_manager: boxLayout,
        });
        boxLayout.hookup_style(vbox);
        hbox.add(vbox);

        vbox.add_actor(this._date);
        vbox.add_actor(this._calendar);

        this._displaysSection = new St.ScrollView({
            style_class: 'datemenu-displays-section vfade',
            x_expand: true,
            overlay_scrollbars: true,
        });
        this._displaysSection.set_policy(St.PolicyType.NEVER, St.PolicyType.EXTERNAL);
        vbox.add_actor(this._displaysSection);

        const displaysBox = new St.BoxLayout({
            vertical: true,
            x_expand: true,
            style_class: 'datemenu-displays-box',
        });
        this._displaysSection.add_actor(displaysBox);

        this._eventsItem = new EventsSection();
        displaysBox.add_child(this._eventsItem);

        // Done with hbox for calendar and event list

        this._updateCalendarDisplay();
        this._clock = new GnomeDesktop.WallClock();
        this._clock.connect('notify::clock', this._updateCalendarDisplay.bind(this));

        this._setEventSource(new EventSource());
    }

    _getEventSource() {
        return new EventSource();
    }

    _setEventSource(eventSource) {
        if (this._eventSource)
            this._eventSource.destroy();

        this._calendar.setEventSource(eventSource);
        this._eventsItem.setEventSource(eventSource);

        this._eventSource = eventSource;
    }
    _updateCalendarDisplay() {
        let Display_Format = {day: 'numeric', month: 'long', year: 'numeric'};
        let date = new PersianDate().toPersianString(Display_Format);
        this._calendarDisplay.set_text(date);
    }
});