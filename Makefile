UUID := persian-calendar@iamrezamousavi.gmail.com
EXTENSION_PATH := ~/.local/share/gnome-shell/extensions

build:
	glib-compile-schemas $(UUID)/schemas/

install: build
	mkdir -p $(EXTENSION_PATH)
	cp -r $(UUID)/ $(EXTENSION_PATH)/

clean:
	rm -rf $(EXTENSION_PATH)/$(UUID)

reinstall: clean install

taillog:
	journalctl -f -o cat GNOME_SHELL_EXTENSION_UUID=$(UUID)

eslint:
	./node_modules/.bin/eslint persian-calendar@iamrezamousavi.gmail.com

trans-scan:
	mkdir -p $(UUID)/locale
	xgettext --add-comments --from-code=UTF-8 --output=$(UUID)/locale/persiangnomecalendar.pot $(UUID)/*js $(UUID)/utils/*.js

trans-fa: $(UUID)/locale/persiangnomecalendar.pot
	mkdir -p $(UUID)/locale/fa/LC_MESSAGES
	msginit --locale fa --input $(UUID)/locale/persiangnomecalendar.pot --output $(UUID)/locale/fa/LC_MESSAGES/persiangnomecalendar.po

trans-fa-compile: $(UUID)/locale/fa/LC_MESSAGES/persiangnomecalendar.po
	msgfmt $(UUID)/locale/fa/LC_MESSAGES/persiangnomecalendar.po --output=$(UUID)/locale/fa/LC_MESSAGES/$(UUID).mo
