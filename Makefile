NAME=persian-gnome-calendar
DOMAIN=iamrezamousavi.gmail.com
TOLOCALIZE = $(wildcard src/*js) \
             $(wildcard src/utils/*.js) \
             schemas/org.gnome.shell.extensions.PersianCalendar.gschema.xml

MSGSRC = $(wildcard ./po/*.po)

.PHONY: all pack install clean

all: dist/extension.js locale

node_modules/.package-lock.json: package.json
	npm install

dist/extension.js dist/prefs.js: node_modules/.package-lock.json src/*.ts
	npm run build

schemas/gschemas.compiled: schemas/org.gnome.shell.extensions.$(NAME).gschema.xml
	glib-compile-schemas schemas

locale: $(MSGSRC:.po=.mo)

./po/persiangnomecalendar.pot: $(TOLOCALIZE)
	mkdir -p po
	xgettext -k_ -kN_ --from-code utf-8 -o po/persiangnomecalendar.pot --package-name $(PKG_NAME) $(TOLOCALIZE)

./po/%.mo: ./po/%.po
	msgfmt -c $< -o $@

$(NAME).zip: dist/extension.js dist/prefs.js locale
	@cp -r schemas dist/
	@cp -r locale dist/po
	@cp metadata.json dist/
	@(cd dist && zip ../$(NAME).zip -9r .)

pack: $(NAME).zip

install: $(NAME).zip
	gnome-extensions install --force $(NAME).zip

clean:
	@rm -rf dist node_modules $(NAME).zip
