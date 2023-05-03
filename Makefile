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
