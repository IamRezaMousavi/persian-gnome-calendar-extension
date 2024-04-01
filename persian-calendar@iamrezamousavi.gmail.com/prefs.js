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


        /** ********* Indicator Settings **************/

        const indicatorGroup = new Adw.PreferencesGroup();
        page.add(indicatorGroup);

        // Create a new preferences row
        const showIndicatorRow = new Adw.ActionRow({title: 'Show Extension Indicator'});
        indicatorGroup.add(showIndicatorRow);


        // Create the switch and bind its value to the `show-indicator` key
        const showIndicatorSwitch = new Gtk.Switch({
            active: settings.get_boolean('show-indicator'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'show-indicator',
            showIndicatorSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        // Add the switch to the row
        showIndicatorRow.add_suffix(showIndicatorSwitch);
        showIndicatorRow.activatable_widget = showIndicatorSwitch;

        const indicatorPosRow = new Adw.ActionRow({title: 'Position'});
        indicatorGroup.add(indicatorPosRow);

        const indicatorPos = new Gtk.ComboBoxText({
            active: settings.get_string('indicator-position'),
        });
        indicatorPos.append('left', 'left');
        indicatorPos.append('center', 'center');
        indicatorPos.append('right', 'right');
        settings.bind(
            'indicator-position',
            indicatorPos,
            'active-id',
            Gio.SettingsBindFlags.DEFAULT
        );

        indicatorPosRow.add_suffix(indicatorPos);

        const indicatorIndex = new Gtk.SpinButton();
        let indicatorIndexAdjustment = new Gtk.Adjustment();
        indicatorIndexAdjustment.set_lower(-99);
        indicatorIndexAdjustment.set_upper(99);
        indicatorIndexAdjustment.set_step_increment(1);
        indicatorIndex.set_adjustment(indicatorIndexAdjustment);
        indicatorIndex.set_value(settings.get_int('indicator-index'));
        settings.bind('indicator-index', indicatorIndex, 'value', Gio.SettingsBindFlags.DEFAULT);

        indicatorPosRow.add_suffix(indicatorIndex);

        /** ************ End Indicator Settings ***************/


        /** ************ Locale Settings ***************/

        const localeGroup = new Adw.PreferencesGroup();
        page.add(localeGroup);

        const panelFormatRow = new Adw.ActionRow({title: 'Panel Date Format'});
        localeGroup.add(panelFormatRow);

        const panelFormat = new Gtk.Entry();
        panelFormat.set_text(settings.get_string('panel-format'));
        panelFormat.connect('changed', innerFormat => {
            settings.set_string('panel-format', innerFormat.text);
        });
        panelFormatRow.add_suffix(panelFormat);

        const panelPersianDigitRow = new Adw.ActionRow({title: 'Use Persian Digit on panel'});
        localeGroup.add(panelPersianDigitRow);

        const panelPersianDigitSwitch = new Gtk.Switch({
            active: settings.get_boolean('panel-persian-number'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'panel-persian-number',
            panelPersianDigitSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        panelPersianDigitRow.add_suffix(panelPersianDigitSwitch);
        panelPersianDigitRow.activatable_widget = panelPersianDigitSwitch;

        const calPersianWeekdayRow = new Adw.ActionRow({title: 'Use Persian Weekday in calendar'});
        localeGroup.add(calPersianWeekdayRow);

        const calPersianWeekdaySwitch = new Gtk.Switch({
            active: settings.get_boolean('calendar-persian-weekday'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'calendar-persian-weekday',
            calPersianWeekdaySwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        calPersianWeekdayRow.add_suffix(calPersianWeekdaySwitch);
        calPersianWeekdayRow.activatable_widget = calPersianWeekdaySwitch;

        const persianCalNumRow = new Adw.ActionRow({title: 'Use Persian Number in Calendar'});
        localeGroup.add(persianCalNumRow);

        const persianCalNum = new Gtk.Switch({
            active: settings.get_boolean('calendar-persian-number'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'calendar-persian-number',
            persianCalNum,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        persianCalNumRow.add_suffix(persianCalNum);
        persianCalNumRow.activatable_widget = persianCalNum;

        /** ************ End Locale Settings ***************/


        /** ************ Event Settings ***************/

        const eventsGroup = new Adw.PreferencesGroup();
        page.add(eventsGroup);

        // Event Switchs
        const gregorianEventsRow = new Adw.ActionRow({title: 'Show Gregorian Events'});
        eventsGroup.add(gregorianEventsRow);

        const gregorianEventsSwitch = new Gtk.Switch({
            active: settings.get_boolean('gregorian-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'gregorian-events-active',
            gregorianEventsSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        gregorianEventsRow.add_suffix(gregorianEventsSwitch);
        gregorianEventsRow.activatable_widget = gregorianEventsSwitch;

        const persianEventRow = new Adw.ActionRow({title: 'Show Persian Events'});
        eventsGroup.add(persianEventRow);

        const persianEventsSwitch = new Gtk.Switch({
            active: settings.get_boolean('persian-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'persian-events-active',
            persianEventsSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        persianEventRow.add_suffix(persianEventsSwitch);
        persianEventRow.activatable_widget = persianEventsSwitch;

        const hijriEventsRow = new Adw.ActionRow({title: 'Show Hijri Events'});
        eventsGroup.add(hijriEventsRow);

        const hijriEventsSwitch = new Gtk.Switch({
            active: settings.get_boolean('hijri-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'hijri-events-active',
            hijriEventsSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        hijriEventsRow.add_suffix(hijriEventsSwitch);
        hijriEventsRow.activatable_widget = hijriEventsSwitch;

        const internationalEventRow = new Adw.ActionRow({title: 'Show International World Events'});
        eventsGroup.add(internationalEventRow);

        const internationalEventsSwitch = new Gtk.Switch({
            active: settings.get_boolean('international-events-active'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'international-events-active',
            internationalEventsSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        internationalEventRow.add_suffix(internationalEventsSwitch);
        internationalEventRow.activatable_widget = internationalEventsSwitch;

        /** ************ End Event Settings ***************/

        // Add our page to the window
        window.add(page);
    }
}
