/* eslint-disable */
'use strict';

/*
 * Based on a code from https://github.com/omid/Persian-Calendar-for-Gnome-Shell
 */

export const PersianDate = class PersianDate extends Date {
    constructor(...args) {
        super(...args);
        this._createPersianDate();
    }

    getPersianDate() {
        return this.pDate.day;
    }

    getPersianMonth() {
        return this.pDate.month;
    }

    getPersianFullYear() {
        return this.pDate.year;
    }

    _createPersianDate() {
        this.pDate = gregorianToPersian(
            this.getFullYear(),
            this.getMonth() + 1,
            this.getDate()
        );
    }

    setPersianDate(year, month, day) {
        let gDate = persianToGregorian(year, month, day);
        gDate = new Date(gDate.year, gDate.month, gDate.day);
        this.setFullYear(gDate.getFullYear());
        this.setMonth(gDate.getMonth() - 1);
        this.setDate(gDate.getDate());
        this._createPersianDate();
    }

    setDate(date) {
        super.setDate(date);
        this._createPersianDate();
    }

    setMonth(month) {
        super.setMonth(month);
        this._createPersianDate();
    }

    setFullYear(year) {
        super.setFullYear(year);
        this._createPersianDate();
    }

    toPersianString(option) {
        // or can use 'fa-ir-u-nu-latn' to replace latin number with persian
        return this.toLocaleDateString('fa-ir', option);
    }
};

const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const p_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function persianToGregorian(py, pm, pd) {
    py = parseInt(py) - 979;
    pm = parseInt(pm) - 1;
    pd = parseInt(pd) - 1;

    let p_day_no = 365 * py + parseInt(py / 33) * 8 + parseInt((py % 33 + 3) / 4);
    for (let i = 0; i < pm; i++)
        p_day_no += p_days_in_month[i];


    p_day_no += pd;

    let g_day_no = p_day_no + 79;

    let gy = 1600 + 400 * parseInt(g_day_no / 146097);
    /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no %= 146097;

    let leap = true;
    /* 36525 = 365*100 + 100/4 */
    if (g_day_no >= 36525) {
        g_day_no--;
        gy += 100 * parseInt(g_day_no / 36524);
        /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no %= 36524;

        if (g_day_no >= 365)
            g_day_no++;
        else
            leap = false;
    }

    gy += 4 * parseInt(g_day_no / 1461);
    /* 1461 = 365*4 + 4/4 */
    g_day_no %= 1461;

    if (g_day_no >= 366) {
        leap = false;

        g_day_no--;
        gy += parseInt(g_day_no / 365);
        g_day_no %= 365;
    }

    let i = 0;
    for (; g_day_no >= g_days_in_month[i] + (i === 1 && leap); i++)
        g_day_no -= g_days_in_month[i] + (i === 1 && leap);


    return {year: gy, month: i + 1, day: g_day_no + 1};
}

function gregorianToPersian(gy, gm, gd) {
    gy = parseInt(gy) - 1600;
    gm = parseInt(gm) - 1;
    gd = parseInt(gd) - 1;

    let g_day_no = 365 * gy + parseInt((gy + 3) / 4) - parseInt((gy + 99) / 100) + parseInt((gy + 399) / 400);

    for (let i = 0; i < gm; ++i)
        g_day_no += g_days_in_month[i];


    /* leap and after Feb */
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)))
        ++g_day_no;


    g_day_no += gd;

    let p_day_no = g_day_no - 79;
    let p_np = parseInt(p_day_no / 12053);
    p_day_no %= 12053;

    let py = 979 + 33 * p_np + 4 * parseInt(p_day_no / 1461);
    p_day_no %= 1461;

    if (p_day_no >= 366) {
        py += parseInt((p_day_no - 1) / 365);
        p_day_no = (p_day_no - 1) % 365;
    }

    let day_in_year = p_day_no + 1;
    let i = 0;
    for (; i < 11 && p_day_no >= p_days_in_month[i]; ++i)
        p_day_no -= p_days_in_month[i];


    return {year: py, month: i + 1, day: p_day_no + 1, yearDays: day_in_year};
}

function isLeap_(py) {
    return ((((((py - (py > 0 ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
}
