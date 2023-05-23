PKG_NAME = persiangnomecalendar
UUID = persian-calendar@iamrezamousavi.gmail.com
VERSION = $(shell git describe --tags)
TOLOCALIZE = $(wildcard $(UUID)/*js) \
             $(wildcard $(UUID)/utils/*.js) \
             $(UUID)/schemas/org.gnome.shell.extensions.PersianCalendar.gschema.xml
MSGSRC = $(wildcard $(UUID)/po/*.po)

# Packagers: Use DESTDIR for system wide installation
ifeq ($(strip $(DESTDIR)),)
	INSTALLTYPE = local
	INSTALLBASE = $(HOME)/.local/share/gnome-shell/extensions
else
	INSTALLTYPE = system
	SHARE_PREFIX = $(DESTDIR)/usr/share
	INSTALLBASE = $(SHARE_PREFIX)/gnome-shell/extensions
endif

.PHONY: all clean extension potfile mergepo install install-local zip-file

all: extension

clean:
	rm -f ./$(UUID)/schemas/gschemas.compiled
	rm -f ./$(UUID)/po/*.mo

extension: ./$(UUID)/schemas/gschemas.compiled $(MSGSRC:.po=.mo)

./$(UUID)/schemas/gschemas.compiled: ./$(UUID)/schemas/org.gnome.shell.extensions.PersianCalendar.gschema.xml
	glib-compile-schemas ./$(UUID)/schemas/

potfile: ./$(UUID)/po/persiangnomecalendar.pot

mergepo: potfile
	for l in $(MSGSRC); do \
		msgmerge -U $$l ./$(UUID)/po/persiangnomecalendar.pot; \
	done;

./$(UUID)/po/persiangnomecalendar.pot: $(TOLOCALIZE)
	mkdir -p po
	xgettext -k_ -kN_ --from-code utf-8 -o po/persiangnomecalendar.pot --package-name $(PKG_NAME) $(TOLOCALIZE)

./$(UUID)/po/%.mo: ./$(UUID)/po/%.po
	msgfmt -c $< -o $@

install: install-local

install-local: _build
	rm -rf $(INSTALLBASE)/$(UUID)
	mkdir -p $(INSTALLBASE)/$(UUID)
	cp -r ./_build/* $(INSTALLBASE)/$(UUID)/
ifeq ($(INSTALLTYPE),system)
	# system-wide settings and locale files
	rm -r  $(addprefix $(INSTALLBASE)/$(UUID)/, schemas locale)
	mkdir -p $(SHARE_PREFIX)/glib-2.0/schemas \
		$(SHARE_PREFIX)/locale
	cp -r ./$(UUID)/schemas/*gschema.xml $(SHARE_PREFIX)/glib-2.0/schemas
	cp -r ./_build/locale/* $(SHARE_PREFIX)/locale
endif
	-rm -fR _build
	echo done

zip-file: _build
	cd _build ; \
	zip -qr "$(UUID)-v$(VERSION).zip" .
	mv _build/$(UUID)-v$(VERSION).zip ./
	-rm -fR _build

_build: all
	-rm -fR ./_build
	mkdir -p _build
	cp -r $(UUID)/* _build
	mkdir -p _build/locale
	for l in $(MSGSRC:.po=.mo) ; do \
		lf=_build/locale/`basename $$l .mo`; \
		mkdir -p $$lf; \
		mkdir -p $$lf/LC_MESSAGES; \
		cp $$l $$lf/LC_MESSAGES/$(PKG_NAME).mo; \
	done;
	-rm -fR _build/po

remove:
	rm -rf $(INSTALLBASE)/$(UUID)

# help commands

taillog:
	journalctl -f -o cat GNOME_SHELL_EXTENSION_UUID=$(UUID)

eslint:
	./node_modules/.bin/eslint persian-calendar@iamrezamousavi.gmail.com
