/*
 * Based on a code from https://github.com/omid/Persian-Calendar-for-Gnome-Shell
 */

/* exported PersianDate */

var PersianDate = class PersianDate extends Date {
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
            this.getMonth(),
            this.getDate()
        );
    }

    setPersianDate(year, month, day) {
        let gDate = persianToGregorian(year, month, day);
        gDate = new Date(gDate.year, gDate.month, gDate.day);
        this.setFullYear(gDate.getFullYear());
        this.setMonth(gDate.getMonth());
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

const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const pDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function persianToGregorian(py, pm, pd) {
    py = parseInt(py) - 979;
    pm = parseInt(pm) - 1;
    pd = parseInt(pd) - 1;

    let pDayNo = 365 * py + parseInt(py / 33) * 8 + parseInt((py % 33 + 3) / 4);
    for (let i = 0; i < pm; i++)
        pDayNo += pDaysInMonth[i];


    pDayNo += pd;

    let gDayNo = pDayNo + 79;

    let gy = 1600 + 400 * parseInt(gDayNo / 146097);
    /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    gDayNo %= 146097;

    let leap = true;
    /* 36525 = 365*100 + 100/4 */
    if (gDayNo >= 36525) {
        gDayNo--;
        gy += 100 * parseInt(gDayNo / 36524);
        /* 36524 = 365*100 + 100/4 - 100/100 */
        gDayNo %= 36524;

        if (gDayNo >= 365)
            gDayNo++;
        else
            leap = false;
    }

    gy += 4 * parseInt(gDayNo / 1461);
    /* 1461 = 365*4 + 4/4 */
    gDayNo %= 1461;

    if (gDayNo >= 366) {
        leap = false;

        gDayNo--;
        gy += parseInt(gDayNo / 365);
        gDayNo %= 365;
    }

    let i = 0;
    for (; gDayNo >= gDaysInMonth[i] + (i === 1 && leap); i++)
        gDayNo -= gDaysInMonth[i] + (i === 1 && leap);


    return {year: gy, month: i + 1, day: gDayNo + 1};
}

function gregorianToPersian(gy, gm, gd) {
    gy = parseInt(gy) - 1600;
    gm = parseInt(gm);
    gd = parseInt(gd) - 1;

    let gDayNo = 365 * gy + parseInt((gy + 3) / 4) - parseInt((gy + 99) / 100) + parseInt((gy + 399) / 400);

    for (let i = 0; i < gm; ++i)
        gDayNo += gDaysInMonth[i];


    /* leap and after Feb */
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)))
        ++gDayNo;


    gDayNo += gd;

    let pDayNo = gDayNo - 79;
    let pNP = parseInt(pDayNo / 12053);
    pDayNo %= 12053;

    let py = 979 + 33 * pNP + 4 * parseInt(pDayNo / 1461);
    pDayNo %= 1461;

    if (pDayNo >= 366) {
        py += parseInt((pDayNo - 1) / 365);
        pDayNo = (pDayNo - 1) % 365;
    }

    let dayInYear = pDayNo + 1;
    let i = 0;
    for (; i < 11 && pDayNo >= pDaysInMonth[i]; ++i)
        pDayNo -= pDaysInMonth[i];


    return {year: py, month: i, day: pDayNo + 1, yearDays: dayInYear};
}

function isLeap_(py) {
    return ((((((py - (py > 0 ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
}
