/*
 * see https://www.farhang.gov.ir/ershad_content/media/image/2020/09/1004261_orig.pdf
 */

/* exported PersianEvents */

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CalendarEvent = Me.imports.events.calendarEvent.CalendarEvent;
const CalendarEvents = Me.imports.events.calendarEvent.CalendarEvents;

var PersianEvents = class PersianEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('1-1', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-2', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-3', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-4', [new CalendarEvent('عید نوروز', true)]);
        this._events.set('1-6', [new CalendarEvent('ولادت زرتشت', false)]);
        this._events.set('1-7', [new CalendarEvent('روز هنرهای نمایشی', false)]);
        this._events.set('1-12', [new CalendarEvent('روز جمهوری اسلامی', true)]);
        this._events.set('1-13', [new CalendarEvent('روز طبیعت', true)]);
        this._events.set('1-18', [new CalendarEvent('روز سلامتی', false)]);
        this._events.set('1-20', [new CalendarEvent('روز ملی فناوری هسته‌ای', false)]);
        this._events.set('1-25', [new CalendarEvent('روز بزرگداشت عطار نیشابوری', false)]);
        this._events.set('1-29', [new CalendarEvent('روز ارتش جمهوری اسلامی و نیروی زمینی', false)]);
        this._events.set('2-1', [new CalendarEvent('روز بزرگداشت سعدی', false)]);
        this._events.set('2-3', [
            new CalendarEvent('روز بزرگداشت شیخ بهایی', false),
            new CalendarEvent('روز معماری', false),
        ]);
        this._events.set('2-7', [new CalendarEvent('روز ایمنی حمل و نقل', false)]);
        this._events.set('2-9', [new CalendarEvent('روز شوراها', false)]);
        this._events.set('2-10', [new CalendarEvent('روز ملی خلیج فارس', false)]);
        this._events.set('2-15', [new CalendarEvent('روز بزرگداشت شیخ صدوق', false)]);
        this._events.set('2-18', [new CalendarEvent('روز بیماری‌های خاص و صعب العلاج', false)]);
        this._events.set('2-19', [new CalendarEvent('روز بزرگداشت شیخ کلینی', false)]);
        this._events.set('2-25', [new CalendarEvent('روز پاسداشت زبان فارسی و بزرگداشت حکیم ابوالقاسم فردوسی', false)]);
        this._events.set('2-28', [new CalendarEvent('روز بزرگداشت حکیم عمر خیام', false)]);
        this._events.set('2-30', [new CalendarEvent('روز ملی جمعیت', false)]);
        this._events.set('2-31', [new CalendarEvent('روز اهدای عضو، اهدای زندگی', false)]);
        this._events.set('3-1', [
            new CalendarEvent('روز بهره‌وری و بهینه‌سازی مصرف', false),
            new CalendarEvent('روز بزرگداشت ملاصدرا', false),
        ]);
        this._events.set('3-8', [new CalendarEvent('روز فرهنگ پهلوانی و ورزش زورخانه‌ای', false)]);
        this._events.set('3-14', [new CalendarEvent('رحلت امام خمینی', true)]);
        this._events.set('3-15', [new CalendarEvent('قیام خونین 15 خرداد', true)]);
        this._events.set('3-20', [new CalendarEvent('روز صنایع دستی', false)]);
        this._events.set('3-29', [new CalendarEvent('درگذشت دکتر علی شریعتی', false)]);
        this._events.set('3-31', [
            new CalendarEvent('شهادت دکتر مصطفی چمران', false),
            new CalendarEvent('روز بسیج استادان', false),
        ]);
        this._events.set('4-1', [new CalendarEvent('روز اصناف', false)]);
        this._events.set('4-7', [new CalendarEvent('روز قوه قضاییه', false)]);
        this._events.set('4-8', [new CalendarEvent('روز مبارزه با سلاح‌های شیمیایی و میکروبی', false)]);
        this._events.set('4-10', [new CalendarEvent('روز صنعت و معدن', false)]);
        this._events.set('4-14', [new CalendarEvent('روز قلم', false)]);
        this._events.set('4-18', [new CalendarEvent('روز ادبیات کودکان و نوجوانان', false)]);
        this._events.set('4-23', [new CalendarEvent('روز گفت‌وگو و تعامل سازنده با جهان', false)]);
        this._events.set('4-25', [new CalendarEvent('روز بهزیستی و تامین اجتماعی', false)]);
        this._events.set('5-9', [new CalendarEvent('روز اهدای خون', false)]);
        this._events.set('5-14', [new CalendarEvent('روز خانواده و تکریم بازنشستگان', false)]);
        this._events.set('5-17', [new CalendarEvent('روز خبرنگار', false)]);
        this._events.set('5-21', [new CalendarEvent('روز حمایت از صنایع کوچک', false)]);
        this._events.set('5-22', [new CalendarEvent('روز تشکل‌ها و مشارکت‌های اجتماعی', false)]);
        this._events.set('5-23', [new CalendarEvent('روز مقاومت اسلامی', false)]);
        this._events.set('5-29', [new CalendarEvent('روز تجلیل از اسرا و مفقودان', false)]);
        this._events.set('5-30', [
            new CalendarEvent('روز بزرگداشت علامه مجلسی', false),
            new CalendarEvent('روز جهانی مسجد', false),
        ]);
        this._events.set('6-1', [
            new CalendarEvent('روز بزرگداشت ابوعلی سینا', false),
            new CalendarEvent('روز پزشک', false),
        ]);
        this._events.set('6-4', [new CalendarEvent('روز کارمند', false)]);
        this._events.set('6-5', [
            new CalendarEvent('روز بزرگداشت محمدبن‌زکریا رازی', false),
            new CalendarEvent('روز داروسازی', false),
            new CalendarEvent('روز کشتی', false),
        ]);
        this._events.set('6-8', [new CalendarEvent('روز مبارزه با تروریسم', false)]);
        this._events.set('6-13', [
            new CalendarEvent('روز بزرگداشت ابوریحان بیرونی', false),
            new CalendarEvent('روز تعاون', false),
        ]);
        this._events.set('6-21', [new CalendarEvent('روز سینما', false)]);
        this._events.set('6-23', [new CalendarEvent('روز بزرگداشت سلمان فارسی', false)]);
        this._events.set('6-27', [
            new CalendarEvent('روز بزرگداشت شهریار', false),
            new CalendarEvent('روز شعر و ادب فارسی', false),
        ]);
        this._events.set('7-5', [new CalendarEvent('روز گردشگری', false)]);
        this._events.set('7-7', [
            new CalendarEvent('روز آتش‌نشانی و امنیت', false),
            new CalendarEvent('روز بزرگداشت شمس', false),
        ]);
        this._events.set('7-8', [new CalendarEvent('روز بزرگداشت مولوی', false)]);
        this._events.set('7-12', [new CalendarEvent('روز وقف', false)]);
        this._events.set('7-13', [new CalendarEvent('روز نیروی انتظامی', false)]);
        this._events.set('7-14', [new CalendarEvent('روز دامپزشکی', false)]);
        this._events.set('7-15', [new CalendarEvent('روز روستا و عشایر', false)]);
        this._events.set('7-20', [new CalendarEvent('روز بزرگداشت حافظ', false)]);
        this._events.set('7-24', [new CalendarEvent('روز ملی پارالمپیک', false)]);
        this._events.set('7-26', [new CalendarEvent('روز تربیت بدنی و ورزش', false)]);
        this._events.set('7-29', [new CalendarEvent('روز صادرات', false)]);
        this._events.set('8-8', [new CalendarEvent('روز نوجوان و بسیج دانشجویی', false)]);
        this._events.set('8-13', [new CalendarEvent('روز دانش‌آموز', false)]);
        this._events.set('8-14', [new CalendarEvent('روز فرهنگ عمومی', false)]);
        this._events.set('8-24', [new CalendarEvent('روز کتاب، کتاب‌خوانی و کتابدار', false)]);
        this._events.set('9-7', [new CalendarEvent('روز نیروی دریایی', false)]);
        this._events.set('9-9', [new CalendarEvent('روز بزرگداشت شیخ مفید', false)]);
        this._events.set('9-16', [new CalendarEvent('روز دانشجو', false)]);
        this._events.set('9-25', [new CalendarEvent('روز پژوهش', false)]);
        this._events.set('9-27', [new CalendarEvent('روز وحدت حوزه و دانشگاه', false)]);
        this._events.set('9-30', [new CalendarEvent('شب یلدا', false)]);
        this._events.set('10-5', [new CalendarEvent('روز ایمنی در برابر زلزله و کاهش اثرات بلایای طبیعی', false)]);
        this._events.set('11-14', [new CalendarEvent('روز فناوری فضایی', false)]);
        this._events.set('11-19', [new CalendarEvent('روز نیروی هوایی', false)]);
        this._events.set('11-22', [new CalendarEvent('پیروزی انقلاب اسلامی', true)]);
        this._events.set('11-19', [new CalendarEvent('روز اقتصاد مقاومتی و کارآفرینی', false)]);
        this._events.set('12-5', [
            new CalendarEvent('روز بزرگداشت خواجه نصیرالدین طوسی', false),
            new CalendarEvent('روز مهندسی', false),
        ]);
        this._events.set('12-14', [
            new CalendarEvent('روز احسان و نیکوکاری', false),
            new CalendarEvent('روز ترویج فرهنگ قرض‌الحسنه', false),
        ]);
        this._events.set('12-15', [new CalendarEvent('روز درختکاری', false)]);
        this._events.set('12-20', [new CalendarEvent('روز راهیان نور', false)]);
        this._events.set('12-21', [new CalendarEvent('روز بزرگداشت نظامی گنجوی', false)]);
        this._events.set('12-25', [new CalendarEvent('روز بزرگداشت پروین اعتصامی', false)]);
        this._events.set('12-29', [new CalendarEvent('روز ملی شدن صنعت نفت', true)]);
    }

    getEvents(day) {
        let events = this._events.get(`${day.getPersianMonth() + 1}-${day.getPersianDate()}`);
        if (Array.isArray(events))
            return events;
        return [];
    }
};
