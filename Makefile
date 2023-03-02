UUID := persian-gnome-calendar@iamrezamousavi.gmail.com
EXTENSION_PATH := ~/.local/share/gnome-shell/extensions/$(UUID)


install:
	mkdir $(EXTENSION_PATH)
	cp *.js *.json $(EXTENSION_PATH)/

clean:
	rm -rf $(EXTENSION_PATH)/
