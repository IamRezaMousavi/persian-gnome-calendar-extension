import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';

import { DateMenuButton } from './dateMenu.js';

const Indicator = GObject.registerClass(
    class Indicator extends DateMenuButton { }
);

export default class PersianCalendar extends Extension {
    settings?: Gio.Settings
    animationsEnabled: boolean = true
    _indicator?: PanelMenu.Button
    indicator_position_sig?: number
    indicator_index_sig?: number
    g_events_sig?: number
    p_events_sig?: number
    h_events_sig?: number
    int_events_sig?: number

    enable() {
        this.settings = this.getSettings();

        this._indicator = new Indicator(this.settings);

        this.settings.bind(
            'show-indicator',
            this._indicator,
            'visible',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.indicator_position_sig = this.settings.connect('changed::indicator-position', () => {
            this.disable();
            this.enable();
        });
        this.indicator_index_sig = this.settings.connect('changed::indicator-index', () => {
            this.disable();
            this.enable();
        });

        // TODO: clean binds
        this.g_events_sig = this.settings.connect('changed::gregorian-events-active', () => {
            this.disable();
            this.enable();
        });
        this.p_events_sig = this.settings.connect('changed::persian-events-active', () => {
            this.disable();
            this.enable();
        });
        this.h_events_sig = this.settings.connect('changed::hijri-events-active', () => {
            this.disable();
            this.enable();
        });
        this.int_events_sig = this.settings.connect('changed::international-events-active', () => {
            this.disable();
            this.enable();
        });

        Main.panel.addToStatusArea(
            this.uuid,
            this._indicator,
            this.settings.get_int('indicator-index'),
            this.settings.get_string('indicator-position')
        );
    }

    disable() {
        if (this.indicator_position_sig) {
            this.settings?.disconnect(this.indicator_position_sig);
            this.indicator_position_sig = undefined;
        }
        if (this.indicator_index_sig) {
            this.settings?.disconnect(this.indicator_index_sig);
            this.indicator_index_sig = undefined;
        }

        if (this.g_events_sig) {
            this.settings?.disconnect(this.g_events_sig);
            this.g_events_sig = undefined;
        }
        if (this.p_events_sig) {
            this.settings?.disconnect(this.p_events_sig);
            this.p_events_sig = undefined;
        }
        if (this.h_events_sig) {
            this.settings?.disconnect(this.h_events_sig);
            this.h_events_sig = undefined;
        }
        if (this.int_events_sig) {
            this.settings?.disconnect(this.int_events_sig);
            this.int_events_sig = undefined;
        }

        this._indicator?.destroy();
        this._indicator = undefined;

        this.settings = undefined;
    }
}
