/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

import {DateMenuButton} from './dateMenu.js';

const Indicator = GObject.registerClass(
    class Indicator extends DateMenuButton {}
);

export default class PersianCalendar extends Extension {
    enable() {
        this.settings = this.getSettings();

        this._indicator = new Indicator(this.settings);

        this.settings.bind(
            'show-indicator',
            this._indicator,
            'visible',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.connect('changed::position', () => {
            this.disable();
            this.enable();
        });
        this.settings.connect('changed::index', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::panel-format', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::number-to-persian', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::gregorian-events-active', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::persian-events-active', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::hijri-events-active', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::unofficial-events-active', () => {
            this.disable();
            this.enable();
        });

        Main.panel.addToStatusArea(
            this.uuid,
            this._indicator,
            this.settings.get_int('index'),
            this.settings.get_string('position')
        );
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;

        this.settings = null;
    }
}
