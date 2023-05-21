PKG_NAME = gnome-shell-extension-persian-calendar-rezamousavi
UUID = persian-calendar@iamrezamousavi.gmail.com

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

all: extension

clean:
	rm -f ./$(UUID)/schemas/gschemas.compiled

extension: ./$(UUID)/schemas/gschemas.compiled

./$(UUID)/schemas/gschemas.compiled: ./$(UUID)/schemas/org.gnome.shell.extensions.PersianCalendar.gschema.xml
	glib-compile-schemas ./$(UUID)/schemas/

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

zip-file: _build
	cd _build ; \
	zip -qr "$(PKG_NAME).zip" .
	mv _build/$(PKG_NAME).zip ./
	-rm -fR _build

_build: all
	-rm -fR ./_build
	mkdir -p _build
	cp -r $(UUID)/* _build
	mkdir -p _build/schemas
	cp $(UUID)/schemas/*.xml _build/schemas/
	cp $(UUID)/schemas/gschemas.compiled _build/schemas/
