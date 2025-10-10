import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Pango from 'gi://Pango';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

const DateMenuButton = GObject.registerClass(
  class DateMenuButton extends PanelMenu.Button {
    constructor() {
      super(0.5, 'Persian Calendar Indicator');

      const calendar_display = new St.Label({style_class: 'clock'});
      calendar_display.set_text("Hi Im Reza");
      calendar_display.clutter_text.y_align = Clutter.ActorAlign.CENTER;
      calendar_display.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;

      const box = new St.BoxLayout({style_class: 'clock-display-box'})
      box.add_child(calendar_display);

      this.label_actor = calendar_display;
      this.add_child(box);
      this.add_style_class_name('clock-display');
    }
  }
)

export default class PersianCalendar extends Extension {
  settings?: Gio.Settings
  animationsEnabled: boolean = true
  indicator?: PanelMenu.Button

  enable() {
    this.settings = this.getSettings();
    this.animationsEnabled = this.settings!.get_boolean('show-indicator') ?? true;

    this.indicator = new DateMenuButton();

    this.settings.bind(
      'show-indicator',
      this.indicator,
      'visible',
      Gio.SettingsBindFlags.DEFAULT
    )

    Main.panel.addToStatusArea(
      this.uuid,
      this.indicator,
      this.settings.get_int('indicator-index'),
      this.settings.get_string('indicator-position')
    )
  }

  disable() {
    this.indicator?.destroy();
    this.indicator = undefined;
    this.settings = undefined;
  }
}