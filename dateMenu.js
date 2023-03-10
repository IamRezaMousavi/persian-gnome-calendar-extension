// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/* exported DateMenuButton */

const {
    Clutter, Gio, GLib, GnomeDesktop,
    GObject, Pango, Shell, St,
} = imports.gi;

const Util = imports.misc.util;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const System = imports.system;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const {calendar, persianDate, hijriDate, eventSource} = Me.imports;
const Calendar = calendar.Calendar;
const EventSource = eventSource.EventSource;
const PersianDate = persianDate.PersianDate;

const NC_ = (context, str) => `${context}\u0004${str}`;
const T_ = Shell.util_translate_time_string;

const EN_CHAR = '\u2013';

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
        this._eventSource.connect('changed', this._reloadEvents.bind(this));
        this._eventSource.connect('notify::has-calendars',
            this._sync.bind(this));
        this._sync();
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
        /*
        if (this._eventSource.isLoading || this._reloading)
            return;

        */
        this._reloading = true;

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

        this._reloading = false;
        this._sync();
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

        return this._sync();
    }

    _sync() {
        this.visible = this._eventSource && this._eventSource.hasCalendars;
        this.reactive = this._calendarApp !== null;
    }
});



var MessagesIndicator = GObject.registerClass(
class MessagesIndicator extends St.Icon {
    _init() {
        super._init({
            icon_size: 16,
            visible: false,
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });

        this._sources = [];
        this._count = 0;

        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.desktop.notifications',
        });
        this._settings.connect('changed::show-banners', this._sync.bind(this));

        Main.messageTray.connect('source-added', this._onSourceAdded.bind(this));
        Main.messageTray.connect('source-removed', this._onSourceRemoved.bind(this));
        Main.messageTray.connect('queue-changed', this._updateCount.bind(this));

        let sources = Main.messageTray.getSources();
        sources.forEach(source => this._onSourceAdded(null, source));

        this._sync();

        this.connect('destroy', () => {
            this._settings.run_dispose();
            this._settings = null;
        });
    }

    _onSourceAdded(tray, source) {
        source.connect('notify::count', this._updateCount.bind(this));
        this._sources.push(source);
        this._updateCount();
    }

    _onSourceRemoved(tray, source) {
        this._sources.splice(this._sources.indexOf(source), 1);
        this._updateCount();
    }

    _updateCount() {
        let count = 0;
        this._sources.forEach(source => (count += source.unseenCount));
        this._count = count - Main.messageTray.queueCount;

        this._sync();
    }

    _sync() {
        let doNotDisturb = !this._settings.get_boolean('show-banners');
        this.icon_name = doNotDisturb
            ? 'notifications-disabled-symbolic'
            : 'message-indicator-symbolic';
        this.visible = doNotDisturb || this._count > 0;
    }
});

var FreezableBinLayout = GObject.registerClass(
class FreezableBinLayout extends Clutter.BinLayout {
    _init() {
        super._init();

        this._frozen = false;
        this._savedWidth = [NaN, NaN];
        this._savedHeight = [NaN, NaN];
    }

    set frozen(v) {
        this.layout_changed();
    }

    vfunc_get_preferred_width(container, forHeight) {
        if (!this._frozen || this._savedWidth.some(isNaN))
            return super.vfunc_get_preferred_width(container, forHeight);
        return this._savedWidth;
    }

    vfunc_get_preferred_height(container, forWidth) {
        if (!this._frozen || this._savedHeight.some(isNaN))
            return super.vfunc_get_preferred_height(container, forWidth);
        return this._savedHeight;
    }

    vfunc_allocate(container, allocation) {
        super.vfunc_allocate(container, allocation);

        let [width, height] = allocation.get_size();
        this._savedWidth = [width, width];
        this._savedHeight = [height, height];
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

        this._indicator = new MessagesIndicator();

        const indicatorPad = new St.Widget();
        this._indicator.bind_property('visible',
            indicatorPad, 'visible',
            GObject.BindingFlags.SYNC_CREATE);
        indicatorPad.add_constraint(new Clutter.BindConstraint({
            source: this._indicator,
            coordinate: Clutter.BindCoordinate.SIZE,
        }));

        let box = new St.BoxLayout({ style_class: 'clock-display-box' });
        box.add_actor(indicatorPad);
        box.add_actor(this._calendarDisplay);
        box.add_actor(this._indicator);

        this.label_actor = this._calendarDisplay;
        this.add_actor(box);
        this.add_style_class_name('clock-display');

        let layout = new FreezableBinLayout();
        let bin = new St.Widget({ layout_manager: layout });
        // For some minimal compatibility with PopupMenuItem
        bin._delegate = this;
        this.menu.box.add_child(bin);

        hbox = new St.BoxLayout({ name: 'calendarArea' });
        bin.add_actor(hbox);

        this._calendar = new Calendar();
        this._calendar.connect('selected-date-changed', (_calendar, datetime) => {
            let date = _gDateTimeToDate(datetime);
            // layout.frozen = !_isToday(date);
            layout.frozen = false;
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

        Main.sessionMode.connect('updated', this._sessionUpdated.bind(this));
        this._sessionUpdated();
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
    _updateTimeZone() {
        // SpiderMonkey caches the time zone so we must explicitly clear it
        // before we can update the calendar, see
        // https://bugzilla.gnome.org/show_bug.cgi?id=678507
        System.clearDateCaches();

        this._calendar.updateTimeZone();
    }

    _sessionUpdated() {
        let eventSource = this._getEventSource();
        this._setEventSource(eventSource);

        // Displays are not actually expected to launch Settings when activated
        // but the corresponding app (clocks, weather); however we can consider
        // that display-specific settings, so re-use "allowSettings" here ...
        this._displaysSection.visible = Main.sessionMode.allowSettings;
    }
});