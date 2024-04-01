/* exported init, fillPreferencesWindow */

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class PersianCalendarPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // Create a preferences page and group
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup();
        page.add(group);

        // Create a new preferences row
        const row = new Adw.ActionRow({title: 'Show Extension Indicator'});
        group.add(row);


        // Create the switch and bind its value to the `show-indicator` key
        const toggle = new Gtk.Switch({
            active: settings.get_boolean('show-indicator'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'show-indicator',
            toggle,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        // Add the switch to the row
        row.add_suffix(toggle);
        row.activatable_widget = toggle;

        const posRow = new Adw.ActionRow({title: 'Position'});
        group.add(posRow);

        const pos = new Gtk.ComboBoxText({
            active: settings.get_string('position'),
        });
        pos.append('left', 'left');
        pos.append('center', 'center');
        pos.append('right', 'right');
        settings.bind('position', pos, 'active-id', Gio.SettingsBindFlags.DEFAULT);

        const item = new Gtk.SpinButton();
        let adjustment = new Gtk.Adjustment();
        adjustment.set_lower(-99);
        adjustment.set_upper(99);
        adjustment.set_step_increment(1);
        item.set_adjustment(adjustment);
        item.set_value(settings.get_int('index'));
        settings.bind('index', item, 'value', Gio.SettingsBindFlags.DEFAULT);

        posRow.add_suffix(pos);
        posRow.add_suffix(item);

        const formatRow = new Adw.ActionRow({title: 'Panel Date Format'});
        group.add(formatRow);

        const format = new Gtk.Entry();
        format.set_text(settings.get_string('panel-format'));
        format.connect('changed', innerFormat => {
            settings.set_string('panel-format', innerFormat.text);
        });
        formatRow.add_suffix(format);

        const toPersianRow = new Adw.ActionRow({title: 'Use Persian Digit'});
        group.add(toPersianRow);

        const toPersian = new Gtk.Switch({
            active: settings.get_boolean('top-panel-persian-number'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'top-panel-persian-number',
            toPersian,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        toPersianRow.add_suffix(toPersian);
        toPersianRow.activatable_widget = toPersian;

        const persianWeekdayRow = new Adw.ActionRow({title: 'Use Persian Weekday'});
        group.add(persianWeekdayRow);

        const persianWeekday = new Gtk.Switch({
            active: settings.get_boolean('calendar-weekday-persian-number'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'calendar-weekday-persian-number',
            persianWeekday,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        persianWeekdayRow.add_suffix(persianWeekday);
        persianWeekdayRow.activatable_widget = persianWeekday;

        const persianCalDayRow = new Adw.ActionRow({title: 'Use Persian Number in Calendar'});
        group.add(persianCalDayRow);

        const persianCalDay = new Gtk.Switch({
            active: settings.get_boolean('calendar-day-persian-number'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'calendar-day-persian-number',
            persianCalDay,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        persianCalDayRow.add_suffix(persianCalDay);
        persianCalDayRow.activatable_widget = persianCalDay;

        // Event Switchs
        const gregorianEventsRow = new Adw.ActionRow({title: 'Show Gregorian Events'});
        group.add(gregorianEventsRow);

        const gregorianEvents = new Gtk.Switch({
            active: settings.get_boolean('gregorian-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'gregorian-events-active',
            gregorianEvents,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        gregorianEventsRow.add_suffix(gregorianEvents);
        gregorianEventsRow.activatable_widget = gregorianEvents;

        const persianEventRow = new Adw.ActionRow({title: 'Show Persian Events'});
        group.add(persianEventRow);

        const persianEvents = new Gtk.Switch({
            active: settings.get_boolean('persian-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'persian-events-active',
            persianEvents,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        persianEventRow.add_suffix(persianEvents);
        persianEventRow.activatable_widget = persianEvents;

        const hijriEventsRow = new Adw.ActionRow({title: 'Show Hijri Events'});
        group.add(hijriEventsRow);

        const hijriEvents = new Gtk.Switch({
            active: settings.get_boolean('hijri-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'hijri-events-active',
            hijriEvents,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        hijriEventsRow.add_suffix(hijriEvents);
        hijriEventsRow.activatable_widget = hijriEvents;

        const unofficialEventRow = new Adw.ActionRow({title: 'Show Unofficial World Events'});
        group.add(unofficialEventRow);

        const unofficialEvents = new Gtk.Switch({
            active: settings.get_boolean('unofficial-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'unofficial-events-active',
            unofficialEvents,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        unofficialEventRow.add_suffix(unofficialEvents);
        unofficialEventRow.activatable_widget = unofficialEvents;

        // Add our page to the window
        window.add(page);
    }
}
