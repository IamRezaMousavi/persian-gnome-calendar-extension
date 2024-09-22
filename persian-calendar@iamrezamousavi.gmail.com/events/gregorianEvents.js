/*
 * see https://en.wikipedia.org/wiki/International_Days_UNESCO
 * or see Farsi page https://fa.wikipedia.org/wiki/%D8%B1%D9%88%D8%B2%D9%87%D8%A7%DB%8C_%D8%AC%D9%87%D8%A7%D9%86%DB%8C_%DB%8C%D9%88%D9%86%D8%B3%DA%A9%D9%88
 * And
 * see https://www.farhang.gov.ir/ershad_content/media/image/2020/09/1004261_orig.pdf
*/

import {CalendarEvent, CalendarEvents} from './calendarEvent.js';

export const GregorianEvents = class GregorianEvents extends CalendarEvents {
    constructor() {
        super();
        this._events.set('1-1', [new CalendarEvent('جشن آغاز سال نو میلادی', false)]);
        this._events.set('1-14', [
            new CalendarEvent('روز جهانی منطق', false),
            new CalendarEvent('جشن ولنتاین', false),
        ]);
        this._events.set('1-24', [
            new CalendarEvent('روز جهانی آموزش', false),
            new CalendarEvent('روز جهانی فرهنگ آفریقایی', false),
        ]);
        this._events.set('1-26', [new CalendarEvent('روز جهانی گمرک', false)]);
        this._events.set('1-27', [new CalendarEvent('روز جهانی یادبود هولوکاست', false)]);
        this._events.set('2-11', [new CalendarEvent('روز جهانی زنان و دختران در علم', false)]);
        this._events.set('2-13', [new CalendarEvent('روز جهانی رادیو', false)]);
        this._events.set('2-20', [new CalendarEvent('روز جهانی عدالت اجتماعی', false)]);
        this._events.set('2-21', [new CalendarEvent('روز جهانی زبان مادری', false)]);
        this._events.set('3-4', [new CalendarEvent('روز جهانی مهندسی برای توسعه پایدار', false)]);
        this._events.set('3-8', [new CalendarEvent('روز جهانی زن', false)]);
        this._events.set('3-14', [new CalendarEvent('روز جهانی ریاضیات', false)]);
        this._events.set('3-20', [
            new CalendarEvent('روز جهانی شادی', false),
            new CalendarEvent('روز جهانی فرانکفونی', false),
        ]);
        this._events.set('3-21', [
            new CalendarEvent('روز جهانی نوروز', false),
            new CalendarEvent('روز جهانی شعر', false),
            new CalendarEvent('روز جهانی رفع تبعیض نژادی', false),
        ]);
        this._events.set('3-22', [new CalendarEvent('روز جهانی آب', false)]);
        this._events.set('3-23', [new CalendarEvent('روز جهانی هواشناسی', false)]);
        this._events.set('3-27', [new CalendarEvent('روز جهانی تئاتر', false)]);
        this._events.set('4-4', [new CalendarEvent('روز جهانی ضد مین', false)]);
        this._events.set('4-6', [new CalendarEvent('روز جهانی ورزش برای توسعه و صلح', false)]);
        this._events.set('4-7', [new CalendarEvent('روز جهانی بهداشت', false)]);
        this._events.set('4-12', [new CalendarEvent('روز جهانی کیهان نوردی', false)]);
        this._events.set('4-15', [new CalendarEvent('روز جهانی هنر', false)]);
        this._events.set('4-22', [new CalendarEvent('روز زمین', false)]);
        this._events.set('4-23', [new CalendarEvent('روز جهانی کتاب', false)]);
        this._events.set('4-27', [new CalendarEvent('روز جهانی طراحی و گرافیک', false)]);
        this._events.set('4-30', [new CalendarEvent('روز جهانی جاز', false)]);
        this._events.set('5-1', [new CalendarEvent('روز جهانی کارگر', false)]);
        this._events.set('5-3', [new CalendarEvent('روز جهانی آزادی مطبوعات', false)]);
        this._events.set('5-5', [
            new CalendarEvent('روز جهانی ماما', false),
            new CalendarEvent('روز میراث جهانی آفریقا', false),
            new CalendarEvent('روز جهانی زبان پرتغالی', false),
        ]);
        this._events.set('5-8', [new CalendarEvent('روز جهانی صلیب سرخ و هلال احمر', false)]);
        this._events.set('5-15', [new CalendarEvent('روز جهانی خانواده', false)]);
        this._events.set('5-16', [
            new CalendarEvent('روز جهانی نور', false),
            new CalendarEvent('روز جهانی زندگی با هم در صلح', false),
        ]);
        this._events.set('5-17', [new CalendarEvent('روز جهانی ارتباطات', false)]);
        this._events.set('5-18', [new CalendarEvent('روز جهانی موزه و میراث فرهنگی', false)]);
        this._events.set('5-21', [new CalendarEvent('روز جهانی تنوع فرهنگی برای گفتگو و توسعه', false)]);
        this._events.set('5-22', [new CalendarEvent('روز جهانی تنوع زیستی', false)]);
        this._events.set('5-29', [new CalendarEvent('روز جهانی کلاه‌آبی‌های سازمان ملل', false)]);
        this._events.set('5-31', [new CalendarEvent('روز جهانی بدون دخانیات', false)]);
        this._events.set('6-4', [new CalendarEvent('روز جهانی کودکان قربانی تجاوز', false)]);
        this._events.set('6-5', [new CalendarEvent('روز جهانی محیط زیست', false)]);
        this._events.set('6-8', [new CalendarEvent('روز جهانی اقیانوس‌ها', false)]);
        this._events.set('6-10', [new CalendarEvent('روز جهانی صنایع دستی', false)]);
        this._events.set('6-12', [new CalendarEvent('روز جهانی مبارزه با کار کودکان', false)]);
        this._events.set('6-14', [new CalendarEvent('روز جهانی اهدای خون', false)]);
        this._events.set('6-17', [new CalendarEvent('روز جهانی مبارزه با بیابان و خشکسالی', false)]);
        this._events.set('6-20', [new CalendarEvent('روز جهانی پناهندگان', false)]);
        this._events.set('6-23', [new CalendarEvent('روز جهانی خدمات دولتی', false)]);
        this._events.set('6-26', [new CalendarEvent('روز جهانی مبارزه با مواد مخدر', false)]);
        this._events.set('7-11', [new CalendarEvent('روز جهانی جمعیت', false)]);
        this._events.set('7-18', [new CalendarEvent('روز جهانی نلسون ماندلا', false)]);
        this._events.set('7-26', [new CalendarEvent('روز جهانی حفاظت از اکوسیستم حرا', false)]);
        this._events.set('8-1', [new CalendarEvent('روز جهانی شیر مادر', false)]);
        this._events.set('8-9', [new CalendarEvent('روز جهانی بومیان', false)]);
        this._events.set('8-12', [new CalendarEvent('روز جهانی جوانان', false)]);
        this._events.set('8-13', [new CalendarEvent('روز جهانی چپ‌دست‌ها', false)]);
        this._events.set('8-19', [new CalendarEvent('روز جهانی عکاسی', false)]);
        this._events.set('8-23', [new CalendarEvent('روز جهانی یادآوری تجارت برده و لغو آن', false)]);
        this._events.set('8-31', [new CalendarEvent('روز جهانی وبلاگ', false)]);
        this._events.set('9-8', [new CalendarEvent('روز جهانی سوادآموزی', false)]);
        this._events.set('9-10', [new CalendarEvent('روز جهانی پیشگیری از خودکشی', false)]);
        this._events.set('9-15', [new CalendarEvent('روز جهانی مردم سالاری', false)]);
        this._events.set('9-16', [new CalendarEvent('روز جهانی نگه‌داری از لایه ازن', false)]);
        this._events.set('9-20', [new CalendarEvent('روز جهانی ورزش دانشگاهی', false)]);
        this._events.set('9-21', [new CalendarEvent('روز جهانی صلح', false)]);
        this._events.set('9-27', [new CalendarEvent('روز جهانی جهان‌گردی', false)]);
        this._events.set('9-28', [new CalendarEvent('روز جهانی دسترسی جهانی به اطلاعات', false)]);
        this._events.set('9-30', [
            new CalendarEvent('روز جهانی دریانوردی', false),
            new CalendarEvent('روز جهانی ناشنوایان', false),
            new CalendarEvent('روز جهانی ترجمه و مترجم', false),
        ]);
        this._events.set('10-1', [new CalendarEvent('روز جهانی سالمندان', false)]);
        this._events.set('10-4', [new CalendarEvent('آغاز هفته جهانی فضا', false)]);
        this._events.set('10-5', [new CalendarEvent('روز جهانی آموزگار', false)]);
        this._events.set('10-8', [new CalendarEvent('روز جهانی کودک', false)]);
        this._events.set('10-9', [new CalendarEvent('روز جهانی پست', false)]);
        this._events.set('10-10', [
            new CalendarEvent('روز جهانی بهداشت روان', false),
            new CalendarEvent('روز جهانی مبارزه با حکم اعدام', false),
        ]);
        this._events.set('10-11', [new CalendarEvent('روز جهانی دختر', false)]);
        this._events.set('10-13', [new CalendarEvent('روز جهانی کاهش بلایا', false)]);
        this._events.set('10-14', [new CalendarEvent('روز جهانی استاندارد', false)]);
        this._events.set('10-15', [new CalendarEvent('روز جهانی عصای سفید', false)]);
        this._events.set('10-16', [new CalendarEvent('روز جهانی غذا', false)]);
        this._events.set('10-17', [new CalendarEvent('روز جهانی مبارزه با فقر', false)]);
        this._events.set('10-24', [
            new CalendarEvent('روز جهانی سارمان ملل', false),
            new CalendarEvent('روز جهانی اخبار', false),
        ]);
        this._events.set('10-27', [new CalendarEvent('روز جهانی میراث سمعی و بصری', false)]);
        this._events.set('11-2', [new CalendarEvent('روز جهانی پایان دادن به مصونیت از مجازات برای جنایات علیه خبرنگاران', false)]);
        this._events.set('11-5', [
            new CalendarEvent('روز جهانی زبان رومی', false),
            new CalendarEvent('روز جهانی آگاهی از سونامی', false),
        ]);
        this._events.set('11-10', [new CalendarEvent('روز جهانی علم در خدمت صلح و توسعه پایدار', false)]);
        this._events.set('11-14', [
            new CalendarEvent('روز جهانی دیابت', false),
            new CalendarEvent('روز جهانی مبارزه با قاچاق غیرقانونی اموال فرهنگی', false),
        ]);
        this._events.set('11-16', [new CalendarEvent('روز جهانی مدارا', false)]);
        this._events.set('11-18', [
            new CalendarEvent('روز جهانی هنر اسلامی', false),
            new CalendarEvent('روز جهانی فلسفه', false),
        ]);
        this._events.set('11-19', [new CalendarEvent('روز جهانی آقایان', false)]);
        this._events.set('11-21', [new CalendarEvent('روز جهانی تلویزیون', false)]);
        this._events.set('11-25', [new CalendarEvent('روز جهانی مبارزه با خشونت علیه زنان', false)]);
        this._events.set('11-26', [new CalendarEvent('روز جهانی درخت زیتون', false)]);
        this._events.set('11-29', [new CalendarEvent('روز جهانی همبستگی با مردم فلسطین', false)]);
        this._events.set('12-1', [new CalendarEvent('روز جهانی ایدز', false)]);
        this._events.set('12-2', [new CalendarEvent('روز جهانی آزادی بردگان', false)]);
        this._events.set('12-3', [new CalendarEvent('روز جهانی افراد دارای معلولیت', false)]);
        this._events.set('12-7', [new CalendarEvent('روز جهانی هواپیمایی', false)]);
        this._events.set('12-10', [new CalendarEvent('روز جهانی حقوق بشر', false)]);
        this._events.set('12-11', [new CalendarEvent('روز جهانی کوه‌نوردی', false)]);
        this._events.set('12-18', [
            new CalendarEvent('روز جهانی مهاجرین', false),
            new CalendarEvent('روز جهانی زبان عربی', false),
        ]);
        this._events.set('12-25', [new CalendarEvent('جشن کریسمس', false)]);
        this._events.set('12-30', [new CalendarEvent('روز جهانی همبستگی انسانی', false)]);
    }
};
