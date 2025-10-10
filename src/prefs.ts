import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class PersianCalendarPreferences extends ExtensionPreferences {
  _settings?: Gio.Settings

  fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
    this._settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: _('General'),
      iconName: 'dialog-information-symbolic',
    });

    /** ********* Indicator Settings **************/
    const indicatorGroup = new Adw.PreferencesGroup({
      title: _('Indicator'),
      description: _('Configure Indicator'),
    });
    page.add(indicatorGroup);
    
    const showIndicator = new Adw.SwitchRow({
      title: _('Show Extension Indicator'),
      subtitle: _('Show/Hide Indicator'),
      active: this._settings.get_boolean('show-indicator')
    });
    indicatorGroup.add(showIndicator);

    this._settings.bind(
      'show-indicator',
      showIndicator,
      'active',
      Gio.SettingsBindFlags.DEFAULT
    )

    window.add(page)

    return Promise.resolve();
  }
}