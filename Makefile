UUID := persian-gnome-calendar@iamrezamousavi.gmail.com
EXTENSION_PATH := ~/.local/share/gnome-shell/extensions/$(UUID)


install:
	mkdir -p $(EXTENSION_PATH)
	cp -r events $(EXTENSION_PATH)
	cp *.js *.css *.json $(EXTENSION_PATH)/

clean:
	rm -rf $(EXTENSION_PATH)/

reinstall: clean install

taillog:
	journalctl -f -o cat GNOME_SHELL_EXTENSION_UUID=$(UUID)
