/* exported transDigit, toPersianDigit */

const ExtensionUtils = imports.misc.extensionUtils;
const _ = ExtensionUtils.gettext;

function transDigit(n) {
    const faDigits = [_('0'), _('1'), _('2'), _('3'), _('4'), _('5'), _('6'), _('7'), _('8'), _('9')];
    return n
        .toString()
        .replace(/\d/g, x => faDigits[x]);
}

function toPersianDigit(n) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n
        .toString()
        .replace(/\d/g, x => farsiDigits[x]);
}
