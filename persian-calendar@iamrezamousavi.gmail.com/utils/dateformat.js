/*
 * For OF
 */

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to masks.default.
 */

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const {persianDate} = Me.imports;

// Regexes and supporting functions are cached through closure
const token = /d{1,4}|D{3,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|W{1,2}|[LlopSZN]|"[^"]*"|'[^']*'/g;
const timezone = /\b(?:[A-Z]{1,3}[A-Z][TC])(?:[-+]\d{4})?|((?:Australian )?(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time)\b/g;
const timezoneClip = /[^-+\dA-Z]/g;


let masks = {
    default: 'ddd mmm dd yyyy HH:MM:ss',
    shortDate: 'm/d/yy',
    paddedShortDate: 'mm/dd/yyyy',
    mediumDate: 'mmm d, yyyy',
    longDate: 'mmmm d, yyyy',
    fullDate: 'dddd, mmmm d, yyyy',
    shortTime: 'h:MM TT',
    mediumTime: 'h:MM:ss TT',
    longTime: 'h:MM:ss TT Z',
    isoDate: 'yyyy-mm-dd',
    isoTime: 'HH:MM:ss',
    isoDateTime: "yyyy-mm-dd'T'HH:MM:sso",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    expiresHeaderFormat: 'ddd, dd mmm yyyy HH:MM:ss Z',
};

// Internationalization strings
let i18n = {
    dayNames: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
    monthNames: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    timeNames: ['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'],
};

// Persian strings
let fa_ir = {
    dayNames: [
        'یک',
        'دو',
        'سه',
        'چهار',
        'پنج',
        'جم',
        'شن',
        'یکشنبه',
        'دوشنبه',
        'سه شنبه',
        'چهارشنبه',
        'پنجشنبه',
        'جمعه',
        'شنبه',
    ],
    monthNames: [
        'فر',
        'ارد',
        'خرد',
        'تیر',
        'مرد',
        'شهر',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهم',
        'اسف',
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
    ],
};

let isPersian = true;
const persian = () => isPersian ? 'Persian' : '';
const pad = (val, len = 2) => String(val).padStart(len, '0');

/**
 * Get day name
 * Yesterday, Today, Tomorrow if the date lies within, else fallback to Monday - Sunday
 * @param  {Object}
 * @return {String}
 */
const getDayName = ({y, m, d, _, dayName, short = false}) => {
    let persianText = persian();

    const today = new persianDate.PersianDate();
    const yesterday = new persianDate.PersianDate();
    yesterday.setDate(yesterday[`${_ + persianText}Date`]() - 1);
    const tomorrow = new persianDate.PersianDate();
    tomorrow.setDate(tomorrow[`${_ + persianText}Date`]() + 1);
    const today_d = () => today[`${_ + persianText}Date`]();
    const today_m = () => today[`${_ + persianText}Month`]();
    const today_y = () => today[`${_ + persianText}FullYear`]();
    const yesterday_d = () => yesterday[`${_ + persianText}Date`]();
    const yesterday_m = () => yesterday[`${_ + persianText}Month`]();
    const yesterday_y = () => yesterday[`${_ + persianText}FullYear`]();
    const tomorrow_d = () => tomorrow[`${_ + persianText}Date`]();
    const tomorrow_m = () => tomorrow[`${_ + persianText}Month`]();
    const tomorrow_y = () => tomorrow[`${_ + persianText}FullYear`]();

    if (today_y() === y && today_m() === m && today_d() === d)
        return isPersian ? 'امروز' : short ? 'Tdy' : 'Today';

    else if (yesterday_y() === y && yesterday_m() === m && yesterday_d() === d)
        return isPersian ? 'دیروز' : short ? 'Ysd' : 'Yesterday';

    else if (tomorrow_y() === y && tomorrow_m() === m && tomorrow_d() === d)
        return isPersian ? 'فردا' : short ? 'Tmw' : 'Tomorrow';

    return dayName;
};

/**
 * Get the ISO 8601 week number
 * Based on comments from
 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
 *
 * @param  {Date} `date`
 * @return {Number}
 */
const getWeek = date => {
    // Remove time components of date
    const targetThursday = new persianDate.PersianDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

    // Change date to Thursday same week
    targetThursday.setDate(
        targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3,
    );

    // Take January 4th as it is always in week 1 (see ISO 8601)
    const firstThursday = new persianDate.PersianDate(targetThursday.getFullYear(), 0, 4);

    // Change date to Thursday same week
    firstThursday.setDate(
        firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3,
    );

    // Check if daylight-saving-time-switch occurred and correct for it
    const ds =
    targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
    targetThursday.setHours(targetThursday.getHours() - ds);

    // Number of weeks between target Thursday and first Thursday
    const weekDiff = (targetThursday - firstThursday) / (86400000 * 7);
    return 1 + Math.floor(weekDiff);
};

/**
 * Get ISO-8601 numeric representation of the day of the week
 * 1 (for Monday) through 7 (for Sunday)
 *
 * @param  {Date} `date`
 * @return {Number}
 */
const getDayOfWeek = date => {
    let dow = date.getDay();
    if (dow === 0)
        dow = 7;

    return dow;
};

/**
 * Get proper timezone abbreviation or timezone offset.
 *
 * This will fall back to `GMT+xxxx` if it does not recognize the
 * timezone within the `timezone` RegEx above. Currently only common
 * American and Australian timezone abbreviations are supported.
 *
 * @param  {String | Date} date
 * @return {String}
 */
const formatTimezone = date => (String(date).match(timezone) || [''])
    .pop()
    .replace(timezoneClip, '')
    .replace(/GMT\+0000/g, 'UTC');

/**
 * @param {string | number | Date} date
 * @param {string} mask
 * @param {boolean} utc
 * @param {boolean} gmt
 */
function dateFormat(date, mask) {
    // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
    if (
        arguments.length === 1 &&
  typeof date === 'string' &&
  !/\d/.test(date)
    ) {
        mask = date;
        date = undefined;
    }

    date = date || date === 0 ? date : new persianDate.PersianDate();

    if (!(date instanceof Date))
        date = new persianDate.PersianDate(date);


    if (isNaN(date))
        throw TypeError('Invalid date');


    mask = String(
        masks[mask] || mask || masks['default'],
    );

    // Allow setting the utc/gmt argument via the mask
    let utc = false, gmt = false;
    const maskSlice = mask.slice(0, 4);
    if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
        mask = mask.slice(4);
        utc = true;
        if (maskSlice === 'GMT:')
            gmt = true;
    }

    const _ = () => utc ? 'getUTC' : 'get';
    const D = () => date[`${_()}Day`]();
    const d = () => date[`${_() + persian()}Date`]();
    const m = () => date[`${_() + persian()}Month`]();
    const y = () => date[`${_() + persian()}FullYear`]();
    const H = () => date[`${_()}Hours`]();
    const M = () => date[`${_()}Minutes`]();
    const s = () => date[`${_()}Seconds`]();
    const L = () => date[`${_()}Milliseconds`]();
    const o = () => utc ? 0 : date.getTimezoneOffset();
    const W = () => getWeek(date);
    const N = () => getDayOfWeek(date);

    const flags = {
        d: () => d(),
        dd: () => pad(d()),
        ddd: () => isPersian ? fa_ir.dayNames[D()] : i18n.dayNames[D()],
        DDD: () => getDayName({
            y: y(),
            m: m(),
            d: d(),
            _: _(),
            dayName: isPersian ? fa_ir.dayNames[D()] : i18n.dayNames[D()],
            short: true,
        }),
        dddd: () => isPersian ? fa_ir.dayNames[D() + 7] : i18n.dayNames[D() + 7],
        DDDD: () => getDayName({
            y: y(),
            m: m(),
            d: d(),
            _: _(),
            dayName: isPersian ? fa_ir.dayNames[D() + 7] : i18n.dayNames[D() + 7],
        }),
        m: () => m() + 1,
        mm: () => pad(m() + 1),
        mmm: () => isPersian ? fa_ir.monthNames[m()] : i18n.monthNames[m()],
        mmmm: () => isPersian ? fa_ir.monthNames[m() + 12] : i18n.monthNames[m() + 12],
        yy: () => String(y()).slice(2),
        yyyy: () => pad(y(), 4),
        h: () => H() % 12 || 12,
        hh: () => pad(H() % 12 || 12),
        H: () => H(),
        HH: () => pad(H()),
        M: () => M(),
        MM: () => pad(M()),
        s: () => s(),
        ss: () => pad(s()),
        l: () => pad(L(), 3),
        L: () => pad(Math.floor(L() / 10)),
        t: () =>
            H() < 12
                ? i18n.timeNames[0]
                : i18n.timeNames[1],
        tt: () =>
            H() < 12
                ? i18n.timeNames[2]
                : i18n.timeNames[3],
        T: () =>
            H() < 12
                ? i18n.timeNames[4]
                : i18n.timeNames[5],
        TT: () =>
            H() < 12
                ? i18n.timeNames[6]
                : i18n.timeNames[7],
        Z: () =>
            gmt
                ? 'GMT'
                : utc
                    ? 'UTC'
                    : formatTimezone(date),
        o: () =>
            (o() > 0 ? '-' : '+') +
    pad(Math.floor(Math.abs(o()) / 60) * 100 + (Math.abs(o()) % 60), 4),
        p: () =>
            `${(o() > 0 ? '-' : '+') +
    pad(Math.floor(Math.abs(o()) / 60), 2)
            }:${
                pad(Math.floor(Math.abs(o()) % 60), 2)}`,
        S: () =>
            ['th', 'st', 'nd', 'rd'][
      d() % 10 > 3 ? 0 : (((d() % 100) - (d() % 10) !== 10) * d()) % 10
            ],
        W: () => W(),
        WW: () => pad(W()),
        N: () => N(),
    };

    return mask.replace(token, match => {
        if (match in flags)
            return flags[match]();

        return match.slice(1, match.length - 1);
    });
}
