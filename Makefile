UUID = persian-calendar@iamrezamousavi.gmail.com
VERSION = $(shell git describe --tags)

# Packagers: Use DESTDIR for system wide installation
ifeq ($(strip $(DESTDIR)),)
	INSTALLTYPE = local
	INSTALLBASE = $(HOME)/.local/share/gnome-shell/extensions
else
	INSTALLTYPE = system
	SHARE_PREFIX = $(DESTDIR)/usr/share
	INSTALLBASE = $(SHARE_PREFIX)/gnome-shell/extensions
endif

.PHONY: all clean extension install install-local zip-file

all: extension locale

extension: ./$(UUID)/schemas/gschemas.compiled

./$(UUID)/schemas/gschemas.compiled: ./$(UUID)/schemas/org.gnome.shell.extensions.PersianCalendar.gschema.xml
	glib-compile-schemas ./$(UUID)/schemas/

locale: trans-fa-compile

trans-fa-compile: $(UUID)/locale/fa/LC_MESSAGES/persiangnomecalendar.po
	cd $(UUID)/locale/fa/LC_MESSAGES ; \
	msgfmt persiangnomecalendar.po --output=$(UUID).mo


install: install-local

install-local: _build
	rm -rf $(INSTALLBASE)/$(UUID)
	mkdir -p $(INSTALLBASE)/$(UUID)
	cp -r ./_build/* $(INSTALLBASE)/$(UUID)/
ifeq ($(INSTALLTYPE),system)
	# system-wide settings and locale files
	rm -r  $(addprefix $(INSTALLBASE)/$(UUID)/, schemas)
	mkdir -p $(SHARE_PREFIX)/glib-2.0/schemas \
	cp -r ./$(UUID)/schemas/*gschema.xml $(SHARE_PREFIX)/glib-2.0/schemas
endif
	-rm -fR _build
	echo done

_build: all
	-rm -fR ./_build
	mkdir -p _build
	cp -r $(UUID)/* _build
	rm -f _build/locale/fa/LC_MESSAGES/*.po _build/locale/*.pot

zip-file: _build
	cd _build ; \
	zip -qr "$(UUID)-v$(VERSION).zip" .
	mv _build/$(UUID)-v$(VERSION).zip ./
	-rm -fR _build

clean:
	rm -f ./$(UUID)/schemas/gschemas.compiled
	rm -f ./$(UUID)/locale/fa/LC_MESSAGES/$(UUID).mo

remove:
	rm -rf $(INSTALLBASE)/$(UUID)

# help commands

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
