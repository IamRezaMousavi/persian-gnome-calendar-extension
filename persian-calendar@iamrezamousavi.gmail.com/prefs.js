'use strict';

const {Adw, Gio, Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.PersianCalendar');

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
        Gio.SettingsBindFlags.DEFAULT,
    );

    // Add the switch to the row
    row.add_suffix(toggle);
    row.activatable_widget = toggle;

    const pos_row = new Adw.ActionRow({title: 'Position'});
    group.add(pos_row);

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

    pos_row.add_suffix(pos);
    pos_row.add_suffix(item);

    // Add our page to the window
    window.add(page);
}
