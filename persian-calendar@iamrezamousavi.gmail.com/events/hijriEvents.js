/*
 * see https://www.farhang.gov.ir/ershad_content/media/image/2020/09/1004261_orig.pdf
 */

/* exported HijriEvents */

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;
const HijriDate = Me.imports.hijriDate;

var HijriEvents = class HijriEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('1-1', [new CalendarEvent('آغاز سال جدید هجری قمری', false)]);
        this._events.set('1-9', [new CalendarEvent('تاسوعای حسینی', true)]);
        this._events.set('1-10', [new CalendarEvent('عاشورای حسینی', true)]);
        this._events.set('1-12', [new CalendarEvent('شهادت امام سجاد (ع)', false)]);
        this._events.set('2-20', [new CalendarEvent('اربعین حسینی', true)]);
        this._events.set('2-28', [
            new CalendarEvent('رحلت حضرت رسول اکرم (ص)', true),
            new CalendarEvent('شهادت امام حسن مجتبی (ع)', true),
        ]);
        this._events.set('2-30', [new CalendarEvent('شهادت امام رضا (ع)', true)]);
        this._events.set('3-1', [new CalendarEvent('هجرت حضرت رسول اکرم (ص) از مکه به مدینه', false)]);
        this._events.set('3-8', [new CalendarEvent('شهادت امام حسن عسکری (ع)', true)]);
        this._events.set('3-19', [new CalendarEvent('ولادت حضرت رسول اکرم (ص) به روایت اهل سنت', false)]);
        this._events.set('3-17', [
            new CalendarEvent('ولادت حضرت رسول اکرم (ص)', true),
            new CalendarEvent('ولادت امام جعفر صادق (ع)', true),
        ]);
        this._events.set('4-8', [new CalendarEvent('ولادت امام حسن عسکری (ع)', false)]);
        this._events.set('4-10', [new CalendarEvent('وفات حضرت معصومه (س)', false)]);
        this._events.set('5-5', [
            new CalendarEvent('ولادت حضرت زینب (س)', false),
            new CalendarEvent('روز پرستار', false),
        ]);
        this._events.set('6-3', [new CalendarEvent('شهادت حضرت فاطمه (س)', true)]);
        this._events.set('6-13', [
            new CalendarEvent('وفات حضرت ام‌البنین (س)', false),
            new CalendarEvent('روز تکریم مادران و همسران شهدا', false),
        ]);
        this._events.set('6-20', [
            new CalendarEvent('ولادت حضرت فاطمه (س) و روز زن', false),
            new CalendarEvent('تولد حضرت امام خمینی (ره)', false),
        ]);
        this._events.set('7-1', [new CalendarEvent('ولادت امام محمد باقر (ع)', false)]);
        this._events.set('7-3', [new CalendarEvent('شهادت امام علی نقی (ع)', false)]);
        this._events.set('7-10', [new CalendarEvent('ولادت امام محمد تقی (ع)', false)]);
        this._events.set('7-13', [
            new CalendarEvent('ولادت امام علی (ع)', true),
            new CalendarEvent('روز پدر', true),
        ]);
        this._events.set('7-15', [new CalendarEvent('ارتحال حضرت زینب (س)', false)]);
        this._events.set('7-25', [new CalendarEvent('شهادت امام موسی کاظم (ع)', false)]);
        this._events.set('7-27', [new CalendarEvent('مبعث حضرت رسول اکرم (ص)', true)]);
        this._events.set('8-3', [
            new CalendarEvent('ولادت امام حسین (ع)', false),
            new CalendarEvent('روز پاسدار', false),
        ]);
        this._events.set('8-4', [
            new CalendarEvent('ولادت ابوالفضل عباس (ع)', false),
            new CalendarEvent('روز جانباز', false),
        ]);
        this._events.set('8-5', [new CalendarEvent('ولادت امام سجاد (ع)', false)]);
        this._events.set('8-11', [
            new CalendarEvent('ولادت علی اکبر (ع)', false),
            new CalendarEvent('روز جوان', false),
        ]);
        this._events.set('8-15', [
            new CalendarEvent('ولادت حضرت قائم (عجل)', true),
            new CalendarEvent('روز جهانی مستضعفان', true),
        ]);
        this._events.set('9-15', [
            new CalendarEvent('ولادت امام حسن مجتبی (ع)', false),
            new CalendarEvent('روز اکرام و تکریم خیرین', false),
        ]);
        this._events.set('9-18', [new CalendarEvent('شب قدر', false)]);
        this._events.set('9-19', [new CalendarEvent('ضربت خوردن امام علی (ع)', false)]);
        this._events.set('9-20', [new CalendarEvent('شب قدر', false)]);
        this._events.set('9-21', [new CalendarEvent('شهادت حضرت علی (ع)', true)]);
        this._events.set('9-22', [new CalendarEvent('شب قدر', false)]);
        this._events.set('10-1', [new CalendarEvent('عید فطر', true)]);
        this._events.set('10-2', [new CalendarEvent('تعطیلات عید فطر', true)]);
        this._events.set('10-25', [new CalendarEvent('شهادت امام جعفر صادق (ع)', true)]);
        this._events.set('11-1', [
            new CalendarEvent('ولادت حضرت معصومه (س)', false),
            new CalendarEvent('روز دختران', false),
        ]);
        this._events.set('11-11', [new CalendarEvent('ولادت امام رضا (ع)', false)]);
        this._events.set('11-30', [new CalendarEvent('شهادت امام محمد تقی (ع)', false)]);
        this._events.set('12-1', [
            new CalendarEvent('سالروز ازدواج امام علی (ع) و حضرت فاطمه (س)', false),
            new CalendarEvent('روز ازدواج', false),
            new CalendarEvent('روز عفاف و حجاب', false),
        ]);
        this._events.set('12-7', [new CalendarEvent('شهادت امام محمد باقر (ع)', false)]);
        this._events.set('12-9', [new CalendarEvent('روز عرفه', false)]);
        this._events.set('12-10', [new CalendarEvent('عید قربان', true)]);
        this._events.set('12-15', [new CalendarEvent('ولادت امام علی نقی (ع)', false)]);
        this._events.set('12-18', [new CalendarEvent('عید غدیر خم', true)]);
        this._events.set('12-20', [new CalendarEvent('ولادت امام موسی کاظم (ع)', false)]);
    }

    getEvents(day) {
        let hDate = HijriDate.fromGregorian(
            day.getFullYear(),
            day.getMonth() + 1,
            day.getDate()
        );
        let events = this._events.get(`${hDate.month}-${hDate.day}`);
        if (Array.isArray(events))
            return events;
        return [];
    }
};
